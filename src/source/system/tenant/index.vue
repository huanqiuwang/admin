<template>
	<div class="ty-content tenant-content">
		<div>
			<span class="btn active">添加组织</span>
		</div>
		<div class="total-info">
			<span class="el-icon-info"></span>
			<span>共用 <label>{{ total || 0 }}</label>个组织</span>
		</div>
		<div class="ty-table">
			<el-table
			    :data="tableData"
			    stripe>
			    <el-table-column prop="name" label="组织名称" width="180"></el-table-column>
			    <el-table-column prop="time" label="有效期" width="180"></el-table-column>
			    <el-table-column prop="remark" label="备注"></el-table-column>
			    <el-table-column label="操作">
			    	<template slot-scope="scope">
			    		<el-button size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" @click="edit(scope.$index, scope.row)">权限配置</el-button>
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
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import pageSplit from '../../components/common/pageSplit.vue'

	export default {
		components: {
			'page-split': pageSplit
		},
		data () {
			return {
				tableData: [],
				total: 0,
				ajaxCache: {
					pageNumber: 1,
					pageSize: 50,
				}
			}
		},
		methods: {
			queryInit: function(){

			},
			dataInit: function(){

			},
			handleSizeChange: function(e){
				this.dataInit(e, 0, 0);
			},
			handleCurrentChange: function(e){
				this.dataInit(1, e, 0);
			},
		}
	}
</script>