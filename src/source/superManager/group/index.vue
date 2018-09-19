<template>
	<div class="ty-content tenant-content">
		<div class="ty-query-list">
			<span class="btn active" @click="showAdd">添加组织</span>
		</div>
		<div class="ty-total-info">
			<label class="el-icon-info"></label>
			<span>共用 <label>{{ total || 0 }}</label> 个组织</span>
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
			    <el-table-column prop="name" label="组织名称"></el-table-column>
			    <el-table-column prop="time" label="有效期" :formatter="hqDateFormat1">
					<template slot-scope="scope">
						{{hqDateFormatYMD(scope.row.startTime)}} - {{hqDateFormatYMD(scope.row.endTime)}}
					</template>
			    </el-table-column>
			    <el-table-column prop="remark" label="备注"></el-table-column>
			    <el-table-column label="操作" width="150">
			    	<template slot-scope="scope">
			    		<el-button size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" @click="jurisdiction(scope.$index, scope.row)">权限配置</el-button>
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
			:data="defaultData"></user-add>

		<jurisdiction-set
			:activeClass="jurisdictionClass"
			:data="jurisdictionJson"
			@closeHandle="closeJuridiction"></jurisdiction-set>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import pageSplit from '../../components/common/pageSplit.vue'
	import addBox from './box.vue'
	import jurisdiction from './jurisdiction.vue'

	import { testData } from './index.js'

	export default {
		components: {
			'page-split': pageSplit,
			'user-add': addBox,
			'jurisdiction-set': jurisdiction,
		},
		data () {
			return {
				defaultData: {},
				showAddClass: 'hidden',
				jurisdictionClass: 'hidden',
				tableData: testData,
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
				this.defaultData = {};
				this.showAddClass = 'active';
			},
			edit: function(index, row){
				this.defaultData = row;
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
			closeJuridiction: function(){
				this.jurisdictionClass = 'hidden';
			},
			jurisdiction: function(index, row){
				this.jurisdictionJson = row;
				this.jurisdictionClass = 'active';
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