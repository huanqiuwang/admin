<template>
    <div class="search-wrapper" ref='wrapper'>

        <!-- 滚动条区域 -->
        <div class="search-scroll">

            <!-- 数据查询条件 -->
            <div class="search-query">
                <div class="basic-query">
    				<label>车牌:</label>
                    <input type="text" placeholder="请输入内容" v-model="car" />
                    <el-button type="primary" v-on:click="queryInit" :class="permit">查询</el-button>
                    <el-button v-on:click="reset" >重置</el-button>
                    <span :class="extraSwitchClass + ' search-expand'" v-on:click="switchQuery"><i class="el-icon-arrow-down"></i></span>
                </div>

                <div class="hidden color-list" :class="extraSwitchClass">
                    <span>车牌颜色：</span>
                    <el-checkbox v-model="allColor[0]">全部</el-checkbox>
                    <el-checkbox v-model="allColor[1]">蓝</el-checkbox>
                    <el-checkbox v-model="allColor[2]">黄</el-checkbox>
                    <el-checkbox v-model="allColor[3]">红</el-checkbox>
                    <el-checkbox v-model="allColor[4]">白</el-checkbox>
                    <el-checkbox v-model="allColor[5]">黑</el-checkbox>
                </div>
                <extra-list
                    :activeClass="extraSwitchClass"
                    :listData="extraQuery"
                    @chooseEvents="showTree">
                </extra-list>
            </div>

            <!-- 数据显示区域 -->
            <div class="search-content">
                <!-- 选项卡 -->
                <tab-case
                    @handleTab1="changeTimeMode"
                    @handleTab2="changePlaceMode">
                </tab-case>


                <!-- 时间模式 -->
                <el-table
                    @cell-click="showTable"
                    :data="tableData"
                    class="default-table time-mode-table"
                    :class="tableMode[0]"
                    highlight-current-row
                    @sort-change="sortControl"
                    @selection-change="selectChange">
                    <el-table-column type="selection" label="全选"></el-table-column>
                    <el-table-column prop="PLATE" label="车牌" :width="Wxxx"></el-table-column>
                    <el-table-column prop="COLOR" label="颜色" :width="Wx"></el-table-column>
                    <el-table-column prop="ADDRESS" label="采集地点"></el-table-column>
                    <el-table-column prop="CAPTURETIME" label="采集时间" sortable="custom" :formatter="hqDateFormat1" :width="Wxxxx"></el-table-column>
                    <el-table-column prop="FACEIMGS" label="人像">
                        <template slot-scope="scope">
                            <img v-if="!!scope.row.FACEIMGS" :src="scope.row.FACEIMGS.panoramaUrl" />
                            <small v-if="!!scope.row.FACEIMGS">{{scope.row.FACEIMGS.faceUrls ? scope.row.FACEIMGS.faceUrls.length : ''}}</small>
                        </template>
                    </el-table-column>
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
                    :span-method="objectSpanThird">
                    <el-table-column type="selection" label="全选"></el-table-column>
                    <el-table-column prop="plate" label="车牌" width="150px">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.plate}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="color" label="颜色" :width="Wx"></el-table-column>
                    <el-table-column prop="address" label="采集地点">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.address }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dayNumber" label="天数" :width="Wx" sortable="custom"></el-table-column>
                    <el-table-column prop="timeNumber" label="出现次数" :width="Wxx" sortable="custom"></el-table-column>
                    <el-table-column prop="earlyTime" label="最早时间" :width="Wxxxx" :formatter="hqDateFormat1"></el-table-column>
                    <el-table-column prop="lateTime" label="最晚时间" :width="Wxxxx" :formatter="hqDateFormat1"></el-table-column>
                </el-table>

                <div class="extra-table" :class="tableActiveClass">
                    <el-table
                        :data="smallTable"
                        class="default-table"
                        @cell-click="showTable">
                        <el-table-column type="index" :index="defaultIndex" label="序号"></el-table-column>
                        <el-table-column prop="CAPTURETIME" label="采集时间" :formatter="hqDateFormat1" sortable></el-table-column>
                        <el-table-column prop="FACEIMGS1" label="人像">
                            <template slot-scope="scope">
                                <img v-if="!!scope.row.FACEIMGS" :src="scope.row.FACEIMGS.panoramaUrl" />
                                <small v-if="!!scope.row.FACEIMGS">{{scope.row.FACEIMGS.faceUrls ? scope.row.FACEIMGS.faceUrls.length : ''}}</small>
                            </template>
                        </el-table-column>
                    </el-table>
                    <i class="table-close el-icon-d-arrow-right" v-on:click="tableClose"></i>
                </div>
            </div>
        </div>


        <!-- 分页与操作按钮显示区域 -->
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

        <!-- 图片预览 -->
        <carplate-img-preview
            :indexNow="pluginIndex"
            :activeClass="imgActiveClass"
            @hiddenPluginsHandle="imgPrevClose"
            :carplateImgList="imgPluginsData"></carplate-img-preview>
    </div>
