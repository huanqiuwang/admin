<template>
    <div class="search-wrapper" ref='wrapper'>

        <!-- 滚动条区域 -->
        <div class="search-scroll">

            <!-- 数据查询条件 -->
            <div class="search-query">
                <div class="basic-query">
    				<label>MAC:</label>
                    <input type="text" placeholder="请输入内容" v-model="mac" />
                    <el-button type="primary" v-on:click="queryInit" :class="permit">查询</el-button>
                    <el-button v-on:click="reset" >重置</el-button>
                    <span :class="extraSwitchClass + ' search-expand'" v-on:click="switchQuery"><i class="el-icon-arrow-down"></i></span>
                </div>

                <extra-list
                    :activeClass="extraSwitchClass"
                    :listData="extraQuery"
                    @chooseEvents="showTree">
                </extra-list>
            </div>

            <div class="search-content">
            
                <!-- 选项卡 -->
                <tab-case 
                    @handleTab1="changeTimeMode" 
                    @handleTab2="changePlaceMode">
                </tab-case> 


                <!-- 时间模式 -->
                <el-table 
                    :data="tableData" 
                    class="default-table time-mode-table" 
                    :class="tableMode[0]"
                    highlight-current-row
                    @sort-change="sortControl"
                    @selection-change="selectChange">
                    <el-table-column type="selection" label="全选"></el-table-column>
                    <el-table-column prop="MAC" label="MAC"></el-table-column>
                    <el-table-column prop="ADDRESS" label="采集地点"></el-table-column>
                    <el-table-column prop="CAPTURETIME" label="采集时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
                </el-table>

                <!-- 地点模式 -->
                <el-table 
                    :data="tableData1" 
                    class="default-table place-mode-table" 
                    :class="tableMode[1]"
                    highlight-current-row
                    @cell-click="showTable"
                    @sort-change="sortControl"
                    @selection-change="selectChange"
                    :span-method="objectSpanMethod">
                    <el-table-column type="selection" label="全选"></el-table-column>
                    <el-table-column prop="imac" label="MAC"></el-table-column>
                    <el-table-column label="采集地点">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.address }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dayNumber" label="天数" sortable="custom"></el-table-column>
                    <el-table-column prop="timeNumber" label="出现次数" sortable="custom"></el-table-column>
                    <el-table-column prop="earlyTime" label="最早时间"  :formatter="hqDateFormat1"></el-table-column>
                    <el-table-column prop="lateTime" label="最晚时间"  :formatter="hqDateFormat1"></el-table-column>
                </el-table>
                <div class="extra-table" :class="tableActiveClass">
                    <place-small-table
                        url="search/mac/location-mode/address"
                        :list="ajaxConf.data.list"
                        :address="address"
                        :searchData="ajaxConf.data.imac"></place-small-table>
                    <i class="table-close el-icon-d-arrow-right" v-on:click="tableClose"></i>
                </div>
            </div>
        </div>
        
        <!-- 分页与额外的按钮管理 -->
        <div class="search-coperation bottom-coperation">
            <el-button v-for="(item,ind) in coporationBtn" v-on:click="timeThrow(ind)" :key="ind">{{item}}</el-button>
            <page-split
                :class="tableMode[0]"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
                :pageTotal="total"></page-split>
        </div>

        <!-- 树形选择器 -->
        <tree-case
            :activeClass="treeActiveClass"
            @closeTree="treeClose"
            @getCheckedCallback="getNodes">
        </tree-case>
    </div>
