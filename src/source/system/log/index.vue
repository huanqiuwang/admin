<template>
	<div class="department-wrapper ty-content">

		<!-- 头部查询 -->
		<div class="sys-query-case">
			<div class="sys-query-item">
				<span>操作人：</span>
				<input type="text" v-model="coporationer" placeholder="请输入" maxlength="20" >
			</div>
			<div class="sys-query-item">
				<span>所属部门：</span>
				<input type="text" v-model="belone" placeholder="查找成员或部门" maxlength="30" >
			</div>
			<div class="sys-query-item">
				<span>操作时间：</span>
				<el-date-picker
			        v-model="date"
			        type="datetimerange"
			        align="right"
			        unlink-panels
			        range-separator="至"
			        start-placeholder="开始时间"
			        end-placeholder="结束时间"
			        :picker-options="pickerOptions2">
			    </el-date-picker>
			</div>
			<div class="sys-query-item">
				<span>ip地址：</span>
				<input type="text" v-model="ip" placeholder="请输入ip地址" maxlength="20" >
			</div>
			<div class="sys-query-item">
				<span>操作类型：</span>
				<el-select v-model="value" placeholder="请选择">
				    <el-option
				      	v-for="item in options"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value">
				    </el-option>
			  	</el-select>
			</div>
			<div class="sys-query-item">
				<span>接口调用URL：</span>
				<input type="text" v-model="interface" placeholder="请输入接口调用URL" >
			</div>
			<div class="sys-query-item">
				<span class="btn active" @click="queryInit">查询</span>
				<span class="btn" @click="reset">清空</span>
			</div>
		</div>

		<!-- 内容显示 -->
		<div class="department-content">
			<div class="department-right">
				<div class="department-table">
					<el-table
					    :data="tableData"
					    @selection-change="selectChange"
					    stripe>
						<el-table-column type="selection" label="全选"></el-table-column>
					    <el-table-column label="序号">
							<template slot-scope="scope">
								{{scope.$index + 1 + (ajaxCache.ajaxpageNumber-1) * ajaxCache.pageSize}}
							</template>
					    </el-table-column>
					    <el-table-column prop="id" label="编号"></el-table-column>
				     	<el-table-column prop="name" label="应用名/系统名"></el-table-column>
				      	<el-table-column prop="name" label="操作类型"></el-table-column>
				       	<el-table-column prop="name" label="操作人"></el-table-column>
				        <el-table-column prop="name" label="操作时间"></el-table-column>
					    <el-table-column prop="time" label="IP地址"></el-table-column>
					    <el-table-column prop="remark" label="所属部门"></el-table-column>
					    <el-table-column prop="remark" label="接口"></el-table-column>
				  	</el-table>
				</div>
			</div>
		</div>

		<div class="ty-page-split">
			<page-split
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
				:pageTotal="total"></page-split>
		</div>

		<depart-tree
			:activeClass="treeActive"
			@closeTree="closeTree"
			@getCheckedCallback="getSelectNodes"></depart-tree>
	</div>
</template>
<script>
	import pageSplit from '../../components/common/pageSplit.vue'
	import departTree from '../../components/common/system/tree.vue'
	
	export default {
		components: {
			'page-split': pageSplit,
			'depart-tree': departTree
		},
		data () {
			return {
				searchKey: '',
				total: 0,
				tableData: [],
				select: [],
				addUserClass: 'hidden',
				treeActive: 'hidden',
				pickerOptions2: {
	          	shortcuts: [{
		            text: '最近一年',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近两年',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 2);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近五年',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 5);
		              picker.$emit('pick', [start, end]);
		            }
		          }],
		      	},
		      	date: '',
		      	options: [{
		          	value: '选项1',
		          	label: '黄金糕'
		        }, {
		          	value: '选项2',
		          	label: '双皮奶'
		        }, {
		          	value: '选项3',
		          	label: '蚵仔煎'
		        }, {
		          	value: '选项4',
		          	label: '龙须面'
		        }, {
		          	value: '选项5',
		          	label: '北京烤鸭'
		        }],
		        value: '',
		        coporationer: '',
		        interface: '',
				belone: '',
				ip: '',
			}
		},
		methods: {
			reset: function(){
				this.searchKey = '';
			},
			queryInit: function(){
				this.dataInit();
			},
			dataInit: function(page_now, page_size, refresh){
				
			},
			handleSizeChange: function(e){
				this.dataInit(1, e, 1);
			},
			handleCurrentChange: function(e){
				this.dataInit(e, 0, 1);
			},
			selectChange: function(e){
				this.select = e;
			},
			showUser: function(){
				this.addUserClass = 'active';
			},
			closeUser: function(){
				this.addUserClass = 'hidden';
			},
			batchAlter: function(){
				if(this.select.length == 0){
					this.$message({
						message: '您还未选择需要操作的数据',
						type: 'warning'
					})
				}else{
					this.treeActive = 'active';
				}
			},
			getSelectNodes: function(nodes){
				console.log(nodes);
				// select数据处理
				this.closeTree();
			},
			closeTree: function(){
				this.treeActive = 'hidden';
			},
		}
	}
</script>
<style lang="scss">
	.sys-query-case{
		padding: 30px 0 0;
		.sys-query-item{
			padding: 10px 0;
			display: inline-block;
			&>span:nth-child(1){
				width: 120px;
				display: inline-block;
				text-align: right;
				&.btn{
					width: auto;
				}
			}
			&>input{
				width: 220px;
				height: 32px;
				line-height: 32px;
				border-radius: 3px;
				border: 1px solid #d2d2d2;
				padding-left: 10px;
			}
			.el-date-editor{
				height: 34px;
				padding: 0 10px;
				input{
					height: 32px;
				}
			}
			.el-select{
				width: 232px;
				height: 34px;
				.el-input__inner{
					height: 34px;
					line-height: 34px;
				}
			}
		}
	}

</style>