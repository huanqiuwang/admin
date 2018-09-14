<template>
	<div class="search-wrapper case-table">
	
		<div class="search-scroll">
			<!-- 案件列表查询 -->
			<div class="case-query-list">
				<div class="case-query-item">
					<span>布控名：</span>
					<input type="text" placeholder="请输入布控名" v-model="search.name" />
				</div>
				<div class="case-query-item">
					<span>创建人：</span>
					<input type="text" placeholder="请输入创建人信息" v-model="search.owner" />
				</div>
				<div class="case-query-item">
					<span>状态：</span>
					<el-select v-model="search.status" placeholder="请选择" class="hq-input">
					    <el-option
					      	v-for="item in options"
					      	:key="item.code"
					      	:label="item.status"
					      	:value="item.code">
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
				<span class="btn active query-btn" @click="showAdd">+新建</span>
				<span class="btn" @click="batchCon">批量续控</span>
				<span class="btn" @click="batchShut">批量终止</span>
				<span class="btn" @click="batchDel">批量删除</span>
			</div>

			<div class="search-table">
				<!-- 案件布控列表显示 -->
				<el-table
					:data="list"
					ref="multipleTable"
					@sort-change="sortControl" 
					highlight-current-row
					@selection-change="selectChange">
					<el-table-column type="selection" label="全选"></el-table-column>
					<el-table-column label="序号" width="60">
						<template slot-scope="scope">
							<span>{{scope.row.index + 1 + (searchCache.pageNumber - 1) * searchCache.pageSize}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="NAME" label="布控名"></el-table-column>
					<el-table-column prop="ALIAS" label="归属地">
						<template slot-scope="scope">
							<span v-for="item in scope.row.address">{{item.PROVINCE + '/' + item.CITY + ' '}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="CYTIME" label="监控周期（秒）" width="120px"></el-table-column>
					<el-table-column prop="OWNER" label="创建人"></el-table-column>
					<el-table-column prop="CREATETIME" label="创建时间" width="140" sortable="custom" :formatter="hqDateFormat1"></el-table-column>
					<el-table-column label="状态" width="90">
						<template slot-scope="scope">
							<li>{{options[scope.row.STATUS].status}}</li>
						</template>
					</el-table-column>
					<el-table-column prop="WARNCOUNT" label="预警个数" width="80"></el-table-column>
					<el-table-column prop="POLICE" label="处警人">
						<template slot-scope="scope">
							<span>{{scope.row.users.join(',')}}</span>
						</template>
					</el-table-column>
				   	<el-table-column label="操作" width="200">
						<template slot-scope="scope">
						 	<el-button size="mini" @click="del(scope.$index,scope.row)">删除</el-button>
						 	<el-button size="mini" @click="edit(scope.$index,scope.row)">编辑</el-button>
						 	<el-button size="mini" @click="dest(scope.$index,scope.row)">续控</el-button>
						 	<el-button size="mini" @click="shut(scope.$index,scope.row)">终止</el-button>
					 	</template>
				   	</el-table-column>
			  	</el-table>
	        </div>
   		</div>
		
		<!-- 分页管理 -->
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
		<control-continue
			:caseId='caseIdNow'
			:activeClass="showControlContinue"
			@closeHandle="continueClose"></control-continue>
	</div>	
</template>
<script>
	import { MessageBox } from 'element-ui'
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import addCase from './addCase.vue'
	import pageSplit from '../../components/common/pageSplit.vue'
	import { controlContinue } from '../../components/CaseManage/Ownership/index.js' 

	export default {
		name: 'OwnershipInfo',
		components: {
			'add-case': addCase,
			"page-split": pageSplit,
			'control-continue': controlContinue
		},
		data () {
			return {
				// 组件参数
				showAddClass: 'hidden',
				showControlContinue: 'hidden',
				editData: '',
				caseIdNow: '',		//	续控正在操控的id
				caseId: '',
				caseType: 'add',
				createTime: ['',''],
				options: [],
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
					name: '',
					owner: '',
					status: '',
					startTime: '',
					endTime: '',
					pageNumber: 1,
					pageSize: 50,
					timeSort: 'asc'
				},
				total: 0,
                searchCache: {
					name: '',
					owner: '',
					status: '',
					startTime: '',
					endTime: '',
					pageNumber: 1,
					pageSize: 50,
					timeSort: 'asc'
                },
                selectList: [],

				// 显示列表参数
				list: [],

			}
		},
		methods: {
			reset: function(){
				this.search = {
					name: '',
					owner: '',
					status: '',
				}
				this.createTime = ['',''];
			},
			closeAdd: function(){
				this.showAddClass = 'hidden';
				this.editData = '';
				this.caseType = 'add';
				this.dataInit();
			},
			continueClose: function(){
				this.showControlContinue = 'hidden';
				this.dataInit();	//	刷新页面
			},
			showAdd: function(){
				this.showAddClass = 'active';
			},
			queryInit: function(){
				this.searchCache = Object.assign({},this.searchCache,this.search);
				this.dataInit();
			},
			dataInit: async function(page_now,page_size,refresh){
				this.searchCache.pageNumber = page_now || 1;
				this.searchCache.pageSize = page_size || this.searchCache.pageSize;
				let res = await loading(AJAX.post("location/monitor/list/query",this.searchCache));
				if(!refresh){
                   	this.total = res.page.total;
                }
				if(res.length == 0){
					this.$message("您未查到任何数据！");
					this.total = 0;
					this.list = res.result;
				}else{
                	this.list = res.result;
				}
			},

			//	案件目标勾选
			selectChange: function(e){
                this.selectList = e;
            },
			//	列表排序控制
			sortControl: function(e){
	      		if(e.prop == 'CREATETIME'){
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
            del: async function(index, row){
            	let _this = this;
            	MessageBox.confirm('确定要删除该案件？','提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(async function(){
	          		let res = await loading(AJAX.post("location/monitor/del",{
	          			ridList: row.RID,
	          			userId: sessionStorage.getItem("username")
	          		}));
	          		_this.$message({
	          			message: "删除成功！",
	          			type: 'success'
	          		})
	          		_this.dataInit();
	          		if(row.clear){
	          			_this.$refs.multipleTable.clearSelection();
	          		}
		        });
            },
			edit: async function(index, row){
				let res = await loading(AJAX.post("location/monitor/query",{rid: row.RID}));
				this.editData = JSON.stringify(res.result);
				this.caseId = row.RID;
				this.caseType = 'edit';
				this.showAdd();
			},
			dest: function(index, row){
				this.caseIdNow = row.RID;
				this.showControlContinue = 'active';
			},
			shut: async function(index, row){
				var _this = this;
				MessageBox.confirm('确定要停止对该案件目标的布控？','提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		        }).then(async function(){
	          		let { res } =  await loading(AJAX.post("location/monitor/stop",{
						ridList: row.RID,
						userId: sessionStorage.getItem("username")
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
					ridList.push(e.RID);
				});
				this.dest(0, {
					RID: ridList.join(',')
				})
			},
			batchShut: async function(){
				let list = [],
					ridList = [],
					real = await this.judgeSelect();
				this.selectList.map(e => {
					ridList.push(e.RID);
				});
				this.shut(0, {
					RID: ridList.join(',')
				})
			},
			batchDel: async function( rows ){
				let ridList = [],
					real = await this.judgeSelect();
				this.selectList.map(e => ridList.push(e.RID));
				this.del(0, {
					RID: ridList.join(','),
					clear: true
				});
	          	
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
					this.search.startTime = Date.parse(this.createTime[0])/1000 || "";
					this.search.endTime = Date.parse(this.createTime[1])/1000 || "";
				}else{
					this.search.startTime = '';
					this.search.endTime = '';
				}
			},
			list: function(){
				this.list.map((e,i) => e.index = i);
			}
		},
		mounted: async function(){
			let { result } = await loading(AJAX.post("location/monitor/status/all"));
			this.options = result;
		}
	}
</script>