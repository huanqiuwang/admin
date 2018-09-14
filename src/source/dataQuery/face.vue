<template>

    <div class="search-wrapper" ref='wrapper'>

        <!-- 滚动条区域 -->
        <div class="search-scroll">

            <!-- 数据查询条件 -->
            <div class="search-query">
                <div class="basic-query">
                	<img-draggle
                        :imgUrl="base64URL"
                        @updateImgHandle="updateImgUrl"></img-draggle>
                	<div class="upload-file" v-on:click="upload">
    					<input id="fileUpload" v-on:change="change" type="file" name="file" accept="image/*" multiple/>
    				</div>
                    <el-button type="primary" v-on:click="queryInit">查询</el-button>
                    <el-button v-on:click="reset" >重置</el-button>
                    <span :class="extraSwitchClass + ' search-expand'" v-on:click="switchQuery"><i class="el-icon-arrow-down"></i></span>
                </div>

    			<div class="extra-list" :class="extraSwitchClass">
    				<div class="extra-item">
    					<span>相似度：</span>
    					<input v-model="like" type="text" placeholder="请输入0-1之间的值" />
    				</div>
    				<extra-list
    	                activeClass="active"
    	                :listData="extraQuery"
    	                @chooseEvents="showTree">
    	            </extra-list>
    			</div>
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
                    :data="tableData"
                    class="default-table time-mode-table"
                    :class="tableMode[0]"
                    highlight-current-row
                    @sort-change="sortControl"
                    @cell-click="showTable"
                    @selection-change="selectChange">
                    <el-table-column type="selection" label="全选"></el-table-column>
                    <el-table-column label="序号" :width="Wx">
                        <template slot-scope="scope">
                            {{scope.row.index+1+(ajaxConf.data.pageNumber-1)*ajaxConf.data.pageSize}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="captureImgFullUrl" label="人像">
                        <template slot-scope="scope">
                            <img :src="scope.row.captureImgFullUrl" />
                        </template>
                    </el-table-column>
                    <el-table-column label="相似度" :width="Wxx">

                        <template slot-scope="scope">
                            <span><b>{{autoPercentage(scope.row.score)}}</b></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="采集地点"></el-table-column>
                    <el-table-column prop="time" label="采集时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
                </el-table>

                <!-- 地点模式 -->
                <el-table 
                    :data="tableData1" 
                    class="default-table place-mode-table" 
                    :class="tableMode[1]"
                    highlight-current-row
                    @cell-click="showTable"
                    @sort-change="sortControl"
                    @selection-change="selectChange">
                    <el-table-column type="selection" label="全选"></el-table-column>
                    <el-table-column label="序号" :width="Wx">
                        <template slot-scope="scope">
                            {{scope.row.index+1+(ajaxConf.data1.pageNumber-1)*ajaxConf.data1.pageSize}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="采集地点"></el-table-column>
                    <el-table-column prop="captureImgFullUrl1" label="人像">
                        <template slot-scope="scope">
                            <img :src="scope.row.faceAnalysisResult[0].captureImgFullUrl" />
                            <small>{{scope.row.faceAnalysisResult.length}}</small>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dateCount" :width="Wx" label="天数" sortable="custom"></el-table-column>
                    <el-table-column prop="faceCount" :width="Wx" label="次数" sortable="custom"></el-table-column>
                    <el-table-column prop="startTime" label="最早时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
                    <el-table-column prop="endTime" label="最晚时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
                </el-table>
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


            <!-- 地点模式分页 -->
            <page-split
                :class="tableMode[1]"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
                :pageTotal="total1"></page-split>
        </div>
                
        <!-- 图片预览 -->
        <img-preview
            @hiddenPrev="prevImgHidden"
            :showClass="prevClass"
            :imgList="imgPrevList"
            :indexNow="indexNow"></img-preview>

        <img-bigger
            :showClass="bigger"
            @hiddenBigger="biggerImghidden"
            :imgList="imageBiggerList"
            :indexNow="imageBiggerIndex"></img-bigger>

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
    import { MAX_UPLOAD_IMG,TIPS } from '../../config/global.js'

    import tab from "../components/common/tab.vue"
    import tree from "../components/common/tree.vue"
    import { checkDatePicker } from '../../config/global.js'
    import extraList from "../components/common/datelist.vue"
    import imgDraglle from "../components/Image/Face/draggleUpload.vue"
    import imgPreview from "../components/Image/Face/imagePreview.vue"
    import imgBigger from "../components/Image/Face/imageBigger.vue"
    import pageSplit from '../components/common/pageSplit.vue'

    export default {
        name: 'searchFace',
        components: {
            'tab-case': tab,
            'tree-case': tree,
            'extra-list': extraList,
            'img-draggle': imgDraglle,
            'img-preview': imgPreview,
            'img-bigger': imgBigger,
            'page-split': pageSplit
        },
        data() {
            return {
                indexNow: 1,
                avoidRpeat: false,
                base64URL: '',
                extraQuery: [],
                like: 0.9,

                bigger: 'hidden',
                prevClass: 'hidden',
                imageBiggerList: [],
                imageBiggerIndex: 1,
                imgPrevList:[],

                //  查询开关
                extraSwitchClass: 'active',

                //  树参数
                treeActiveClass: 'hidden',
                selectTreeIndex: 0,

                //  列表参数
                tableMode: ["active","hidden"],
                extraTableList: ['hidden'],
                tableData: [],
                tableData1: [],
                smallTable: [],
                selectList: [],
                selectList1: [],

                //  操作按钮-同行关联
                coporationBtn: ["轨迹地图可视化","人像关联IMSI/IMEI","人像关联MAC"],
                total: 0,
                total1: 0,

                ajaxConf: {
                    url: "",
                    url1: "/face/getFaceSelect",
                    url2: "/face/getFaceByAddress",
                    url3: "/face/getCaptureFaceUrl",
                    flagdateCount: '',
                    flagfaceCount: '',
                    flagstartTime: '',
                    flagendTime: '',
                    data: {
                        flag: 'desc',
                        threshold: 0.9,
                        timeDevice: [],
                        searchImageData: '',
                        mapKey: '',
                        pageNumber: 1,
                        pageSize: 50
                    },
                    data1: {
                        flag: 'desc',
                        threshold: 0.9,
                        timeDevice: [],
                        searchImageData: '',
                        mapKey: '',
                        param: '1',
                        pageNumber: 1,
                        pageSize: 50
                    }
                }
            }
        },
        methods: {
            reset: function(){
                this.base64URL = '';
                this.like = 0.9;
                this.extraQuery = [];
            },

            upload: function(){
				document.getElementById("fileUpload").click();
			},
			change: async function(e){
                var _this = this,
				    f = document.getElementById("fileUpload").files[0],
				    fr = new FileReader();             //实例FileReader对象
                if(f.size > MAX_UPLOAD_IMG){
                    this.$message(TIPS.imgUpload);
                    return Promise.reject(TIPS.imgUpload);
                }
			 	fr.readAsDataURL(f);                   //把上传的文件对象转换成url
			 	fr.onload = function(e){
			 		_this.base64URL = this.result;
			 	}

			},
            updateImgUrl: function(e){
                this.base64URL = e;
            },

            //  查询条件初始化,获取地点与时间的值，默认当用户不选择地点的时候是所有地点，时间为前一周
            queryInit: async function(){
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
                            startTime: this.hqDateFormat(datetime),
                            endTime: this.hqDateFormat(datetime1),
                            deviceId: this.extraQuery[i].deviceId || []
                        })
                    }else{
                        _this.$message("需要输入时间范围！在查询条件的第"+(i+1)+"行···");
                        return false;
                    }
                }

                if(!this.trimAll(this.base64URL)){
                    this.$message("请上传图片！");
                    return false;
                }else if(!this.checkSameDatas(list)){
                    this.$message("相同地点存在重复的时间段！");
                    return false;
                }else if(!this.trimAll(this.time)){
                    this.$message("时间跨度不能为空！");
                    return false;
                }
                let pass =  await checkDatePicker(this.extraQuery);

                this.ajaxConf.data.threshold = this.like;
                this.ajaxConf.data1.threshold = this.like;
                this.ajaxConf.data.searchImageData = this.base64URL.split("base64,")[1];
                this.ajaxConf.data1.searchImageData = this.base64URL.split("base64,")[1];
                this.ajaxConf.data.timeDevice = list;
                this.ajaxConf.data1.timeDevice = list;
                this.ajaxConf.data.mapKey = '';
                this.ajaxConf.data1.mapKey = '';
                this.dataInitFirst();
            },
            dataInit: async function(page_now,page_size,refresh){
                var _this = this,res;
                this.ajaxConf.data.pageNumber = page_now || 1;
                this.ajaxConf.data.pageSize = page_size || this.ajaxConf.data.pageSize;
                this.ajaxConf.data1.pageNumber = page_now || 1;
                this.ajaxConf.data1.pageSize = page_size || this.ajaxConf.data1.pageSize;

                this.ajaxConf.url = this.tableMode[0] == 'active'?this.ajaxConf.url1:this.ajaxConf.url2;

                if(this.tableMode[0] == 'active'){
                    res = await loading(AJAX.post(_this.ajaxConf.url,{str: JSON.stringify(_this.ajaxConf.data)}));
                }else{
                    res = await loading(AJAX.post(_this.ajaxConf.url,{str: JSON.stringify(_this.ajaxConf.data1)}));
                }

                if(!refresh && _this.tableMode[0] == 'active'){
                    this.total = res.pageCount;
                }else if(!refresh && this.tableMode[1] == 'active'){
                    this.total1 = res.pageCount;
                }

                if(res.result.length == 0){
                    this.$message(res.message);
                    this.tableData = res.result;
                }else if(_this.tableMode[0] == 'active'){
                    this.ajaxConf.data.mapKey = res.mapKey;
                    this.tableData = res.result;
                    this.tableData.length = res.result.length;
                }else if(this.tableMode[1] == 'active'){
                    this.ajaxConf.data1.mapKey = res.mapKey;
                    this.tableData1 = res.result;
                }
            },

            dataInitFirst: async function(page_now,page_size,refresh){
                var _this = this,res,res1;

                this.ajaxConf.data.pageNumber = 1;
                this.ajaxConf.data1.pageNumber = 1;
                res = await loading(AJAX.post(_this.ajaxConf.url1,{str: JSON.stringify(_this.ajaxConf.data)}));
                this.total = res.pageCount;

                if(res.result.length == 0){
                    this.$message(res.message);
                    this.tableData = [];
                    this.tableData1 = [];
                }else{
                    this.ajaxConf.data.mapKey = res.mapKey;
                    this.tableData = res.result;
                    res1 = await loading(AJAX.post(_this.ajaxConf.url2,{str: JSON.stringify(_this.ajaxConf.data1)}));
                    this.total1 = res1.pageCount;
                    this.ajaxConf.data1.mapKey = res1.mapKey;
                    this.tableData1 = res1.result;
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
                if(e.prop == 'time'){
                    this.ajaxConf.data.flag = this.ajaxConf.data.flag == 'desc'?"asc":"desc";
                    this.dataInit();
                }else if(e.prop == 'dateCount'){
                    this.ajaxConf.data1.flag = this.ajaxConf.flagdateCount == 'desc'?"asc":"desc";
                    this.ajaxConf.flagdateCount = this.ajaxConf.data1.flag;
                    this.ajaxConf.data1.param = 1;
                    this.dataInit();
                }else if(e.prop == 'faceCount'){
                    this.ajaxConf.data1.flag = this.ajaxConf.flagfaceCount == 'desc'?"asc":"desc";
                    this.ajaxConf.flagfaceCount = this.ajaxConf.data1.flag;
                    this.ajaxConf.data1.param = 2;
                    this.dataInit();
                }else if(e.prop == 'startTime'){
                    this.ajaxConf.data1.flag = this.ajaxConf.flagstartTime == 'desc'?"asc":"desc";
                    this.ajaxConf.flagstartTime = this.ajaxConf.data1.flag;
                    this.ajaxConf.data1.param = 3;
                    this.dataInit();
                }else if(e.prop == 'endTime'){
                    this.ajaxConf.data1.flag = this.ajaxConf.flagendTime == 'desc'?"asc":"desc";
                    this.ajaxConf.flagendTime = this.ajaxConf.data1.flag;
                    this.ajaxConf.data1.param = 4;
                    this.dataInit();
                }
            },

            //  查询条件展开收起
            switchQuery: function(){
                this.extraSwitchClass = this.extraSwitchClass == 'active'?'':'active';
            },

            //  列表操作
            showTable: async function(row, column, cell, event){
                var res;
                if(column.property == "captureImgFullUrl"){
                    this.bigger = 'active';
                    this.imageBiggerList = this.tableData;
                    this.imageBiggerIndex = row.index+1;
                }else if(column.property == "captureImgFullUrl1"){
                    this.prevClass = 'active';
                    this.indexNow = row.index+1;
                    this.imgPrevList = this.tableData1;
                }
            },
            biggerImghidden: function(){
                this.bigger = 'hidden';
            },
            prevImgHidden: function(){
                this.prevClass = 'hidden';
            },

            //  时间模式地点模式切换
            changeTimeMode: function(){
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
                var _this = this,i,mark = 0,jsondata = [],start = 0,select = [];

                // 判断该次点击是否有效
                if(!!this.avoidRpeat){
                    return false;
                }else if(this.tableMode[0] == "active"){
                    for(i = 0; i < this.selectList.length;i++){
                        jsondata.push({
                            CAPTURETIME: Math.ceil(parseInt(this.selectList[i].time)/1000),
                            DEVICEID: this.selectList[i].cameraId,
                            MAC: this.selectList[i].captureImgFullUrl,
                            ADDRESS: this.selectList[i].address,
                            TIMEZON: ''
                        });
                        select.push(_this.tableData[i].captureId);
                        mark = 1;
                    }
                }else if(this.tableMode[1] == "active"){
                    for(i = 0; i < this.selectList1.length;i++){
                        for(let n = 0;n<this.tableData1[i].faceAnalysisResult.length;n++){
                            jsondata.push({
                                CAPTURETIME: Math.ceil(parseInt(this.tableData1[i].faceAnalysisResult[n].time)/1000),
                                DEVICEID: this.tableData1[i].cameraId,
                                MAC: this.tableData1[i].faceAnalysisResult[n].captureImgFullUrl,
                                ADDRESS: this.tableData1[i].address,
                                TIMEZON: ''
                            });
                        }
                        select.push(this.tableData1[i].cameraId);
                        mark = 1;
                    }
                }

                if(mark == 0){
                    this.$message("您还未选取需要操作的数据！");
                    return false;
                }

                //  处理页面逻辑
                if(e == 0){
                    if(this.tableMode[0] == "active"){
                        this.$parent.addNewTab({
                            url: "map/search/face/trail",
                            text: "人像轨迹地图",
                            name: "DataSearchFaceTrailMap",
                            query: {
                                key: this.ajaxConf.data.mapKey,
                                faces: JSON.stringify(select)
                            }
                        });
                    }else{
                        this.$parent.addNewTab({
                            url: "map/search/face/trail/place",
                            text: "人像轨迹地图",
                            name: "DataSearchFaceTrailPlaceMap",
                            query: {
                                key: this.ajaxConf.data1.mapKey,
                                devices: JSON.stringify(select)
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
                            url: "search/face/join/imei",
                            text: "人像关联IMSI/IMEI",
                            name: "sFjoinI",
                            query: {
                                time: value,
                                json: JSON.stringify(jsondata)
                            }
                        });
                    }else if(e == 2){
                        this.$parent.addNewTab({
                            url: "search/face/join/mac",
                            text: "人像关联MAC",
                            name: "sFjoinM",
                            query: {
                                time: value,
                                json: JSON.stringify(jsondata)
                            }
                        });
                    }
                }
                setTimeout(function(){
                    _this.avoidRpeat = false;
                },2000);
            }
        },
        watch: {
            mac: function(){
                this.mac = this.trimAll(this.mac);
            },
            //  地点模式下面每次刷新数据自动添加索引，方便图片组件的上一页下一页
            tableData1: function(){
                this.tableData1.map((e,index) =>{
                    e.index = index;
                });
            },
            tableData: function(){
                this.tableData.map((e,index) =>{
                    e.index = index;
                });
            }
        },
        mounted: function(){
            var isUsed = sessionStorage.getItem("humanImgBase64Used"),_this = this;
            if(!!isUsed && isUsed === 'false'){
                this.base64URL = sessionStorage.getItem("humanImgBase64");
                sessionStorage.setItem("humanImgBase64Used",true);
                setTimeout(function(){
                    _this.queryInit();
                },300);
            }
        },
        activated: function(){
            var isUsed = sessionStorage.getItem("humanImgBase64Used"),_this = this;
            if(!!isUsed && isUsed === 'false'){
                this.base64URL = sessionStorage.getItem("humanImgBase64");
                sessionStorage.setItem("humanImgBase64Used",true);
                setTimeout(function(){
                    _this.queryInit();
                },300);
            }
        }
    }
