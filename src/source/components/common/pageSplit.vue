<template>
<!-- 	说明：
		1.该分页调用element组件的分页；
		2.全局修改分页请修改data => split 的值，单独修改请传入pageData
		3.分页数据在更新每页显示数据数量时，本系统的业务逻辑时始终更新页面标签至1处 -->

	<el-pagination
        @size-change="changeSize"
        @current-change="changeCurrent"
        :current-page="split.currentPage"
        :page-sizes="split.pageSizeList"
        :page-size="split.pageSizeNow"
        layout="total, sizes, prev, pager, next, jumper"
        :total="split.total">
    </el-pagination>
</template>
<script>

	export default {
		props: {
			pageData: {
				type: Object,
				required: false
			},
			pageNow: {
				required: false
			},
			pageTotal: {
				required: false
			}
		},
		data () {
			return {
				split: {
		        	total: 0,
			        pageSizeNow: 50,
			        pageSizeList: [50, 100, 200, 500],
			        currentPage: 1
			    },
			}
		},
		methods: {
			changeSize: function(e){
				this.split.currentPage = 1;
				this.$emit("handleSizeChange",e);
			},
			changeCurrent: function(e){
				this.$emit("handleCurrentChange",e);
			}
		},
		watch: {
			pageTotal: function(){
				this.split.total = this.pageTotal;
				this.split.currentPage = 1;
			}
		},
		mounted: function(){
			// this.split = pageData;
		}
	}
</script>