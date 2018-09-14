<template>
	<el-table :data="smallTable">
	    <el-table-column type="index" label="序号"></el-table-column>
	    <el-table-column prop="CAPTURETIME" label="采集时间" :formatter="hqDateFormat1" sortable></el-table-column>
	</el-table>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		props: {
			url: {
				type: String,
				required: true
			},
			list: {
				type: String,
				required: true
			},
			address: {
				type: String,
				required: true
			},
			searchData: {
				type: String,
				required: true
			},
			color: {
				type: String,
				required: false
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
					imac: this.searchData,
					imsi: this.searchData,
					imei: this.searchData,
					carplate: this.searchData,
					address: this.address,
					sort: 'asc',
					color: this.color,
					list: this.list
				}));
				this.smallTable = result;
			}
		},
		watch: {
			listenStr: function(){
				this.refreshData();
			}
		},
		computed: {
			listenStr: function(){
				return this.searchData + this.address
			}
		}
	}
</script>
<style lang="scss">
	
</style>