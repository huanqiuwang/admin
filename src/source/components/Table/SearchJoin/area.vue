<template>
	<el-table :data="smallTable" :class="activeClass">
	    <el-table-column type="index" label="序号"></el-table-column>
	   	<el-table-column :prop="areaName" label="区域名称"></el-table-column>
	   	<el-table-column :prop="matchName" label="匹配次数" sortable></el-table-column>
  	</el-table>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		props: {
			activeClass: {
				type: String
			},
			url: {
				type: String,
				required: true
			},
			list: {
				type: Array,
				required: true
			},
			searchData: {
				type: String,
				required: true
			},
			areaName: {
				type: String,
				required: true
			},
			matchName: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				smallTable: [],
				already: ''
			}
		},
		methods: {
			refreshData: async function(){
				let {result} = await loading(AJAX.post(this.url,{
					mac: this.searchData,
					imsi: this.searchData,
					imei: this.searchData,
					carplate: this.searchData,
					colSort: 'asc',
					list: JSON.stringify(this.list)
				}));
				this.smallTable = result;
			}
		},
		watch: {
			listenStr: function(){
				if(this.activeClass != 'hidden'){
					this.refreshData();
				}
			}
		},
		computed: {
			listenStr: function(){
				return this.searchData + this.activeClass
			}
		}
	}
</script>
<style lang="scss">
	
</style>