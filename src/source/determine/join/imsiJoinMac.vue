<template>
    <div class="search-wrapper" ref='wrapper'>

        <!-- 滚动条区域 -->
        <div class="search-scroll">
            <div class="search-query">
                <div class="basic-query">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <input type="text" placeholder="请输入内容" v-model="imei" />
                    <label>时间差(s)</label>
                    <input type="text" style="width: 100px;" placeholder="请输入内容" v-model="time" />
                    <el-button type="primary" :class="permit" v-on:click="queryInit">查询</el-button>
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
                                <el-tag size="medium">{{ scope.row.target}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="区域数">
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.areaCount }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="地点数" sortable="custom" prop="addrCount">
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.addrCount }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="timeCount" label="匹配次数" sortable="custom"></el-table-column>
                        <el-table-column prop="addrRate" :formatter="percentage" label="地点匹配度" ></el-table-column>
                        <el-table-column label="时间匹配度" >
                            <template slot-scope="scope">
                                <el-tag size="medium">{{ scope.row.timeRate }}%</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="minTime" label="最早时间" :formatter="hqDateFormat1"></el-table-column>
                        <el-table-column prop="maxTime" label="最晚时间" :formatter="hqDateFormat1"></el-table-column>
                    </el-table>

                    <div class="extra-table" :class="tableActiveClass">

                        <!-- imsi/imei -->
                        <el-table :data="tableData.default" style="width: 100%;" class="default-table" :class="extraTableList[0]">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="time" :formatter="hqDateFormat1" label="采集时间" sortable></el-table-column>
                            <el-table-column prop="addr" label="采集地点"></el-table-column>
                        </el-table>

                        <!-- 按区域数继续查询 -->
                        <el-table :data="tableData.byArea" class="default-table" :class="extraTableList[1]">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="areaName" label="区域名称"></el-table-column>
                            <el-table-column prop="timeCount" label="匹配次数" sortable></el-table-column>
                        </el-table>

                        <!-- 按地点数查询 -->
                        <el-table :data="tableData.byPlace" class="default-table" :class="extraTableList[2]">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column prop="addr" label="采集地点" ></el-table-column>
                            <el-table-column prop="timeCount" label="匹配次数" sortable></el-table-column>
                            <el-table-column prop="minTime" label="最早时间" :formatter="hqDateFormat1" sortable></el-table-column>
                            <el-table-column prop="maxTime" label="最晚时间" :formatter="hqDateFormat1" sortable></el-table-column>
                        </el-table>

                        <!-- 按时间匹配度查询 -->
                        <el-table 
                            :data="tableData.byTime" 
                            class="default-table" 
                            :class="extraTableList[3]" 
                            :span-method="objectSpanMethod">
                            <el-table-column prop="index" label="序号"></el-table-column>
                            <el-table-column prop="addr" label="采集地点" ></el-table-column>
                            <el-table-column prop="targetTime" 
                                :label="'采集时间\n('+
                                    (ajaxConf.data.imsi?'IMSI:'+ajaxConf.data.imsi:'IMEI:'+ajaxConf.data.imei)+')'" 
                                :formatter="hqDateFormat1"></el-table-column>
                            <el-table-column prop="realTime" :label="'采集时间\n(MAC:' + ajaxConf.data1.mac+')'" :formatter="hqDateFormat1"></el-table-column>
                        </el-table>

                        <i class="table-close el-icon-d-arrow-right" v-on:click="tableClose"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分页与额外的按钮管理 -->
        <div class="search-coperation bottom-coperation">
            <el-button v-on:click="timeThrow()">轨迹地图可视化</el-button>
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
    </div>