</script>

<style lang="scss" scoped>
    $active-color: #1890ff;

    .extra-list{
        display: none;
        background: #f3f3f3;
        &.active{
            display: block;
        }
        .extra-item{
            padding: 10px 0 0 0;
            span{
                display: inline-block;
                width: 90px;
                text-align: right;
            }
            input{
                width: 260px;
                height: 32px;
                border-radius: 3px;
                border: 1px solid #d2d2d2;
                padding-left: 10px;
            }
        }
    }

    .basic-query{
        overflow: hidden;
        .upload-file{
            float: left;
            user-select: none;
            width: 130px;
            height: 32px;
            border: 1px solid #d2d2d2;
            cursor: pointer;
            background: url("../../assets/images/upload.png") no-repeat left;
            background-position: 12px;
            position: relative;
            margin: 34px 10px 0px;
            &:before{
                content: "本地上传图片";
                position: absolute;
                top: 6px;
                left: 40px;
                color:#333333;
            }
            input{
                display: none;
            }
        }
        &>button{
            float: left;
            position: relative;
            top: 35px;
        }
        &>span{
            float: left;
            position: relative;
            top: 36px;
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
                    bottom: 46px;
                    left: -20px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #fd6868;
                    color: white;
                    display: inline-block;
                    font-size: 20px;
                    line-height: 40px;
                    transform: scale(.5,.5);
                    text-align: center;
                }
            }
        }
    }

</style>
