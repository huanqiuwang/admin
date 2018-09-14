<template>
	<div class="search-wrapper case-table">

		<div class="search-scroll">
			<!-- 案件列表查询 -->
			<div class="case-query-list">
				<div class="case-query-item">
					<span>创建时间：</span>
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
				<div class="case-query-item">
					<span>案件类型：</span>
					<case-type-select
						:defaultData="listAjaxData.caseTypeId"
						@changeTypeHandle="typeChange"></case-type-select>
				</div>
				<div class="case-query-item">
					<span>关键字：</span>
					<input type="text" placeholder="请输入关键字" v-model="key" />
				</div>
				<span class="btn case-query-btn active" @click="queryInit">查询</span>
				<span class="btn case-query-btn reset-btn" @click="reset">重置</span>
			</div>
		
			<div class="case-add-btn">
				<span class="btn new-case-btn active" @click="showAdd">添加案件</span>
			</div>

			<!-- 案件布控列表显示 -->
			<div class="search-table">
				<el-table 
					:data="list" 
					@sort-change="sortControl" 
					highlight-current-row>
					<el-table-column label="编号" width="65">
						<template slot-scope="scope">
							<span>{{scope.row.RID}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="CASETYPE" label="案件类型" width="120"></el-table-column>
					<el-table-column prop="ALIAS" label="案件别名"></el-table-column>
					<el-table-column prop="ADDRESS" label="案件地点"></el-table-column>
					<el-table-column prop="DESCRIPTION" label="案件说明"></el-table-column>
					<el-table-column prop="CAPTURETIME" label="创建时间" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
				   	<el-table-column prop="OWNER" label="创建人" width="72"></el-table-column>
				   	<el-table-column label="操作" width="240">
						<template slot-scope="scope">
						 	<el-button size="mini" @click="showDetail(scope.$index,scope.row)">详情</el-button>
						 	<el-button size="mini" @click="edit(scope.$index,scope.row)">编辑</el-button>
						 	<el-button size="mini" @click="del(scope.$index,scope.row)">删除</el-button>
						 	<el-button size="mini" @click="dest(scope.$index,scope.row)">布控目标</el-button>
					 	</template>
				   	</el-table-column>
			  	</el-table>
			</div>
			

			<!-- 案件目标 -->
	        <div class="extra-table bigger-table" :class="tableActiveClass">
				<div class="case-top-btn">
					<label>共{{targetList.length}}个目标</label>
					<span class="btn active-btn" @click="showControlAdd">添加目标</span>
					<span class="btn active-btn" @click="batchDel">批量删除</span>
					<span class="btn active-btn" @click="batchShut">批量终止</span>
					<span class="btn active-btn" @click="batchCon">批量续控</span>
				</div>
                <el-table 
                	:data="targetList"
                	@selection-change="selectChange">
                	<el-table-column type="selection" label="全选"></el-table-column>
                    <el-table-column prop="alias" label="目标名称"></el-table-column>
                    <el-table-column prop="name" label="创建人" width="72"></el-table-column>
                    <el-table-column prop="police" label="处警人"></el-table-column>
                    <el-table-column label="布控周期" width="155">
						<template slot-scope="scope">
							<span>{{hqDateFormat(scope.row.monitorStartTime)+'至'+hqDateFormat(scope.row.monitorEndTime)}}</span>
						</template>
                    </el-table-column>
                    <el-table-column prop="name" label="状态" width="80">
						<template slot-scope="scope">
							<span>{{scope.row.statusDes}}</span>	
						</template>
                    </el-table-column>
                    <el-table-column label="布控字段">
						<template slot-scope="scope">
							<div v-if="scope.row.list">
								<li v-for="item in scope.row.list" v-if="item.value!='[]'" :key="item.id">{{item.type + ':' + item.value}}</li>
							</div>
							<div v-if="scope.row.face">
								<li v-for="item in scope.row.face" v-if="item.value!='[]'" :key="item.id">
									<img :src="item.url" alt="">
								</li>
							</div>
						</template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="140">
						<template slot-scope="scope">
							<div v-if="scope.row.list">
								<ol v-for="item in scope.row.list" v-if="item.value!='[]'" :key="item.id">{{hqDateFormat(item.capturetime)}}</ol>
							</div>
							<div v-if="scope.row.face">
								<ol v-for="item in scope.row.face" v-if="item.value!='[]'" :key="item.id">{{hqDateFormat(item.capturetime)}}</ol>
							</div>
						</template>
                    </el-table-column>
                    <el-table-column label="操作" width="220">
                    	<template slot-scope="scope">
						 	<el-button size="mini" @click="smalldel(scope.$index,scope.row)">删除</el-button>
						 	<el-button size="mini" @click="smalledit(scope.$index,scope.row)">修改</el-button>
						 	<el-button v-if="scope.row.status == 1 || scope.row.status == 2" size="mini" @click="smalldest(scope.$index,scope.row)">续控</el-button>
						 	<el-button v-if="scope.row.status == 1" size="mini" @click="smallshut(scope.$index,scope.row)">终止</el-button>
					 	</template>
                    </el-table-column>
                </el-table>

                <i class="table-close el-icon-d-arrow-right" v-on:click="tableClose"></i>
            </div>
        </div>

		<!-- 分页管理 -->
		<div class="search-coperation bottom-coperation">
			<page-split
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
				:pageTotal="total"></page-split>
		</div>

		<!-- 新建布控-编辑布控 -->
		<control-add
			:activeClass="controlAddClass"
			:type="controlType"
			:targetId="targetId"
			@closeHandle="controlClose"
			:data="controlDeaultData"
			:caseId="caseId"></control-add>

		<!-- 查看案件详情 -->
		<case-info 
		:data="tableData"
		@closeHandle="closeInfo"
		:activeClass="showInfo"></case-info>

		<!-- 添加新的案件 -->
		<case-info-add
			:activeClass="showInfoAdd"
			@closeHandle="infoAddClose"
			:data="caseEditData"
			:dataType="caseAddType"></case-info-add>

		<!-- 案件续控 -->
		<control-continue
			:caseId='caseIdNow'
			:activeClass="showControlContinue"
			@closeHandle="continueClose"></control-continue>
	</div>
</template>
<script>
	import { MessageBox } from 'element-ui'
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import { CaseInfo,CaseInfoAdd,ControlAdd,ControlContinue } from '../../components/CaseManage/index.js'
	import caseTypeSelect from '../../components/CaseManage/index/CaseTypeSelect.vue'
	import pageSplit from '../../components/common/pageSplit.vue'

	export default {
		name: 'CaseInfo',
		data () {
			return {
				key: '',
				caseIdNow: '',
				list: [],
				tableData: '',
				showInfo: 'hidden',
				showInfoAdd: 'hidden',
				showControlContinue: 'hidden',
				controlAddClass: 'hidden',
				createTime: '',
				caseEditData: '',
				caseAddType: 'add',
				controlDeaultData: '',
				controlType: 'add',

				targetId: '',
				targetList: [],
				selectList: [],
				tableActiveClass: 'hidden',
				caseId: '',
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
		        total: 0,
		        listAjaxData: {				//	页面的相关ajax数据
		        	pageNumber: 1,
		        	pageSize: 20,
		        	keyWord: '',
		        	startTime: '',
		        	endTime: '',
		        	timeSort: 'asc',
		        	caseTypeId: ''
		        },
		        listAjaxCache: '',			//	缓存下来的ajax数据
			}
		},
		components: {
			"case-info": CaseInfo,
			"case-info-add": CaseInfoAdd,
			"control-add": ControlAdd,
			"case-type-select": caseTypeSelect,
			"control-continue": ControlContinue,
			"page-split": pageSplit
		},
		methods: {
			//	数据重置
			reset: function(){
				this.createTime = '';
				this.listAjaxData.caseTypeId = '';
				this.key = '';
			},
			//	数据查询初始化
			queryInit: function(){
				this.listAjaxCache = this.listAjaxData;
				this.dataInit();
			},
			//	数据显示、翻页、排序、删除、更新
			dataInit: async function(page_now,page_size,refresh){
				this.listAjaxCache.pageNumber = page_now || 1;
				this.listAjaxCache.pageSize = page_size || this.listAjaxCache.pageSize;
				var res = await loading(AJAX.post("case/list/query",this.listAjaxCache));
				if(res.result.length == 0){
					this.$message("您未查到任何数据！");
					this.total = 0;
					this.list = res.result;
				}else{
                	this.list = res.result;
                	if(!refresh){
                       	this.total = res.page.total;
                    }
				}
			},

		 	// 分页控制
            handleSizeChange(val) {
                this.listAjaxCache.pageSize = val;
                this.dataInit(1,val,1);
            },
            handleCurrentChange(val) {
                this.dataInit(val,0,1);
            },

			//	更新案件类型
			typeChange: function(e){
				this.listAjaxData.caseTypeId = e.key;
			},

			//	删除案件--批量删除公用
			del: async function(index, row){
				var _this = this;
				MessageBox.confirm('确定要删除该案件？','提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(async function(){
	          		let res = await loading(AJAX.post("caseTarget/delCase",{
	          			list: row.RID,
	          			userId: sessionStorage.getItem("username")
	          		}));
	          		_this.$message({
	          			message: res.message,
	          			type: 'success'
	          		})
	          		_this.dataInit();
		        })
			},
			//	编辑案件
			edit: async function(index, row){
				let res = await loading(AJAX.post("case/info",{rid: row.RID}));
				this.caseEditData = JSON.stringify(res.result);
				this.caseAddType = 'edit';
				this.showAdd();
			},
			//	布控目标显示
			dest: async function(index, row){
				let { result } = await loading(AJAX.post("caseTarget/list",{caseId: row.RID}));
				this.targetList = result;
				this.caseId = row.RID;
				this.tableActiveClass = 'active';
			},

			//	布控目标批量处理--批量删除--考虑到删除之后列表元素可能并没有被全部删除，所以直接刷新数据
			batchDel: async function(){
				let ridList = [],res = await this.batchCheck(this.selectList);
				this.selectList.map(e => ridList.push(e.rid));
				this.smalldel(0, {
					rid: ridList.join(',')
				})
			},
			//	布控目标批量处理--批量终止
			batchShut: async function(){
				let list = [],ridList = [],res = await this.batchCheck(this.selectList);
				this.selectList.map(e => {
					list.push({
						rid: e.rid,
						status: e.status
					})
					ridList.push(e.rid);
				});
				if(list.find(e => e.status == 2)){
					this.$message({
	          			message: "已结束的案件不能被再次‘结束’！",
	          			type: 'warning'
	          		})
				}else if(list.find(e => e.status == 0)){
					this.$message({
	          			message: "未开始的案件不能被‘结束’！",
	          			type: 'warning'
	          		})
				}else{
					this.smallshut(0, {
						rid: ridList.join(',')
					})
				}
			},
			//	布控目标批量处理--批量续控
			batchCon: async function(){
				let list = [],ridList = [],res = await this.batchCheck(this.selectList);
				this.selectList.map(e => {
					list.push({
						rid: e.rid,
						status: e.status
					})
					ridList.push(e.rid);
				});
				if(list.find(e => e.status == 0)){
					this.$message({
	          			message: "还未开始的案件不能被‘续控’！",
	          			type: 'warning'
	          		})
				}else{
					this.smalldest(0, {
						rid: ridList.join(',')
					})
				}
			},
			batchCheck: async function(e){
				if(e.length === 0){
					this.$message({
						type: 'warning',
						message: '请勾选需要操作的目标！'
					})
					return Promise.reject("需要勾选数据才能进一步操作！");
				}else{
					return true;
				}
			},
			//	删除案件目标
			smalldel: async function(index, row){
				var _this = this;
				MessageBox.confirm('确定要删除该案件目标？','提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(async function(){
	          		let { message } =  await loading(AJAX.post("caseTarget/delTarget",{
						list: row.rid,
						userId: sessionStorage.getItem("username")
					}));
	          		_this.$message({
	          			message: message,
	          			type: 'success'
	          		})
	          		_this.dest(index,{
	          			RID: _this.caseId
	          		});
		        })
			},
			//	目标续控
			smalldest: function(index, row){
				this.caseIdNow = row.rid;
				this.dest(index,{
          			RID: this.caseId
          		});
				this.showControlContinue = 'active';
			},
			//	终止布控
			smallshut: function(index, row){
				var _this = this;
				MessageBox.confirm('确定要停止对该案件目标的布控？','提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(async function(){
	          		let { res } =  await loading(AJAX.post("caseTarget/stopTarget",{
						list: row.rid,
						userId: sessionStorage.getItem("username")
					}));
	          		_this.$message({
	          			message: "停止操作成功！",
	          			type: 'success'
	          		})
	          		_this.dest(index,{
	          			RID: _this.caseId
	          		});
		        })
			},
			//	布控编辑
			smalledit: async function(index, row){
				let { result } = await loading(AJAX.post("caseTarget/detail",{
					targetId: row.rid
				}));
				//	拼接参数
				this.targetId = row.rid;
				this.controlDeaultData = JSON.stringify(result);
				this.controlType = 'edit';
				this.showControlAdd();
			},
			tableClose: function(){
                this.tableActiveClass = '';
            },
			//	案件目标勾选
			selectChange: function(e){
                this.selectList = e;
            },
			//	列表排序控制
			sortControl: function(e){
	      		if(e.prop == 'CAPTURETIME'){
	      			this.listAjaxCache.timeSort = this.listAjaxCache.timeSort == 'desc'?"asc":"desc";
	      			this.dataInit();
	      		}
	      	},

			//	关闭案件详情窗口
			closeInfo: function(){
				this.showInfo = 'hidden';
			},
			//	关闭案件添加窗口,如果涉及到刷新页面操作需要传入值
			infoAddClose: function(e){
				this.showInfoAdd = 'hidden';
				this.caseAddType = 'add';
				this.caseEditData = '';
				if(e){
					this.queryInit();
				}
			},
			//	关闭续控窗口--刷新正在使用的窗口
			continueClose: function(){
				this.showControlContinue = 'hidden';
				this.dest(0,{
          			RID: this.caseId
          		});
			},
			//	关闭布控添加窗口
			controlClose: function(e){
				this.controlAddClass = 'hidden';
				this.controlType = 'add';
				if(e){
					this.dest(0,{
	          			RID: this.caseId
	          		})
				}
			},
			//	显示案件添加窗口
			showAdd: function(){
				this.showInfoAdd = 'active';
			},
			//	显示案件详情窗口
			showDetail: async function(index, row){
				let res = await loading(AJAX.post("case/info",{rid: row.RID}));
				this.tableData = JSON.stringify(res.result);
				this.showInfo = 'active';
			},
			//	显示布控添加窗口
			showControlAdd: function(){
				this.controlAddClass = 'active';
			},
		},
		watch: {
			key: function(){
				this.key = this.trimAll(this.key);
				this.listAjaxData.keyWord = this.key;
			},
			createTime: function(){
				if(!!this.createTime){
					this.listAjaxData.startTime = Date.parse(this.createTime[0])/1000;
					this.listAjaxData.endTime = Date.parse(this.createTime[1])/1000;
				}else{
					this.listAjaxData.startTime = '';
					this.listAjaxData.endTime = '';
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	
	.case-table{
		.extra-table{
			&.bigger-table{
				width: 75%;
				&.active{
					.el-icon-d-arrow-right{
						right: 72%;
					}
				}
				.el-icon-d-arrow-right{
					right: -5%;
				}
			}
			thead{
				tr{
					th{
						background: #f3f3f3;
						color: #323232;
					}
				}
			}
			tr{
				td{
					div{
						.el-button{
							margin: 2px 4px 2px 0;
						}
						&>p{
							width: 100%;
							border-bottom: 1px solid #dedede;
							border-left: 1px solid #dedede;
							border-right: 1px solid #dedede;
							&:last-child{
								border-bottom: none;
							}
						}
					}
					li{
						list-style: none;
						img{
							width: 60px;
							height: 60px;
							background: url("../../../assets/images/default-user.png") no-repeat;
							background-size: 100% 100%;
						}
					}
				}
			}
		}
		.case-top-btn{
			padding: 10px 20px;
			text-align: right;
			background: #e6f7ff;
			label{
				float: left;
				padding: 5px 0 0;
			}
			.btn.active-btn{
				color: white;
				background: #1890ff;
			}
		}
	}
</style>