<template>
	<div class="ty-content tenant-content">
		<div class="ty-query-list">
			<span class="btn active" @click="showAdd">添加系统</span>
		</div>
		<div class="ty-total-info">
			<label class="el-icon-info"></label>
			<span>共用 <label>{{ total || 0 }}</label> 个系统</span>
		</div>
		<div class="ty-table">
			<el-table
			    :data="tableData"
			    stripe>
			    <el-table-column label="序号">
					<template slot-scope="scope">
						{{scope.$index + 1 + (ajaxCache.ajaxpageNumber-1) * ajaxCache.pageSize}}
					</template>
			    </el-table-column>
			    <el-table-column prop="name" label="系统名称"></el-table-column>
			    <el-table-column prop="time" label="系统标注"></el-table-column>
			    <el-table-column label="操作" width="150">
			    	<template slot-scope="scope">
			    		<el-button size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" @click="passReset(scope.$index, scope.row)">菜单配置</el-button>
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

		<!-- 添加编辑组织 -->
		<user-add
			@closeHandle="closeAdd"
			:activeClass="showAddClass"
			:data="defaultData.orgData"></user-add>
	</div>
</template>
<script>
 	import { MessageBox } from 'element-ui'
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import pageSplit from '../../components/common/pageSplit.vue'
	import userAdd from './add.vue'
	// import jurisdiction from './jurisdiction.vue'

	export default {
		components: {
			'page-split': pageSplit,
			'user-add': userAdd,
			// 'jurisdiction-set': jurisdiction,
		},
		data () {
			return {
				defaultData: {
					orgData: {}
				},
				showAddClass: 'hidden',
				tableData: [],
				total: 0,
				ajaxCache: {
					pageNumber: 1,
					pageSize: 50,
				},
				jurisdictionJson: {}
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
			closeAdd: function(){
				this.showAddClass = 'hidden'
			},
			handleSizeChange: function(e){
				this.dataInit(1, e, 1);
			},
			handleCurrentChange: function(e){
				this.dataInit(e, 0, 1);
			},
			passReset: function(index, row){
				let _this = this;
				MessageBox.confirm("确定要重置该租户的密码？","提示",{
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(async function(){
					let res = await loading(AJAX.post("del",{
						id: row.id
					}))
					_this.$message({
						message: "重置密码操作成功！",
						type: 'success'
					})
				})
			}
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