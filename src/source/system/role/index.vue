<template>
	<div class="ty-content tenant-content">
		<div class="ty-query-list">
			<span class="btn active" @click="showAdd">添加角色</span>
		</div>
		<div class="ty-table">
			<el-table
			    :data="tableData"
			    stripe>
			    <el-table-column label="序号" width="60">
					<template slot-scope="scope">
						{{scope.$index + 1 + (ajaxCache.pageNumber-1) * ajaxCache.pageSize}}
					</template>
			    </el-table-column>
			    <el-table-column prop="name" label="角色名称"></el-table-column>
			    <el-table-column prop="remark" label="描述说明"></el-table-column>
			    <el-table-column label="操作" width="150">
			    	<template slot-scope="scope">
			    		<el-button size="mini" @click="del(scope.$index, scope.row)">删除</el-button>
			    		<el-button size="mini" @click="edit(scope.$index, scope.row)">修改</el-button>
			    		<el-button size="mini" @click="member(scope.$index, scope.row)">成员设置</el-button>
						<el-button size="mini" @click="power(scope.$index, scope.row)">权限设置</el-button>
			    	</template>
			    </el-table-column>
		  	</el-table>
		</div>
		<div class="ty-page-split">
			<page-split
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
				:pageTotal="total"></page-split>
		</div>

		<!-- 添加编辑组角色 -->
		<user-add
			@closeHandle="closeAdd"
			:activeClass="showAddClass"
			:data="defaultData"></user-add>

		<member-add
			@closeHandle="closeMember"
			:activeClass="showMemberClass"
			:defaultData="defaultMember"></member-add>

		<jurisdiction-set
			:activeClass="jurisdictionClass"
			:data="jurisdictionJson"
			@closeHandle="closeJuridiction"></jurisdiction-set>
	</div>
</template>
<script>
 	import { MessageBox } from 'element-ui'
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import pageSplit from '../../components/common/pageSplit.vue'
	import userAdd from './add.vue'
	import memberAdd from './member.vue'
	import { testData } from './index.js'
	import jurisdiction from './jurisdiction.vue'

	export default {
		components: {
			'page-split': pageSplit,
			'user-add': userAdd,
			'member-add': memberAdd,
			'jurisdiction-set': jurisdiction,
		},
		data () {
			return {
				defaultData: {},
				defaultMember: {},
				jurisdictionJson: {},
				showAddClass: 'hidden',
				showMemberClass: 'hidden',
				jurisdictionClass: 'hidden',
				tableData: testData,
				total: 0,
				ajaxCache: {
					pageNumber: 1,
					pageSize: 50,
				},
			}
		},
		methods: {
			dataInit: async function(page_now, page_size, refresh){
				this.ajaxCache.pageNumber = page_now || 1;
				this.ajaxCache.pageSize = page_size || this.ajaxCache.pageSize;
				let list = await loading(AJAX.get("123",this.ajaxCache));
				this.tableData = list.result;
			},
			showAdd: function(){
				this.showAddClass = 'active';
			},
			edit: function(index, row){
				this.defaultData = row;		//	这里可能会有问题
				this.showAdd();
			},
			closeAdd: function(){
				this.showAddClass = 'hidden'
			},
			handleSizeChange: function(e){
				this.dataInit(1, e, 1);
			},
			handleCurrentChange: function(e){
				this.dataInit(e, 0, 1);
			},
			del: async function(){
				let _this = this;
				MessageBox.confirm("确定要删除该角色吗？","提示",{
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(async function(){
					let res = await loading(AJAX.delete("del",{
						id: row.id
					}))
					_this.$message({
						message:  res.message || "删除操作成功！",
						type: 'success'
					})
				})
			},
			power: function(index, row){
				this.jurisdictionClass = 'active';
			},
			member: function(){
				this.showMemberClass = 'active';
			},
			closeMember: function(){
				this.showMemberClass = 'hidden';
			},
			closeJuridiction: function(){
				this.jurisdictionClass = 'hidden';
			},
		}
	}
</script>
<style lang="scss" scoped>
	.ty-query-list{
		.btn{
			margin-left: 0;
		}
	}
</style>