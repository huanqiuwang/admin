<template>
    <div class="search-wrapper">

        <!-- 滚动条区域 -->
        <div class="search-scroll">
            <div class="search-query">
                <extra-list
                    :activeClass="extraSwitchClass"
                    :listData="extraQuery"
                    @chooseEvents="showTree">
                </extra-list>

                <div class="basic-query">
                    <el-button type="primary" v-on:click="queryInit">查询</el-button>
                    <el-button v-on:click="reset" >重置</el-button>
                    <span :class="extraSwitchClass + ' search-expand'" v-on:click="switchQuery"><i class="el-icon-arrow-down"></i></span>
                </div>
            </div>

            <div class="search-content">
                <div class="search-table">

                    <el-table 
                        :data="tableData.list" 
                        class="default-table" 
                        @cell-click="showTable" 
                        @sort-change="sortControl"
                        highlight-current-row
                        @selection-change="selectChange" >
                        <el-table-column type="selection" label="全选"></el-table-column>
                        <el-table-column label="MAC">
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.mac }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="出现地点数" sortable="custom" prop="deviceCount">
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.deviceCount }}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="extra-table" :class="tableActiveClass">

                        <!-- imsi、imei -->
                        <el-table :data="tableData.default" class="default-table" :class="extraTableList[0]">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="capturetime" :formatter="hqDateFormat1" label="采集时间" sortable></el-table-column>
                            <el-table-column prop="deviceName" label="采集地点"></el-table-column>
                        </el-table>

                        <!-- 按地点数查询 -->
                        <el-table :data="tableData.byPlace" class="default-table" :class="extraTableList[1]">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="address" label="采集地点" ></el-table-column>
                            <el-table-column prop="count" label="匹配次数" sortable></el-table-column>
                            <el-table-column prop="begin" label="最早时间" :formatter="hqDateFormat1" sortable></el-table-column>
                            <el-table-column prop="last" label="最晚时间" :formatter="hqDateFormat1" sortable></el-table-column>
                        </el-table>

                        <i class="table-close el-icon-d-arrow-right" v-on:click="tableClose"></i>
                    </div>
                </div>
            </div>
        </div>

         <div class="search-coperation bottom-coperation">
            <el-button v-for="(item,ind) in coporationBtn" v-on:click="timeThrow(ind)" :key="ind">{{item}}</el-button>
            <page-split
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

        <!-- 地点选择器 -->
        <place-filter
            :placeListData="placeData"
            :placeActive="showPlace"
            @confirmHandle="selectConfirm"
            @closeHandle="closePlace"></place-filter>
    </div>