</template>
<script>
    import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
    import { checkDatePicker } from '../../config/global.js'

    import tab from "../components/common/tab.vue"
    import tree from "../components/common/tree.vue"
    import extraList from "../components/common/datelist.vue"
    import placeSmallTable from "../components/Table/SearchJoin/place.vue"
    import pageSplit from '../components/common/pageSplit.vue'

    export default {
        name: "searchMac",
        components: {
            'tab-case': tab,
            'tree-case': tree,
            'extra-list': extraList,
            'place-small-table': placeSmallTable,
            'page-split': pageSplit
        },
        data() {
            return {
                avoidRpeat: false,
                mac: '',
                extraQuery: [],
                permit: "permit",
                address: '',

                //  查询开关
                extraSwitchClass: 'active',

                //  树参数
                treeActiveClass: 'hidden',
                selectTreeIndex: 0,

                //  列表参数
                tableActiveClass: '',
                tableMode: ["active","hidden"],
                extraTableList: ['hidden'],
                tableData: [],
                tableData1: [],
                selectList: [],
                selectList1: [],

                //  操作按钮-同行关联
                coporationBtn: ["轨迹地图可视化","MAC同行","关联IMSI/IMEI","关联车牌"],
                total: 0,
                ajaxConf: {
                    url: "",
                    url1: "/search/mac/time-mode",
                    url2: "/search/mac/location-mode",
                    data: {
                        daySort: 'asc',
                        numberSort: 'asc',
                        sort: 'asc',
                        list: '',
                        imac: '',
                        pageNumber: 1,
                        pageSize: 50
                    }
                }
            }
        },
        methods: {
            reset: function(){
                this.mac = '';
                this.extraQuery = [];
            },

            //  查询条件初始化,获取地点与时间的值，默认当用户不选择地点的时候是所有地点，时间为前一周
            queryInit: async function(){
                var i = 0,
                    datetime,
                    datetime1,
                    j,list = [];

                for(i = 0;i<this.extraQuery.length;i++){
                    datetime = Date.parse(new Date(this.extraQuery[i].startTime))/1000;
                    datetime1 = Date.parse(new Date(this.extraQuery[i].endTime))/1000;
                    if(datetime != 0&&datetime1 != 0){
                        list.push({
                            startTime: datetime,
                            endTime: datetime1,
                            deviceId: this.extraQuery[i].deviceId || []
                        })
                    }else {
                        this.$message("需要输入时间范围！在查询条件的第"+(i+1)+"行···");
                        return false;
                    }
                }
                let pass =  await checkDatePicker(this.extraQuery);

                this.ajaxConf.data.imac = this.mac;
                this.ajaxConf.data.list = JSON.stringify(list);
                this.dataInitFirst();
            },
            dataInit: async function(page_now,page_size,refresh){
                let res;

                this.ajaxConf.url = this.tableMode[0] == 'active'? this.ajaxConf.url1: this.ajaxConf.url2;
                this.ajaxConf.data.pageNumber = page_now || 1;
                this.ajaxConf.data.pageSize = page_size || this.ajaxConf.data.pageSize;


                res = await loading(AJAX.post(this.ajaxConf.url,this.ajaxConf.data));
                if(!refresh && this.tableMode[0] == 'active'){
                    this.total = res.page.total
                }
                if(res.result.length == 0){
                    this.$message("您未查到任何数据！");
                    this.tableData = [];
                    this.tableData1 = [];
                }else if(this.tableMode[0] == 'active'){
                    this.searchKey = res.mapKey;
                    this.tableData = res.result;
                }else if(this.tableMode[1] == 'active'){
                    this.tableData1 = this.placeDataFormat(res.result);
                }
            },
            dataInitFirst: async function(){
                let res,res1;
                
                this.ajaxConf.data.pageNumber = 1;
                res = await loading(AJAX.post(this.ajaxConf.url1,this.ajaxConf.data));
                this.total = res.page.total;

                if(res.result.length == 0){
                    this.$message("您未查到任何数据！");
                    this.tableData = [];
                    this.tableData1 = [];
                }else{
                    this.searchKey = res.mapKey;
                    this.tableData = res.result;
                    res1 = await loading(AJAX.post(this.ajaxConf.url2,this.ajaxConf.data));
                    this.tableData1 = this.placeDataFormat(res1.result);
                }
            },

            // 分页控制
            handleSizeChange(val) {
                this.dataInit(1,val,1);
            },
            handleCurrentChange(val) {
                this.dataInit(val,0,1);
            },
            //  排序控制
            sortControl: function(e){
                if(e.prop == 'CAPTURETIME'){
                    this.ajaxConf.data.sort = this.ajaxConf.data.sort == 'desc'?"asc":"desc";
                    this.dataInit();
                }else if(e.prop == 'dayNumber'){
                    this.ajaxConf.data.daySort = this.ajaxConf.data.daySort == 'desc'?"asc":"desc";
                    this.ajaxConf.data.numberSort = '';
                    this.dataInit();
                }else if(e.prop == 'timeNumber'){
                    this.ajaxConf.data.numberSort = this.ajaxConf.data.numberSort == 'desc'?"asc":"desc";
                    this.ajaxConf.data.daySort = '';
                    this.dataInit();
                }
            },

            //  查询条件展开收起
            switchQuery: function(){
                this.extraSwitchClass = this.extraSwitchClass == 'active'?'':'active';
            },

            //  列表操作
            showTable: async function(row, column, cell, event){
                if(column.label == '采集地点'){
                    this.address = row.address;
                    this.tableActiveClass = 'active';
                }
            },
            tableClose: function(){
                this.tableActiveClass = '';
            },

            //  时间模式地点模式切换
            changeTimeMode: function(){
                this.tableClose();
                this.$set(this.tableMode,0,'active');
                this.$set(this.tableMode,1,'hidden');
            },
            changePlaceMode: function(){
                this.$set(this.tableMode,0,'hidden');
                this.$set(this.tableMode,1,'active');
            },

            selectChange: function(e){
                if(this.tableMode[0] == "active"){
                    this.selectList = e;
                }else{
                    this.selectList1 = e;
                }
            },

            // 获取树形菜单被选取的数据
            getNodes(e) {
                this.extraQuery[this.selectTreeIndex].place = e.nodes;
                this.extraQuery[this.selectTreeIndex].deviceId = e.keys;
                this.treeClose();
            },
            showTree: function(e){
                this.selectTreeIndex = e;
                this.treeActiveClass = '';
            },
            treeClose: function(){
                this.treeActiveClass = 'hidden';
            },

            //  列表按钮事件控制--关联同行
            async timeThrow(e) {
                var _this = this,i,j,mark = 0,jsondata = [],start = 0,select = [];

                // 判断该次点击是否有效
                if(!!this.avoidRpeat){
                    return false;
                }else if(this.tableMode[0] == "active"){
                    for(i = 0; i < this.selectList.length;i++){
                        jsondata.push({
                            CAPTURETIME: this.selectList[i].CAPTURETIME,
                            DEVICEID: this.selectList[i].DEVICEID,
                            MAC: this.selectList[i].MAC,
                            ADDRESS: this.selectList[i].ADDRESS,
                            TIMEZON: ''
                        });
                        select.push(_this.tableData[i].RID);
                        mark = 1;
                    }
                }else if(this.tableMode[1] == "active"){
                    for(i = 0; i < this.selectList1.length;i++){
                        for(j = i;j<this.selectList1[i].row+i;j++){
                            for(let n = 0;n<this.tableData1[j].list.length;n++){
                                jsondata.push({
                                    CAPTURETIME: this.tableData1[j].list[n].captureTime,
                                    DEVICEID: this.tableData1[j].list[n].deviceId,
                                    MAC: this.tableData1[j].imac,
                                    ADDRESS: this.tableData1[j].address,
                                    TIMEZON: ''
                                });
                                select.push(this.tableData1[j].list[n].RID);
                            }
                        }
                        mark = 1;
                    }
                }

                if(mark == 0){
                    this.$message("您还未选取需要操作的数据！");
                }else if(e == 0){
                    if(this.tableMode[0] == "active"){
                        this.$parent.addNewTab({
                            url: "map/search/mac/trail",
                            text: "MAC轨迹地图",
                            name: "DataSearchMACTrailMap",
                            query: {
                                key: this.searchKey,
                                macs: JSON.stringify(select)
                            }
                        });
                    }else{
                        this.$parent.addNewTab({
                            url: "map/search/mac/trail/place",
                            text: "MAC轨迹地图",
                            name: "DataSearchMACTrailPlaceMap",
                            query: {
                                key: this.searchKey,
                            }
                        });
                    }

                }else{
                    this.avoidRpeat = true;
                    let {value} = await this.$prompt('前后时间差是(单位：秒)', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValue: 60,
                        inputPattern: /^\d{1,5}.?/,
                        inputErrorMessage: '时间格式不正确'
                    }).catch(function(){
                        _this.avoidRpeat = false;
                    });
                    if(e == 1){
                        this.$parent.addNewTab({
                            url: "/search/mac/together",
                            text: "MAC同行",
                            name: 'searchMacTogether',
                            query: {
                                time: value,
                                json: JSON.stringify(jsondata)
                            }
                        });
                    }else if(e == 2){
                        this.$parent.addNewTab({
                            url: "/search/mac/join/imei",
                            text: "MAC关联IMSI",
                            name: 'sMjoinI',
                            query: {
                                time: value,
                                json: JSON.stringify(jsondata)
                            }
                        });
                    }else if(e == 3){
                        this.$parent.addNewTab({
                            url: "/search/mac/join/car",
                            text: "MAC关联车牌",
                            name: 'sMjoinC',
                            query: {
                                time: value,
                                json: JSON.stringify(jsondata)
                            }
                        });
                    }
                     setTimeout(function(){
                        _this.avoidRpeat = false;
                    },2000);
                }
            }
        },
        watch: {
            mac: function(){
                this.mac = this.trimAll(this.mac);
                if(this.mac.length == 12){
                    this.permit = '';
                }else {
                    this.permit = 'permit';
                }
            }
        },
        mounted: function(){
            let _this = this;
            if(!!this.$route.query.searchKey){
                this.mac = this.$route.query.searchKey;
                this.queryInit();
            }
        },
        activated: function(){
            if(!!this.$route.query.searchKey && this.mac != this.$route.query.searchKey){
                this.mac = this.$route.query.searchKey;
                setTimeout(function(){
                    _this.queryInit();
                },300);
            }
        }
    }
</script>