</template>
<script>
    import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
    import { checkDatePicker } from '../../../config/global.js'
    import tree from "../../components/common/tree.vue"
    import extraList from "../../components/common/datelist.vue"
    import pageSplit from '../../components/common/pageSplit.vue'
    export default {
        name: "IjoinM",
        data() {
            return {
                imei: '',               //  数据查询
                lastImei: '',           //  时间匹配度查询的右上角imsi
                time: 60,               //  默认的时间差
                extraQuery: [],         //  额外的查询条件保存值
                selected: [],
                permit: 'permit',

                extraTableList: ['hidden','hidden','hidden','hidden'],
                options: [{
                    value: '1',
                    label: 'IMSI'
                }, {
                    value: '2',
                    label: 'IMEI'
                }],
                value: '1',

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

                //  操作按钮-同行关联
                total: 0,
                ajaxConf: {
                    url: "",
                    url1: "/relate/imsi-mac",
                    url2: "/relate/imsi-mac-detail",
                    url3: "/relate/imsi-mac-area",
                    url4: "/relate/imsi-mac-addr",
                    url5: "/relate/imsi-mac-time",
                    data: {
                        list: [],
                        currentPage: 1,
                        pageSize: 50,
                        imei: '',
                        imsi: '',
                        time: 60,
                        sortCol: 'addrCount',
                        sort: 'desc',
                        sessionKey: ''
                    },
                    data1: {
                        mac: '',
                        sessionKey: '',
                        imsi: '',
                        imei: '',
                        list: [],
                        time: 60
                    }
                }
            }
        },
        components: {
            'tree-case': tree,
            'extra-list': extraList,
            'page-split': pageSplit
        },
        methods: {
            reset: function(){
                this.imei = '';
                this.time = 60;
                this.extraQuery = [];
            },

            //  查询条件初始化,获取地点与时间的值，默认当用户不选择地点的时候是所有地点，时间为前一周
            queryInit:  async function(){
                var i = 0,
                    datetime,
                    datetime1,
                    _this = this,
                    j,list = [];

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
                if(!this.imei){
                    this.$message("请填写需要查询的内容！");
                    return false;
                }else if(!this.checkSameDatas(list)){
                    this.$message("相同地点存在重复的时间段！");
                    return false;
                }else if(!this.trimAll(this.time)){
                    this.$message("时间差不能为空！");
                    return false;
                }else if(this.value == 1){
                    this.ajaxConf.data.imsi = this.imei;
                    this.ajaxConf.data1.imsi = this.imei;
                    this.ajaxConf.data.imei = '';
                    this.ajaxConf.data1.imei = '';
                }else{
                    this.ajaxConf.data.imei = this.imei;
                    this.ajaxConf.data1.imei = this.imei;
                    this.ajaxConf.data.imsi = '';
                    this.ajaxConf.data1.imsi = '';
                }

                let pass =  await checkDatePicker(this.extraQuery);
                this.ajaxConf.data.time = this.time;
                this.ajaxConf.data1.time = this.time;
                this.ajaxConf.data.list = JSON.stringify(list);
                this.ajaxConf.data1.list = JSON.stringify(list);
                this.dataInit();
            },
            dataInit: async function(page_now,page_size,refresh){
                var _this = this,e;
                this.ajaxConf.data.currentPage = page_now || 1;
                this.ajaxConf.data.pageSize = page_size || this.ajaxConf.data.pageSize;

                e = await loading(AJAX.post(_this.ajaxConf.url1,_this.ajaxConf.data));
                if(!refresh){
                    this.total = e.page.totalCount;
                }
                if(e.result.length == 0){
                    _this.$message("您未查到任何数据！");
                    _this.tableData.list = e.result;
                }else{
                    _this.ajaxConf.data.sessionKey = e.sessionKey;
                    _this.ajaxConf.data1.sessionKey = e.sessionKey;
                    _this.tableData.list = e.result;
                    _this.tableData.list.length = e.result.length;
                }
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
                if(e.prop == 'addrCount'){
                    this.ajaxConf.data.sortCol = 'addrCount';
                }else if(e.prop == 'timeCount'){
                    this.ajaxConf.data.sortCol = 'timeCount';
                }
                this.ajaxConf.data.sort = this.ajaxConf.data.sort == 'desc'?"asc":"desc";
                this.dataInit();
            },
            //  查询条件展开收起
            switchQuery: function(){
                this.extraSwitchClass = this.extraSwitchClass == 'active'?'':'active';
            },

            //  列表操作
            showTable: async function(row, column, cell, event){
                var url,_this = this,e,type;
                this.ajaxConf.data1.mac = row.target;
                if(column.label == "时间匹配度"){
                    type = 3;
                    e = await loading(AJAX.post(this.ajaxConf.url5,this.ajaxConf.data1));
                    this.lastImei = row.imsi;
                    this.tableData.byTime = this.placeDataFormat(e.result);
                }else if(column.label == "地点数"){
                    type = 2;
                    e = await loading(AJAX.post(this.ajaxConf.url4,this.ajaxConf.data1));
                    this.tableData.byPlace = e.result;
                }else if(column.label == "区域数"){
                    type = 1;
                    e = await loading(AJAX.post(this.ajaxConf.url3,this.ajaxConf.data1));
                    this.tableData.byArea = e.result;
                }else if(column.label == "MAC"){
                    type = 0;
                    e = await loading(AJAX.post(this.ajaxConf.url2,this.ajaxConf.data1));
                    this.tableData.default = e.result;
                }else{
                    return false;
                }
                this.tableActiveClass = 'active';
                this.extraTableList = ["hidden","hidden","hidden","hidden"];
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
                var i,imsis = [];
                if(!this.selected.length){
                    for(i = 0; i < this.tableData.list.length;i++){
                        imsis.push(this.tableData.list[i].target);
                    }
                }else {
                    for(i = 0; i < this.selected.length;i++){
                        imsis.push(this.selected[i].target);
                    }
                }
                this.$parent.addNewTab({
                    url: "map/analyze/imsi/join/mac",
                    text: "IMSI/IMEI关联MAC地图",
                    name: 'AnalyzeToolIMSIJoinMACMap',
                    query: {
                        key: this.ajaxConf.data.sessionKey,
                        macs: imsis.join(','),
                        imsi: this.ajaxConf.data.imsi,
                        imei: this.ajaxConf.data.imei,
                        areas: this.ajaxConf.data.list,
                        time: this.ajaxConf.data.time
                    }
                });
            }
        },
        watch: {
            imei: function(){
                this.imei = this.trimAll(this.imei);
                if(this.imei.length == 15){
                    this.permit = '';
                }else {
                    this.permit = 'permit';
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
