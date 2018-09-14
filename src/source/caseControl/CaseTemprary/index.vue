<template>
	<div class="search-wrapper case-table">
	
		<div class="search-scroll">
			<!-- 案件列表查询 -->
			<div class="case-query-list">
				<div class="case-query-item">
					<span>布控名：</span>
					<input type="text" placeholder="请输入布控名" v-model="search.caseName" />
				</div>
				<div class="case-query-item">
					<span>创建人：</span>
					<input type="text" placeholder="请输入创建人信息" v-model="search.creater" />
				</div>
				<div class="case-query-item">
					<span>处警人：</span>
					<input type="text" placeholder="请输入处警人" v-model="search.police" />
				</div>
				<div class="case-query-item">
					<span>状态：</span>
					<el-select v-model="search.status" clearable placeholder="请选择" class="hq-input">
					    <el-option
					      	v-for="item in options"
					      	:key="item.key"
					      	:label="item.value"
					      	:value="item.key">
					    </el-option>
				  	</el-select>
				</div>
				<div class="case-query-item">
					<span>时间：</span>
					<el-date-picker
				        v-model="createTime"
				        type="datetimerange"
				        align="right"
				        unlink-panels
				        range-separator="至"
				        start-placeholder="开始日期"
				        end-placeholder="结束日期"
				        :picker-options="pickerOptions">
				    </el-date-picker>
				</div>
				<span class="btn active" @click="queryInit">查询</span>
				<span class="btn reset-btn" @click="reset">重置</span>
			</div>

			<!-- 批量操作 -->
			<div class="case-add-btn">
				<span class="btn active" @click="showAdd">+添加</span>
				<!-- <span class="btn" @click="batchCon">批量续控</span>
				<span class="btn" @click="batchShut">批量终止</span>
				<span class="btn" @click="batchDel">批量删除</span> -->
			</div>

			<div class="case-total-info">
				<i class="el-icon-info"></i>
				<span>共有<i>{{ total }}</i>项布控，<label>{{ runtime }}</label>运行中，<label>{{ outtime }}</label>已停止</span>
			</div>

			<div class="search-table template-table">
				<!-- 案件布控列表显示 -->
				<el-table 
					:data="list" 
					@sort-change="sortControl" 
					highlight-current-row
					@selection-change="selectChange">
					<el-table-column type="selection" label="全选"></el-table-column>
					<el-table-column label="序号" width="60">
						<template slot-scope="scope">
							<span>{{ (searchCache.currentPage - 1) * searchCache.pageSize + scope.$index +1 }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="monitorname" label="布控名"></el-table-column>
					<el-table-column label="布控字段">
						<template slot-scope="scope">
							<span v-if="scope.row.monitortype != 4">{{scope.row.monitorvalue}}</span>
							<img v-else :src="scope.row.faceList[0].url" alt="" />
						</template>
					</el-table-column>
					<el-table-column prop="owner" label="创建人" :width="Wx"></el-table-column>
					<el-table-column prop="capturetime" label="创建时间" sortable="custom" :formatter="hqDateFormat1" :width="Wxxx"></el-table-column>
					<el-table-column label="状态" :width="Wx">
						<template slot-scope="scope">
							<span v-if="scope.row.status == 0">未开始</span>
							<span v-if="scope.row.status == 1">进行中</span>
							<span v-if="scope.row.status == 2">已结束</span>
						</template>
					</el-table-column>
					<el-table-column prop="DESCRIPTION" label="布控周期" width="280px">
						<template slot-scope="scope">
							<span>{{hqDateFormat(scope.row.begintime)+'至'+hqDateFormat(scope.row.endtime)}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="police" label="处警人"></el-table-column>
				   	<el-table-column label="操作" :width="Wxxxx">
						<template slot-scope="scope">
						 	<el-button size="mini" @click="del(scope.$index,scope.row)">删除</el-button>
						 	<el-button size="mini" @click="edit(scope.$index,scope.row)">编辑</el-button>
						 	<el-button v-if="scope.row.status == 2" size="mini" @click="dest(scope.$index,scope.row)">续控</el-button>
						 	<el-button v-if="scope.row.status != 2" size="mini" @click="shut(scope.$index,scope.row)">终止</el-button>
					 	</template>
				   	</el-table-column>
			  	</el-table>
	        </div>
        </div>

		<!-- 分页与额外的按钮管理 -->
        <div class="search-coperation bottom-coperation">
			<page-split
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
				:pageTotal="total"></page-split>
		</div>

	 	<!-- 添加编辑弹出窗 -->
		<add-case
			:activeClass="showAddClass"
			:caseId="caseId"
			:data="editData"
			:type="caseType"
			@closeHandle="closeAdd"></add-case>

		<!-- 案件续控 -->
		<temprary-continue
			:caseId='caseIdNow'
			:activeClass="showControlContinue"
			@closeHandle="continueClose"></temprary-continue>
	</div>	
</template>
<script>
	import { MessageBox } from 'element-ui'
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import addCase from './addCase.vue'
	import { tempraryContinue } from '../../components/CaseManage/temprary/index.js'
	import pageSplit from '../../components/common/pageSplit.vue'

	export default {
		name: 'TempraryInfo',
		components: {
			'add-case': addCase,
			'temprary-continue': tempraryContinue,
			"page-split": pageSplit,
		},
		data () {
			return {

				// 组件参数
				total: 0,
				showAddClass: 'hidden',
				showControlContinue: 'hidden',
				editData: '',
				caseIdNow: '',		//	续控正在操控的id
				caseId: '',
				caseType: 'add',
				createTime: '',
				options: [
					{
						key: '0',
						value: '未开始'
					},{
						key: '1',
						value: '进行中'
					},{
						key: '2',
						value: '已结束'
					}
				],
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

				// 查询参数
				search: {
					police: '',
					caseName: '',
					creater: '',
					status: '',
					pageNumber: 1,
					pageSize: 50,
					start: '',
					end: '',
				},
                searchCache: {
                	owner: '',
					monitorname: '',
					police: '',
					status: '',
					begintime: '',
					endtime: '',
					currentPage: 1,
					pageSize: 50,
					order: 2
                },
                selectList: [],

				// 显示列表参数
				list: [],
				runtime: 0,
				outtime: 0,
			}
		},
		methods: {
			reset: function(){
				this.search = {
					police: '',
					caseName: '',
					creater: '',
					status: '',
					pageSize: this.searchCache.pageSize
				}
				this.createTime = '';
			},
			closeAdd: function(){
				this.dataInit();
				this.editData = '';
				this.caseType = 'add';
				this.showAddClass = 'hidden';
			},
			continueClose: function(){
				this.showControlContinue = 'hidden';
				this.dataInit();	//	刷新页面
			},
			showAdd: function(){
				this.showAddClass = 'active';
			},
			//	数据查询，参数组装
			queryInit: function(){
				let { police, caseName, creater, status, pageNumber, pageSize ,start, end, order } = this.search;
				this.searchCache = Object.assign({},this.searchCache,{
					owner: creater,
					monitorname: caseName,
					police: police,
					status: status,
					begintime: start || '',
					endtime: end || '',
					currentPage: pageNumber,
					pageSize: pageSize,
				});
				this.dataInit();
			},
			dataInit: async function(page_now,page_size,refresh){
				this.searchCache.currentPage = page_now || 1;
				this.searchCache.pageSize = page_size || this.searchCache.pageSize;
				let res = await loading(AJAX.post("monitor/list",this.searchCache));
				this.list = res.result;
				this.runtime = res.runtime;
				this.outline = res.outline;
				if(res.length == 0){
					this.$message("您未查到任何数据！");
					this.total = 0;
				}else{
                	if(!refresh){
                       	this.total = res.page.totalCount;
                    }
				}
			},

			//	案件目标勾选
			selectChange: function(e){
                this.selectList = e;
            },
			//	列表排序控制
			sortControl: function(e){
	      		if(e.prop == 'CAPTURETIME'){
	      			this.searchCache.timeSort = this.searchCache.timeSort == 'desc'?"asc":"desc";
	      			this.dataInit();
	      		}
	      	},
	      	// 分页控制
            handleSizeChange(val) {
                this.searchCache.pageSize = val;
                this.dataInit(1,val,1);
            },
            handleCurrentChange(val) {
                this.dataInit(val,0,1);
            },

            //	列表操作-删除-编辑-续控-终止
            del: function(index, row){
            	let _this = this;
            	MessageBox.confirm('确定要删除该案件？','提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(async function(){
	          		let res = await loading(AJAX.post("monitor/status",{
	          			monitorid: row.mid,
						begintime: '',
						endtime: '',
						monitortime: '',
	          			status: 3
	          		}));
	          		_this.$message({
	          			message: "删除成功！",
	          			type: 'success'
	          		})
	          		_this.list.splice(index,1);
		        })
            },
			edit: async function(index, row){
				let res = await loading(AJAX.post("monitor/info/"+row.mid));
				this.editData = JSON.stringify(res.result);
				this.caseId = row.mid;
				this.caseType = 'edit';
				this.showAdd();
			},
			dest: function(index, row){
				this.caseIdNow = row.mid;
				this.showControlContinue = 'active';
			},
			shut: async function(index, row){
				var _this = this;
				MessageBox.confirm('确定要停止对该案件目标的布控？','提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(async function(){
	          		let { res } =  await loading(AJAX.post("monitor/status",{
						monitorid: row.mid,
						status: 2,
						begintime: '',
						endtime: '',
						monitortime: '',
					}));
	          		_this.$message({
	          			message: "停止操作成功！",
	          			type: 'success'
	          		})
	          		_this.dataInit();
		        })
			},
			//	列表批量操作
			batchCon: async function(){
				let list = [],
					ridList = [],
					real = await this.judgeSelect();
				this.selectList.map(e => {
					list.push({
						rid: e.rid,
						statusDes: e.statusDes
					})
					ridList.push(e.rid);
				});
				if(list.find(e => e.statusDes == '进行中')){
					this.$message({
	          			message: "正在进行中的案件不能被‘续控’！",
	          			type: 'warning'
	          		})
				}else if(list.find(e => e.statusDes == '未开始')){
					this.$message({
	          			message: "还未开始的案件不能被‘续控’！",
	          			type: 'warning'
	          		})
				}else{
					this.dest(0, {
						RID: ridList.join(',')
					})
				}
			},
			batchShut: async function(){
				let list = [],
					ridList = [],
					real = await this.judgeSelect();
				this.selectList.map(e => {
					list.push({
						rid: e.rid,
						statusDes: e.statusDes
					})
					ridList.push(e.rid);
				});
				if(list.find(e => e.statusDes == '已结束')){
					this.$message({
	          			message: "已结束的案件不能被再次‘结束’！",
	          			type: 'warning'
	          		})
				}else{
					this.shut(0, {
						rid: ridList.join(',')
					})
				}
			},
			batchDel: async function(){
				let ridList = [],
					real = await this.judgeSelect();
				this.selectList.map(e => ridList.push(e.rid));
				this.del(0, {
					rid: ridList.join(',')
				})
			},
			judgeSelect: async function(){
				if(!this.selectList || !this.selectList.length){
					this.$message({
	          			message: "还未勾选需要操作的列！",
	          			type: 'warning'
	          		})
	          		return Promise.reject('需要勾选数据才能进一步操作！');
				}
			}
		},
		watch: {
			createTime: function(){
				if(!!this.createTime){
					this.search.start = Date.parse(new Date(this.createTime[0]))/1000;
					this.search.end = Date.parse(new Date(this.createTime[1]))/1000;
				}
			}
		},
		created: async function(){
			let res = await this.queryInit();
		}
	}
</script>
<style lang="scss">
	.case-query-list{
		.case-query-item{
			.hq-input{
				input{
					height: 32px;
					line-height: 32px;
				}
			}
		}
	}
	
	.template-table{
		table{
			tr{
				td{
					img{
						width: 60px;
						height: 60px;
						background: url("../../../assets/images/default-user.png") no-repeat;
						background-size: 100% 100%;
						margin: 5px 0 0 0;
					}
				}
			}
		}
	}

	.case-total-info{
		background:#e6f7ff;
		border:1px solid #bae7ff;
		border-radius:4px;
		height:38px;
		margin: 10px 0;
		line-height: 38px;
		color: rgba(0,0,0,0.65);
		width: calc(100% - 30px)!important;
		.el-icon-info{
			margin-left: 20px;
		}
		i{
			color: #1890ff;
			margin: 0 4px;
		}
		label{
			margin: 0 3px;
		}
	}
</style>