</template>
<script>
    import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
    import { checkDatePicker } from '../../config/global.js'

    import tab from "../components/common/tab.vue"
    import tree from "../components/common/tree.vue"
    import extraList from "../components/common/datelist.vue"
    import carplateImgPreview from "../components/common/carplateImgPreview.vue"
    import pageSplit from '../components/common/pageSplit.vue'

    export default {
        name: 'searchCar',
        components: {
            'tab-case': tab,
            'tree-case': tree,
            'extra-list': extraList,
            'carplate-img-preview': carplateImgPreview,
            'page-split': pageSplit
        },
        data() {
            return {
                avoidRpeat: false,
                car: '',
                imgActiveClass: 'hidden',
                imgPluginsData: [],
                pluginIndex: 1,
                lastImgInfo: {},

                extraQuery: [],
                permit: 'permit',
                allColor: [false,false,false,false,false,false],
                colorChar: ['全部','蓝','黄','红','白','黑'],

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
                smallTable: [],
                selectList: [],
                selectList1: [],

                //  操作按钮-同行关联
                coporationBtn: ["轨迹地图可视化","关联IMSI/IMEI","关联MAC"],
                total: 0,
                ajaxConf: {
                    url: "",
                    url1: "/search/carplate/time-mode",
                    url2: "/search/carplate/location-mode",
                    url3: "/search/carplate/location-mode/address",
                    data: {
                        daySort: 'asc',
                        numberSort: 'asc',
                        sort: 'asc',
                        sort1: 'asc',
                        color: ['蓝','黄','红','白','黑'],
                        list: [],
                        pageNumber: 1,
                        pageSize: 50
                    }
                }
            }
        },
        methods: {
            reset: function(){
                this.car = '';
                this.extraQuery = [];
            },

            //  查询条件初始化,获取地点与时间的值，默认当用户不选择地点的时候是所有地点，时间为前一周
            queryInit: async function(){
                var i = 0,
                    datetime,
                    datetime1,
                    _this = this,
                    list = [];
                if(!this.trimAll(this.car)){
                    this.$message("请输入车牌号码！");
                    return false;
                }else if(this.tableMode[0] == 'active'){
                    this.ajaxConf.url = this.ajaxConf.url1;
                }else{
                    this.ajaxConf.url = this.ajaxConf.url2;
                }

                if(this.allColor[0] == true || this.allColor.join('').split('true').length == 1){
                    this.ajaxConf.data.color = ['蓝','黄','红','白','黑'].join(',');
                }else{
                    this.ajaxConf.data.color = [];
                    for(i = 1;i<=5;i++){
                        if(this.allColor[i]){
                            this.ajaxConf.data.color.push(this.colorChar[i]);
                        }
                    }
                    this.ajaxConf.data.color = this.ajaxConf.data.color.join(',');
                }

                for(i = 0;i<this.extraQuery.length;i++){

                    datetime = Date.parse(new Date(_this.extraQuery[i].startTime))/1000;
                    datetime1 = Date.parse(new Date(_this.extraQuery[i].endTime))/1000;
                    if(datetime != 0&&datetime1 != 0){
                        list.push({
                            startTime: datetime,
                            endTime: datetime1,
                            deviceId: this.extraQuery[i].deviceId || []
                        })
                    }else{
                        _this.$message("需要输入时间范围！在查询条件的第"+(i+1)+"行···");
                        return false;
                    }
                }
                let pass =  await checkDatePicker(this.extraQuery);

                this.ajaxConf.data.carplate = this.car;
                this.ajaxConf.data.list = JSON.stringify(list);
                this.dataInitFirst();
            },
            dataInit: async function(page_now,page_size,refresh){
                var res;
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

            dataInitFirst: async function(page_now,page_size,refresh){
                let res,res1;
                this.ajaxConf.data.pageNumber = 1;
                this.ajaxConf.data.pageSize = this.ajaxConf.data.pageSize;
                res = await loading(AJAX.post(this.ajaxConf.url1,this.ajaxConf.data));

                if(!refresh && this.tableMode[0] == 'active'){
                    this.total = res.page.total
                }

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
            imgPrevClose: function(){
                this.imgActiveClass = 'hidden';
            },

            //  列表操作
            showTable: async function(row, column, cell, event){
                var url,_this = this,address = row.address,res;
                if(column.property === "address"){
                    this.lastImgInfo = {
                        address: row.address,
                        color: row.color,
                        carplate: row.plate
                    }
                    res = await loading(AJAX.post(this.ajaxConf.url3,{
                        carplate: this.ajaxConf.data.car,
                        sort: this.ajaxConf.data.sort1,
                        address: row.address,
                        color: row.color,
                        carplate: row.plate,
                        list: this.ajaxConf.data.list
                    }));
                    this.tableActiveClass = 'active';
                    this.smallTable = res.result
                }else if(column.property === "FACEIMGS"){
                    this.imgPluginsData = this.tableData;
                    for(let i = 0;i<this.tableData.length;i++){
                        if(this.tableData[i].FACEIMGS == row.FACEIMGS){
                            this.pluginIndex = i+1;
                        }
                    }
                    this.imgActiveClass = 'active';
                }else if(column.property === "FACEIMGS1"){
                    this.imgPluginsData = this.smallTable;
                    for(let i = 0;i<this.smallTable.length;i++){
                        this.imgPluginsData[i].PLATE = this.lastImgInfo.carplate;
                        this.imgPluginsData[i].COLOR = this.lastImgInfo.color;
                        this.imgPluginsData[i].ADDRESS = this.lastImgInfo.address;
                        if(this.smallTable[i].FACEIMGS == row.FACEIMGS){
                            this.pluginIndex = i+1;
                        }
                    }
                    this.imgActiveClass = 'active';
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
                            carplate: this.selectList[i].PLATE,
                            ADDRESS: this.selectList[i].ADDRESS,
                            TIMEZON: ''
                        });
                        select.push(_this.tableData[i].RID);
                        mark = 1;
                    }
                }else if(this.tableMode[1] == "active"){
                    /*
                        1.地点模式下面的selectList仅仅保存了每个数组成员的第一个list的值，所以不能使用selectList获取值
                        2.第一层循环遍历selectList中被选取的数据，由于数据不全，所以用selected的数据索引ind作为根据继续循环
                        3.从tableData中读取，ind找到位置，读取row为该list的长度，遍历每一个选项
                        tableData: [
                            {ind: 0,row: 2,list: [···]},
                            {ind: 1,row: 2,list: [···]},    //  该两项在后台的格式原本为一个list,页面勾选之后获取ind：0

                            {ind: 2,row: 3,list: [···]},
                            {ind: 3,row: 3,list: [···]},
                            {ind: 4,row: 3,list: [···]},    //  该三项在后台的格式原本为一个list,页面勾选之后获取ind：2
                        ]
                        4.数据解析如下：
                     */
                    for(i = 0; i < this.selectList1.length;i++){                                                    //  首层遍历，查询被选中数据起点
                        for(j = this.selectList1[i].ind;j<this.selectList1[i].ind+this.selectList1[i].row;j++){     //  从起点查找出整个被选中的数据索引
                            for(let n = 0;n<this.tableData1[j].list.length;n++){                                    //  每个索引都要展开
                                jsondata.push({
                                    CAPTURETIME: this.tableData1[j].list[n].captureTime,
                                    DEVICEID: this.tableData1[j].list[n].deviceId,
                                    carplate: this.tableData1[j].plate,
                                    ADDRESS: this.tableData1[j].address,
                                    TIMEZON: ''
                                });
                                // select.push(_this.tableData1[j].plate);
                            }
                            select.push(_this.tableData1[j].plate);
                        }
                        mark = 1;
                    }
                }

                if(mark == 0){
                    this.$message("您还未选取需要操作的数据！");
                }else if(e == 0){
                    
                    if(this.tableMode[0] == "active"){
                        this.$parent.addNewTab({
                            url: "map/search/car/trail",
                            text: "车牌轨迹地图",
                            name: "DataSearchCarTrailMap",
                            query: {
                                key: this.searchKey,
                                cars: JSON.stringify(select)
                            }
                        });
                    }else{
                        this.$parent.addNewTab({
                            url: "map/search/car/trail/place",
                            text: "车牌轨迹地图",
                            name: "DataSearchCarTrailPlaceMap",
                            query: {
                                key: this.searchKey,
                                cars: JSON.stringify(select)
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
                        _this.$parent.addNewTab({
                            url: "/search/car/join/imei",
                            text: "车牌关联IMSI/IMEI",
                            name: 'sCjoinI',
                            query: {
                                time: value,
                                json: JSON.stringify(jsondata)
                            }
                        });
                    }else if(e == 2){
                        _this.$parent.addNewTab({
                            url: "/search/car/join/mac",
                            text: "车牌关联MAC",
                            name: 'sCjoinM',
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
            allColor: function(){
                console.log(this.allColor);
            },
            car: function(){
                this.car = this.trimAll(this.car);
                if(this.car.length >0){
                    this.permit = '';
                }else {
                    this.permit = 'permit';
                }
            },
            tableData1: function(){
                this.tableData1.map((e,i) => e.ind = i);
            }
        },
        mounted: function(){
            let _this = this;
            if(!!this.$route.query.searchKey){
                this.car = this.$route.query.searchKey;
                setTimeout(function(){
                    _this.queryInit();
                },300);
            }
        },
        activated: function(){
            if(!!this.$route.query.searchKey && this.car != this.$route.query.searchKey){
                this.car = this.$route.query.searchKey
                setTimeout(function(){
                    _this.queryInit();
                },300);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hidden.active{
        display: block;
    }
    .color-list{
        padding: 10px 20px 5px 35px;
        background: #f3f3f3;
        input{
            width: 16px;
            height: 16px;
        }
        .el-checkbox+.el-checkbox{
            margin-left: 20px;
        }
        .el-checkbox__label{
            padding-left: 5px;
        }
    }

    table{
        tr{
            th,td{
                img{
                    width: 60px;
                    height: 60px;
                    position: relative;
                    top: 4px;
                }
            }
            .cell{
                small{
                    position: relative;
                    bottom: 35px;
                    left: -20px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #fd6868;
                    color: white;
                    display: inline-block;
                    font-size: 20px;
                    line-height: 30px;
                    transform: scale(.5,.5);
                    overflow: hidden;
                }
            }
        }
    }
</style>
