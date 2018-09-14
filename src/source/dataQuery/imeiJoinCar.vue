<template>

	<div class="search-wrapper" ref='wrapper'>

		<!-- 滚动条区域 -->
        <div class="search-scroll">
			<div class="search-table search-query">
				<el-table :data="jsondata" height="125" style="width: 100%;" highlight-current-row>
				    <el-table-column prop="IMSI" label="IMSI" ></el-table-column>
				   	<el-table-column prop="IMEI" label="IMEI" ></el-table-column>
				   	<el-table-column prop="PHONE" label="手机号码" ></el-table-column>
				   	<el-table-column prop="YYS" label="运营商" ></el-table-column>
				   	<el-table-column prop="CAPTURETIME" :label="'时间('+jsondata.length+')'" :formatter="hqDateFormat1"></el-table-column>
				   	<el-table-column prop="ADDRESS" :label="'地点('+addressTotal+')'" ></el-table-column>
			  	</el-table>
			</div>

			<div class="search-content">

				<div class="search-table">
					<el-table 
						:data="tableData" 
						style="width: 100%;" 
						class="default-table" 
						@cell-click="showTable"
						@sort-change="sortControl" 
						highlight-current-row
						@selection-change="selectChange" >
					    <el-table-column type="selection" label="全选"></el-table-column>
					   	<el-table-column label="车牌">
						 	<template slot-scope="scope">
							 	<el-tag size="medium">{{ scope.row.data }}</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column label="颜色" prop="color"></el-table-column>
					   	<el-table-column label="区域数">
							<template slot-scope="scope">
							 	<el-tag size="medium">{{ scope.row.areas }}</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column label="地点数" sortable="custom" prop="locations">
							<template slot-scope="scope">
							 	<el-tag size="medium">{{ scope.row.locations }}</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column prop="times" label="匹配次数" sortable="custom"></el-table-column>
					   	<el-table-column prop="localtionMatch" label="地点匹配度" ></el-table-column>
					   	<el-table-column label="时间匹配度" >
							<template slot-scope="scope">
							 	<el-tag size="medium">{{ scope.row.timeMatch }}</el-tag>
						 	</template>
					   	</el-table-column>
					   	<el-table-column prop="earlyTime" label="最早时间" :formatter="hqDateFormat1"></el-table-column>
					   	<el-table-column prop="lateTime" label="最晚时间" :formatter="hqDateFormat1"></el-table-column>
				  	</el-table>

				    <div class="extra-table" :class="tableActiveClass">

				    	<!-- imsi、imei -->
					  	<default-table
							url="contact/carplate/carplate"
							:list="jsondata"
							:searchData="macDetail"
							timeName="time"
					  		placeName="location"
					  		:activeClass="extraTableList[0]"></default-table>

						<!-- 按区域数继续查询 -->
					  	<area-table
					  		url="contact/carplate/areas"
							:list="jsondata"
							:searchData="macDetail"
							areaName="area"
					  		matchName="areaNumber"
					  		:activeClass="extraTableList[1]"></area-table>

				    	<!-- 按地点数查询 -->
					  	<place-table
					  		url="contact/carplate/address"
							:list="jsondata"
							:searchData="macDetail"
							addressName="address"
					  		matchName="collectNumber"
					  		startName="earlyTime"
					  		endName="lateTime"
					  		:activeClass="extraTableList[2]"></place-table>

						<!-- 按时间匹配度查询 -->
					  	<match-table
					  		url="contact/carplate/times"
							:list="jsondata"
							:searchData="macDetail"
							addressName="address"
							startName="collecTimeLeft"
					  		endName="collecTimeRight"
					  		:activeClass="extraTableList[3]"
							:showSearchData="jsondata[0].IMSI"
							joinFirstName="IMSI"
					  		joinLastName="车牌"></match-table>

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
	import detailTabel from '../components/Table/SearchJoin/detail.vue'
	import areaTabel from '../components/Table/SearchJoin/area.vue'
	import placeTable from '../components/Table/SearchJoin/placeNumber.vue'
	import matchTable from '../components/Table/SearchJoin/match.vue'
	import pageSplit from '../components/common/pageSplit.vue'
 	export default {
 		name: 'sIjoinC',
 		props: {
 			time: {
 				required: true
 			},
 			json: {
 				type: String,
 				required: true
 			}
 		},
 		components: {
 			'default-table': detailTabel,
 			'area-table': areaTabel,
 			'place-table': placeTable,
 			'match-table': matchTable,
 			'page-split': pageSplit
 		},
	    data() {
	      	return {
				jsondata: [{
	      			IMSI: ''
	      		}],
	      		page_size: 50,
	      		searchKey: '',
	      		selected: [],
	      		addressTotal: '',
	      		macDetail: '',

		        //	列表参数
		        tableActiveClass: '',
		        extraTableList: ['hidden','hidden','hidden','hidden'],
		        tableAjax: {
		        	addSort: 'asc',
					timeSort: 'asc'
		        },

	        	tableData: [],
	        	total: 0
      		}
	    },
	    methods: {
	    	pageInit: function(){
				let time = this.time,
					jsondata = JSON.parse(this.json);
 				for(let i = 0;i<jsondata.length;i++){
 					jsondata[i].TIMEZON = time;
 				}
 				this.jsondata = jsondata;
	 			this.dataInit();
	    	},
	 		dataInit: async function(page_now,page_size,refresh){
	 			var _this = this,
	 			e = await loading(AJAX.post("contact/carplate/main",{
	 				pageNumber: page_now || 1,
	 				pageSize: page_size || _this.page_size,
	 				addSort: _this.tableAjax.addSort,
	 				timeSort: _this.tableAjax.timeSort,
	 				list: JSON.stringify(_this.jsondata)
	 			}))

				if(!refresh){
                    this.total = e.page.total;
                }
				if(e.result.length == 0){
                    this.$message("您未查到任何数据！");
                }
	        	this.searchKey = e.mapKey;
	        	this.tableData = e.result;
	 		},
	    	showTable: function(row, column, cell, event){
	    		var e = 0,_this = this;
	   			if(column.label == "时间匹配度"){
	   				e = 3;
	   				this.lastCar = row.data;
	   			}else if(column.label == "地点数"){
	   				e = 2;
	   			}else if(column.label == "区域数"){
	   				e = 1;
	   			}else if(column.label == "车牌"){
	   				e = 0;
	   			}else{
	   				return false;
	   			}
	    		this.extraTableList = ["hidden","hidden","hidden","hidden"];
	    		this.$set(this.extraTableList,e,'');
	    		this.tableActiveClass = 'active';

	      		this.macDetail = row.data;
	    	},
	    	tableClose: function(){
	    		this.tableActiveClass = '';
	    	},
	      	selectChange: function(e){
	      		this.selected = e;
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
	      		if(e.prop == 'locations'){
	      			this.tableAjax.addSort = this.tableAjax.addSort == 'desc'?"asc":"desc";
	      			this.tableAjax.timeSort = '';
	      			this.dataInit();
	      		}else if(e.prop == 'times'){
	      			this.tableAjax.timeSort = this.tableAjax.timeSort == 'desc'?"asc":"desc";
	      			this.tableAjax.addSort = '';
	      			this.dataInit();
	      		}
	      	},
	      	timeThrow() {
                var i,select = [];
                if(!this.selected.length){
                   	for(i = 0; i < this.page_size;i++){
                        select.push(this.tableData[i].data);
                    }
                }else {
                    for(i = 0; i < this.selected.length;i++){
                        select.push(this.selected[i].data);
                    }
                }
                this.$parent.addNewTab({
                    url: "map/search/imsi/join/car",
                    text: "IMSI、IMEI关联车牌地图",
                    name: "DataSearchIMSIJoinCarMap",
                    query: {
                        key: this.searchKey,
                        cars: JSON.stringify(select)
                    }
                });
            }
	    },
	    computed: {
	    	unionKey: function(){
	    		return this.json + this.time;
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
</style>
