<template>
	<div class="search-wrapper" ref='wrapper'>

		<!-- 滚动条区域 -->
        <div class="search-scroll">
			<div class="search-table search-query">
				<el-table :data="jsondata" height="125" style="width: 100%;" highlight-current-row>
				    <el-table-column prop="MAC" label="MAC" ></el-table-column>
				   	<el-table-column prop="CAPTURETIME" :label="'时间('+jsondata.length+')'" :formatter="hqDateFormat1"></el-table-column>
				   	<el-table-column prop="ADDRESS" :label="'地点('+addressTotal+')'" ></el-table-column>
			  	</el-table>
			</div>

			<div class="search-content">

				<div class="search-table">

					<el-table 
						:data="tableData.list" 
						class="default-table" 
						@cell-click="showTable" 
						highlight-current-row
						@sort-change="sortControl"
						@selection-change="selectChange" >
					    <el-table-column type="selection" label="全选"></el-table-column>
					   	<el-table-column label="MAC">
						 	<template slot-scope="scope">
							 	<el-tag size="medium">{{ scope.row.mac }}</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column label="区域数">
							<template slot-scope="scope">
							 	<el-tag size="areaCount">{{ scope.row.areaCount }}</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column label="地点数" sortable="custom" prop="deviceCount">
							<template slot-scope="scope">
							 	<el-tag size="deviceCount">{{ scope.row.deviceCount }}</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column prop="count" label="匹配次数" sortable="custom"></el-table-column>
					   	<el-table-column prop="devicePercent" label="地点匹配度" >
							<template slot-scope="scope">
								{{ scope.row.devicePercent }}%
							</template>
					   	</el-table-column>
					   	<el-table-column label="时间匹配度" >
							<template slot-scope="scope">
							 	<el-tag size="timePercent">{{ scope.row.timePercent }}%</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column prop="begin" label="最早时间" :formatter="hqDateFormat1"></el-table-column>
					   	<el-table-column prop="last" label="最晚时间" :formatter="hqDateFormat1"></el-table-column>
				  	</el-table>

				    <div class="extra-table" :class="tableActiveClass">

				    	<!-- imsi、imei -->
				    	<el-table 
				    		:data="tableData.default"
				    		highlight-current-row
				    		class="default-table" 
				    		:class="extraTableList[0]">
						   	<el-table-column type="index" :index="defaultIndex" label="序号"></el-table-column>
						   	<el-table-column prop="capturetime" label="采集时间" :formatter="hqDateFormat1" sortable></el-table-column>
						   	<el-table-column prop="address" label="采集地点" sortable></el-table-column>
					  	</el-table>

						<!-- 按区域数继续查询 -->
						<el-table 
				    		:data="tableData.byArea"
				    		highlight-current-row
				    		class="default-table" 
				    		:class="extraTableList[1]">
						   	<el-table-column type="index" :index="defaultIndex" label="序号"></el-table-column>
						   	<el-table-column prop="area" label="区域名称"></el-table-column>
						   	<el-table-column prop="count" label="匹配次数" sortable></el-table-column>
					  	</el-table>

				    	<!-- 按地点数查询 -->
				    	<el-table 
				    		:data="tableData.byPlace"
				    		highlight-current-row
				    		class="default-table" 
				    		:class="extraTableList[2]">
						   	<el-table-column type="index" :index="defaultIndex" label="序号"></el-table-column>
						   	<el-table-column prop="address" label="采集地点"></el-table-column>
						   	<el-table-column prop="count" label="匹配次数" sortable></el-table-column>
						   	<el-table-column prop="begin" label="最早时间" :formatter="hqDateFormat1" sortable></el-table-column>
						   	<el-table-column prop="last" label="最晚时间" :formatter="hqDateFormat1" sortable></el-table-column>
					  	</el-table>

						<!-- 按时间匹配度查询 -->
						<el-table 
				    		:data="tableData.byTime"
				    		highlight-current-row
				    		class="default-table" 
				    		:class="extraTableList[3]"
				    		:span-method="objectSpanMethod">
						   	<el-table-column prop="index" label="序号"></el-table-column>
						   	<el-table-column prop="area" label="采集地点"></el-table-column>
						   	<el-table-column prop="target" :label="'采集时间\n(MAC:'+tableAjax.mac+')'" :formatter="hqDateFormat1"></el-table-column>
						   	<el-table-column prop="result" :label="'采集时间\n(MAC:'+lastImei+')'" :formatter="hqDateFormat1"></el-table-column>
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
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import pageSplit from '../components/common/pageSplit.vue'

 	export default {
 		name: 'searchMacTogether',
 		props: {
 			time: {
 				required: true
 			},
 			json: {
 				type: String,
 				required: true
 			}
 		},
	    data() {
	      	return {
				jsondata: [],
	      		page_size: 50,
                searchKey: '',
                lastImei: '',
                selected: [],
                sort1: 2,
                addressTotal: '',

		        //	列表参数
		        tableActiveClass: '',
		        extraTableList: ['hidden','hidden','hidden','hidden'],
		        tableAjax: {
	        		jsondata: [],
	        		imsi: "",
        			interaval: [],
        			currentPage: 1,
        			pageSize: 50,
        			type: 1
		        },
		        ajaxConf: {
                    url: "",
                    url1: "/mac/together/list",
                    url2: "/mac/together/info",
                    url3: "/mac/together/area",
                    url4: "/mac/together/device",
                    url5: "/mac/together/mapping",
                    data: {
                        list: [],
                        pageNumber: 1,
                        pageSize: 50
                    }
                },

		        //	查询开关
		        extraSwitchText: "展开",
		        extraSwitchIcon: "el-icon-arrow-down",
		        extraSwitchClass: '',

	        	tableData: {
	        		list: [],
	        		default: [],
	        		byArea: [],
	        		byPlace: [],
	        		byTime: []
	        	},
	        	sort: ['desc','desc','desc','desc','desc','desc','desc'],
	        	total: 0
      		}
	    },

	    components: {
	    	'page-split': pageSplit
	    },
	    methods: {
	 		pageInit: function(){
	 			//	参数初始化打包
				let time = this.time,
					jsondata = JSON.parse(this.json),
					i = 0;
				this.tableAjax.jsondata = [];
				for(i = 0;i<jsondata.length;i++){
					this.tableAjax.interaval = time;
					this.tableAjax.jsondata.push({
						capturetime: jsondata[i].CAPTURETIME,
						deviceid: [jsondata[i].DEVICEID]
					});
				}
 				this.tableAjax.mac = jsondata[0].MAC;
 				this.jsondata = jsondata;
	 			this.dataInit();
	 		},
	 		dataInit: async function(page_now,page_size,refresh){
	 			var _this = this,
	 			e = await loading(AJAX.post(this.trimAll(`
	 				${_this.ajaxConf.url1}/
	 				${_this.tableAjax.mac}/
	 				${_this.tableAjax.interaval}/
	 				${page_now || 1}/
	 				${page_size || _this.tableAjax.pageSize}/
	 				${_this.sort1}`),{alist: JSON.stringify(_this.tableAjax.jsondata)}));
				if(e.result.length == 0){
                    _this.$message("您未查到任何数据！");
                    _this.tableData.list = e.result;
                }else{
                	_this.searchKey = e.macKey;
                	_this.tableData.list = e.result;
                	if(!refresh){
                        this.total = e.page.totalCount;
                    }
                }
	 		},
	    	//  列表操作
            showTable: async function(row, column, cell, event){
                var url,_this = this,e;
                this.extraTableList = ["hidden","hidden","hidden","hidden"];

	   			if(column.label == "时间匹配度"){
	   				this.tableActiveClass = 'active';
	   				e = await loading(AJAX.post(_this.ajaxConf.url5+'/'+row.mac+'/'+_this.tableAjax.interaval,{key: _this.searchKey}));
	   				this.lastImei = row.mac;
                    this.tableData.byTime = this.jsonDataFormat(e.result);
                    this.$set(_this.extraTableList,3,'');
	   			}else if(column.label == "地点数"){
	   				this.tableActiveClass = 'active';
	   				e = await loading(AJAX.post(_this.ajaxConf.url4,{rids: row.rids}))
	   				this.tableData.byPlace = e.result;
	   				this.$set(_this.extraTableList,2,'');
	   			}else if(column.label == "区域数"){
	   				this.tableActiveClass = 'active';
	   				e = await loading(AJAX.post(_this.ajaxConf.url3,{rids: row.rids}))
	   				this.tableData.byArea = e.result;
	   				this.$set(_this.extraTableList,1,'');
	   			}else if(column.label == "MAC"){
	   				this.tableActiveClass = 'active';
	   				e = await loading(AJAX.post(_this.ajaxConf.url2,{rids: row.rids}))
	   				this.tableData.default = e.result;
	   				this.$set(_this.extraTableList,0,'');
	   			}else{
	   				return false;
	   			}
            },
	    	tableClose: function(){
	    		this.tableActiveClass = '';
	    	},

	    	// 分页控制
    	 	handleSizeChange(val) {
                this.dataInit(1,val,1);
	      	},
	      	handleCurrentChange(val) {
				this.dataInit(val,0,1);
	      	},
	      	//	排序控制
	      	sortControl: function(e){
	      		if(e.prop == 'deviceCount'){
	      			this.sort1 = this.sort1 == 1?2:1;
	      			this.dataInit();
	      		}else if(e.prop == 'count'){
	      			this.sort1 = this.sort1 == 4?3:4;
	      			this.dataInit();
	      		}
	      	},

	      	selectChange: function(e){
            	this.selected = e;
	      	},

	      	timeThrow() {

                var i,select = [];
                if(!this.selected.length){
                   	for(i = 0; i < this.tableAjax.pageSize;i++){
                        select.push(this.tableData.list[i].mac);
                    }
                }else {
                    for(i = 0; i < this.selected.length;i++){
                        select.push(this.selected[i].mac);
                    }
                }
                this.$parent.addNewTab({
                    url: "map/mac/together",
                    text: "MAC同行地图",
                    name: "MACTogetherMap",
                    query: {
                        key: this.searchKey,
                        macs: select.join(",")
                    }
                });
            }
	    },
	    computed: {
	    	unionKey: function(){
	    		return this.time + this.json;
	    	}
	    },
	    watch: {
	    	jsondata: function(){
	    		var arr = new Set();
	    		this.jsondata.map(e => {
	    			arr.add(e.ADDRESS);
	    		})
	    		this.addressTotal = arr.size;
	    	},
	    	unionKey: function(){
	    		this.pageInit();
	    	},
	    },
	    created: function(){
	    	this.pageInit();
	    }
  	}
</script>
<style lang="scss" scoped>
	//	表格模块样式
	.search-table{
		&.search-query{
		    height: auto;
		    margin-bottom: 20px;
		    min-height: 50px;
		    padding-bottom: 20px;
			table thead th{
				background: #efefef;
			}
		}
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
