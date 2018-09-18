<template>
	<div class="department-wrapper ty-content">

		<!-- 头部查询 -->
		<div class="department-query-case">
			<input type="text" v-model="searchKey" placeholder="查找成员或部门" >
			<span class="btn active" @click="queryInit">查询</span>
			<span class="btn" @click="reset">清空</span>
		</div>

		<!-- 内容显示 -->
		<div class="department-content">
			<menu-wrapper></menu-wrapper>
			<div class="department-right">
				<div class="department-right-btn">
					<span class="btn active" @click="showUser">添加用户</span>
					<span class="btn" @click="batchAlter">批量修改部门</span>
				</div>
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
					    <el-table-column prop="name" label="姓名"></el-table-column>
				     	<el-table-column prop="name" label="警号"></el-table-column>
				      	<el-table-column prop="name" label="身份证号码"></el-table-column>
				       	<el-table-column prop="name" label="手机号码"></el-table-column>
				        <el-table-column prop="name" label="所在部门"></el-table-column>
					    <el-table-column prop="time" label="有效期"></el-table-column>
					    <el-table-column prop="remark" label="备注"></el-table-column>
					    <el-table-column label="操作" width="150">
					    	<template slot-scope="scope">
					    		<el-button size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
								<el-button size="mini" @click="jurisdiction(scope.$index, scope.row)">权限配置</el-button>
					    	</template>
					    </el-table-column>
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

		<add-user
			:activeClass="addUserClass"
			@closeHandle="closeUser"></add-user>

		<depart-tree
			:activeClass="treeActive"
			@closeTree="closeTree"
			@getCheckedCallback="getSelectNodes"></depart-tree>
	</div>
</template>
<script>
	import MenuWrapper from './MenuWrapper.vue'
	import pageSplit from '../../components/common/pageSplit.vue'
	import addUser from './addUser.vue'
	import departTree from '../../components/common/system/tree.vue'
	
	export default {
		components: {
			'menu-wrapper': MenuWrapper,
			'page-split': pageSplit,
			'add-user': addUser,
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
<style lang="scss" scoped>
	.department-query-case{
		padding: 15px 0;
		input{
			width: 220px;
			height: 32px;
			border-radius: 3px;
			border: 1px solid #d2d2d2;
			padding: 0 0 0 10px;
		}
	}
	.department-content{
		padding: 15px 0;
		overflow: hidden;
		.department-left-menu{
			width: 280px;
			float: left;
			height: 100%;
			min-height: 400px;
		}
		.department-right{
			width: calc(100% - 300px);
			float: left;
			padding: 0 0 0 20px;
			.department-right-btn{
				padding: 0 0 20px 0;
				position: relative;
				left: -5px;
			}
		}
	}
	
</style>