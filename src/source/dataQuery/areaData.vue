<template>

    <div class="search-wrapper" ref='wrapper'>

        <!-- 滚动条区域 -->
        <div class="search-scroll">

            <!-- 数据查询条件 -->
            <div class="area-query-list">
                <div class="area-query-item">
                    <el-radio v-model="type" label="1">IMSI/IMEI</el-radio>
                    <el-radio v-model="type" label="2">MAC</el-radio>
                    <el-radio v-model="type" label="3">人像</el-radio>
                    <el-radio v-model="type" label="4">车牌</el-radio>
                </div>
                <div class="area-query-item">
                    <label>选择地点：</label>
                    <input type="text" readonly="readonly" @click="showTree" v-model="place" >
                    <label>时间范围：</label>
                    <el-date-picker
                        v-model="query.createTime"
                        type="datetimerange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                    <span class="btn active" type="primary" v-on:click="queryInit">查询</span>
                    <span class="btn" v-on:click="reset" >重置</span>
                </div>
            </div>

            <!-- 数据显示区域 -->
            <div class="search-content">

                <el-table
                    v-show="url1 == 'area/data/mac'"
                    :data="list"
                    highlight-current-row
                    @sort-change="sortControl">
                    <el-table-column label="序号" width="60">
                        <template slot-scope="scope">
                            {{scope.$index + 1 + (searchCache.pageNumber-1) * searchCache.pageSize}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="MAC" label="MAC"></el-table-column>
                    <el-table-column prop="ADDRESS" label="采集地点"></el-table-column>
                    <el-table-column prop="AP" label="采集设备AP"></el-table-column>
                    <el-table-column prop="CAPTURETIME" label="采集时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
                </el-table>

                <el-table
                    v-show="url1 == 'area/data/imsi'"
                    :data="list"
                    highlight-current-row
                    @sort-change="sortControl">
                    <el-table-column label="序号" width="60">
                        <template slot-scope="scope">
                            {{scope.$index + 1 + (searchCache.pageNumber-1) * searchCache.pageSize}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="IMSI" label="IMSI"></el-table-column>
                    <el-table-column prop="IMEI" label="IMEI"></el-table-column>
                    <el-table-column prop="PHONE" label="手机号码"></el-table-column>
                    <el-table-column prop="ADDRESS" label="采集地点"></el-table-column>
                    <el-table-column prop="CAPTURETIME" label="采集时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
                    <el-table-column prop="IMSIADDR" label="归属地"></el-table-column>
                    <el-table-column prop="YYS" label="运营商"></el-table-column>
                </el-table>

                <el-table
                    v-show="url1 == 'area/data/plate'"
                    :data="list"
                    highlight-current-row
                    @sort-change="sortControl">
                    <el-table-column label="序号" width="60">
                        <template slot-scope="scope">
                            {{scope.$index + 1 + (searchCache.pageNumber-1) * searchCache.pageSize}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="PLATE" label="车牌"></el-table-column>
                    <el-table-column prop="COLOR" label="颜色"></el-table-column>
                    <el-table-column prop="ADDRESS" label="采集地点"></el-table-column>
                    <el-table-column prop="CAPTURETIME" label="采集时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
                </el-table>

                <el-table
                    v-show="url1 == 'faceCaptureRecord/getFaceCaptureRecord'"
                    :data="list"
                    highlight-current-row>
                    <el-table-column label="序号" width="60">
                        <template slot-scope="scope">
                            {{scope.$index + 1 + (searchCache.pageNumber-1) * searchCache.pageSize}}
                        </template>
                    </el-table-column>
                    <el-table-column label="人像">
                        <template slot-scope="scope">
                            <img :src="scope.row.FULLFACEURL" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="ADDRESS" label="采集地点"></el-table-column>
                    <el-table-column prop="CAPTURETIME" label="采集时间" :formatter="hqDateFormat1"></el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 分页与操作按钮显示区域 -->
        <div class="search-coperation bottom-coperation">
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
    import { MessageBox } from 'element-ui'
    import tree from "../components/common/tree.vue"
    import { checkDatePicker } from '../../config/global.js'
    import pageSplit from '../components/common/pageSplit.vue'

    export default {
        name: 'areaData',
        components: {
            'tree-case': tree,
            'page-split': pageSplit,
        },
        data () {
            return {
                treeActiveClass: 'hidden',
                type: '1',
                total: 0,
                query: {
                    place: [],
                    createTime: ['',''],
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '半个月',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '一个月',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '三个月',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                          picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '半年',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                          picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                url: 'area/data/imsi',
                url1: 'area/data/imsi',
                searchCache: {},
                list: [],
                place: ''
            }
        },
        methods: {
            /*
                区域查询阈值2000   所选设备数量（个） *  所选时间范围（小时）< 2000
             */

            reset: function(){
                let deviceNumber = sessionStorage.getItem("DEVICEID_LIST").split('id').length - 2,
                    dayNumber = Math.floor(2000/deviceNumber) || 1,
                    now = new Date(),
                    begin = Date.parse(now) - dayNumber * 60 * 60 * 1000;

                this.query.createTime = [new Date(begin), now];
                this.query.place = [];
                this.place = '';
            },
            queryInit: function(){
                let deviceNumber = sessionStorage.getItem("DEVICEID_LIST").split('id').length - 2,
                    selNumber = this.query.place.length || deviceNumber;

                if(!this.stime || !this.etime){
                    this.$message({
                        type: "warning",
                        message: "请选择时间范围！"
                    })
                    return false;
                }else if( 2000/selNumber*60*60 < (this.etime - this.stime)){
                    MessageBox.alert("查询的数据量太大，请缩小时间范围或者筛选所选设备！",'提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            return ;
                        }
                    })
                    return false;
                }

                if(this.type == 1){
                    this.url = 'area/data/imsi';
                }else if(this.type == 2){
                    this.url = 'area/data/mac';
                }else if(this.type == 3){
                    this.url = 'faceCaptureRecord/getFaceCaptureRecord';
                }else if(this.type == 4){
                    this.url = 'area/data/plate';
                }

                this.searchCache = {
                    deviceIds: this.query.place.join(','),
                    startTime: this.stime,
                    endTime: this.etime,
                    timeSort: 'desc',
                    pageNumber: 1,
                    pageSize: 50
                }

                this.dataInit();
            },
            dataInit: async function(page_now, page_size, refresh){
                this.searchCache.pageNumber = page_now || 1;
                this.searchCache.pageSize = page_size || this.searchCache.pageSize;
                let res = await loading(AJAX.post(this.url,this.searchCache));
                if(!refresh){
                    this.total = res.page.total;
                }
                if(res.result.length == 0){
                    this.$message("您未查到任何数据！");
                    this.total = 0;
                    this.list = res.result;
                }else{
                    this.list = res.result;
                }
                this.url1 = this.url;
            },

            sortControl: function(e){
                if(e.prop == 'CAPTURETIME'){
                    this.searchCache.timeSort = this.searchCache.timeSort == 'desc'?"asc":"desc";
                    this.dataInit();
                }
            },

            // 获取树形菜单被选取的数据
            getNodes(e) {
                this.place = e.nodes;
                this.query.place = e.keys;
                this.treeClose();
            },
            showTree: function(e){
                this.selectTreeIndex = e;
                this.treeActiveClass = '';
            },
            treeClose: function(){
                this.treeActiveClass = 'hidden';
            },
            // 分页控制
            handleSizeChange(val) {
                this.dataInit(1,val,1);
            },
            handleCurrentChange(val) {
                this.dataInit(val,0,1);
            },
        },
        computed: {
            stime: function(){
                if(!!this.query.createTime && !!this.query.createTime[0]){
                    return Date.parse(this.query.createTime[0])/1000;
                }else{
                    return ''
                }
            },
            etime: function(){
                if(!!this.query.createTime && !!this.query.createTime[1]){
                    return Date.parse(this.query.createTime[1])/1000;
                }else{
                    return ''
                }
            }
        },
        mounted: function(){
            this.reset();
        }
    }
</script>

<style lang="scss">
    .area-query-list{
        .area-query-item{
            margin: 15px 0;
            display: flex;
            align-items: center;
            &>input{
                height: 30px;
                line-height: 30px;
                width: 220px;
                padding: 0 10px;
                border: 1px solid #d2d2d2;
                border-radius: 3px;
                margin-right: 10px;
            }
            .el-date-editor{
                height: 32px;
                i,span{
                    position: relative;
                    top: -3px;
                }

            }
        }
    }

    .search-content{
        table{
            tbody{
                tr{
                    td{
                        img{
                            width: 60px;
                            height: 60px;
                            margin: 5px 0 0 0;
                        }
                    }
                }
            }
        }
    }
</style>