</template>
<script>
    import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
    import { checkDatePicker } from '../../../config/global.js'

    import tree from "../../components/common/treeForImpact.vue"
    import extraList from "../../components/common/datelistForImpact.vue"
    import placeList from "../../components/common/placeFilter.vue"
    import pageSplit from '../../components/common/pageSplit.vue'

    export default {
        name: "macImpact",
        data() {
            return {
                extraQuery: [],         //  额外的查询条件保存值
                showPlace: 'hidden',
                placeData: [],
                searchKey: '',
                selected: [],
                extraTableList: ['hidden','hidden','hidden','hidden'],

                //  查询开关
                extraSwitchClass: 'active',

                //  树参数
                treeActiveClass: 'hidden',
                selectTreeIndex: 0,

                //  列表参数
                tableActiveClass: '',
                tableData: {
                    list: [],
                    default: [],
                    byArea: [],
                    byPlace: [],
                    byTime: []
                },
                sort: ['desc','desc','desc','desc','desc','desc','desc'],
                selectList: [false,false],

                //  操作按钮-同行关联
                coporationBtn: ["轨迹地图可视化","过滤地点"],
                total: 0,
                ajaxConf: {
                    url: "",
                    url1: "/mac/crash",
                    url2: "/mac/together/info",
                    url3: "/mac/together/device",
                    data: {
                        sort: 1,
                        list: [],
                        page_now: 1,
                        page_size: 50
                    },
                    default: '', //  保存默认的列表值，仅仅在点击查询按钮时更改,
                    rids: ''
                }
            }
        },
        components: {
            'tree-case': tree,
            'extra-list': extraList,
            'place-filter': placeList,
            'page-split': pageSplit
        },
        methods: {
            reset: function(){
                this.time = '';
                this.extraQuery = [];
            },

            //  查询条件初始化,获取地点与时间的值，默认当用户不选择地点的时候是所有地点，时间为前一周
            queryInit: async function(){
                var i = 0,
                    datetime,
                    datetime1,
                    _this = this,
                    j,list = [],
                    queryList = [];

                for(i = 0;i<this.extraQuery.length;i++){

                    datetime = Date.parse(new Date(_this.extraQuery[i].startTime))/1000;
                    datetime1 = Date.parse(new Date(_this.extraQuery[i].endTime))/1000;
                    if(datetime != 0&&datetime1 != 0&&!!this.extraQuery[i].deviceId.length){
                        list.push({
                            startTime: datetime,
                            endTime: datetime1,
                            deviceId: this.extraQuery[i].deviceId
                        })
                        queryList.push({
                            checked: false,
                            name: this.extraQuery[i].place,
                            stime: datetime,
                            etime: datetime1
                        })
                    }else if(datetime != 0&&datetime1 != 0&&!this.extraQuery[i].deviceId.length){
                        this.$message("地点为必填选项！在查询条件的第"+(i+1)+"行···");
                        return false;
                    }else{
                        _this.$message("需要输入时间范围！在查询条件的第"+(i+1)+"行···");
                        return false;
                    }
                }
                if(!this.checkSameDatas(list)){
                    this.$message("相同地点存在重复的时间段！");
                    return false;
                }

                let pass =  await checkDatePicker(this.extraQuery);
                this.placeData = queryList;
                this.ajaxConf.data.list = JSON.stringify(list);
                this.ajaxConf.default = JSON.stringify(list);
                this.dataInit();
            },
            dataInit: async function(page_now,page_size,refresh){
                var _this = this,e;
                this.ajaxConf.data.page_now = page_now || 1;
                this.ajaxConf.data.page_size = page_size || this.ajaxConf.data.page_size;

                e = await loading(AJAX.post(_this.trimAll(`
                    ${_this.ajaxConf.url1}/
                    ${this.ajaxConf.data.page_now}/
                    ${this.ajaxConf.data.page_size}/
                    ${this.ajaxConf.data.sort}`),{alist: _this.ajaxConf.data.list}));
                if(!refresh){
                    this.total = e.page.totalCount;
                }
                if(e.result.length == 0){
                    this.$message("您未查到任何数据！");
                    this.tableData.list = e.result;
                }else{
                    this.ajaxConf.rids = e.rids;
                    this.searchKey = e.key;
                    this.tableData.list = e.result;
                }
            },
            closePlace: function(){
                this.showPlace = 'hidden';
            },
            selectConfirm: function(e){
                var list = JSON.parse(this.ajaxConf.default),arr = [],_this = this;
                this.showPlace = "hidden";
                for(let i = 0;i<e.length;i++){
                    arr.push(list[e[i]]);
                }
                this.ajaxConf.data.list = JSON.stringify(arr);
                this.dataInit();
            },

            // 分页控制
            handleSizeChange(val) {
                this.dataInit(1,val,1);
            },
            handleCurrentChange(val) {
                this.dataInit(val,0,1);
            },
            //  排序
            sortControl: function(e){
                if(e.prop == 'deviceCount'){
                    this.ajaxConf.data.sort = this.ajaxConf.data.sort == 1?2:1;
                }
                this.dataInit();
            },
            //  查询条件展开收起
            switchQuery: function(){
                this.extraSwitchClass = this.extraSwitchClass == 'active'?'':'active';
            },

            //  列表操作
            showTable: async function(row, column, cell, event){
                var url,_this = this,e,type;
                if(column.label == "出现地点数"){
                    type = 1;
                    e = await loading(AJAX.post(this.ajaxConf.url3,{rids: row.rids}))
                    this.tableData.byPlace = e.result;
                }else if(column.label == "MAC"){
                    type = 0;
                    e = await loading(AJAX.post(this.ajaxConf.url2,{rids: row.rids}))
                    this.tableData.default = e.result;
                }else{
                    return false;
                }
                this.tableActiveClass = 'active';
                this.extraTableList = ["hidden","hidden"];
                this.$set(_this.extraTableList,type,'');
            },
            tableClose: function(){
                this.tableActiveClass = '';
            },
            selectChange: function(e){
                this.selected = e;
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

            //  列表按钮事件控制--关联同行--去往轨迹地图
            timeThrow(e) {
                var _this = this,i,mark = 0,jsondata = [],select = [];;
                if(e == 0){
                    if(!this.selected.length){
                        this.tableData.list.map(item => {
                            select.push(item.mac);
                        })
                    }else {
                        for(i = 0; i < this.selected.length;i++){
                            select.push(this.selected[i].mac);
                        }
                    }
                    this.$parent.addNewTab({
                        url: "map/analyze/mac/collision",
                        text: "MAC碰撞地图",
                        name: 'AnalyzeToolMACCollisionMap',
                        query: {
                            key: this.searchKey,
                            macs: select.join(",")
                        }
                    });
                }else if(e == 1){
                    this.showPlace = 'active';
                }
            }
        },
        mounted: function(){
            if(!!this.$route.query.searchKey){
                this.car = this.$route.query.searchKey;
                this.queryInit();
            }
        },
    }
</script>

<style lang="scss" scoped>
    //  查询小图标更改样式
    .basic-query .search-expand.active:before{
        top: -16px;
        border-top: 10px solid #f2f2f2;
        border-bottom: 10px solid transparent;
    }

    .extra-table table{
        th{
            position: relative;
            &>small:nth-child(1){
                position: relative;
                top: -8px;
                left: 30px;
            }
            &>small:nth-child(2){
                position: relative;
                top: 8px;
                left: -30px;
            }
        }
    }
</style>
