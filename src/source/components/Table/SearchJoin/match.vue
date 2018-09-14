<template>
	<el-table 
		:data="smallTable" 
		:span-method="objectSpanMethod"
		:class="activeClass">
	    <el-table-column prop="index" label="序号"></el-table-column>
	   	<el-table-column :prop="addressName" label="采集地点" ></el-table-column>
	   	<el-table-column v-if="startName" :prop="startName" :label="joinFirstName!='人像'?'采集时间\n('+joinFirstName+':'+showSearchData+')':'采集时间'" :formatter="hqDateFormat1"></el-table-column>
	   	<el-table-column :prop="endName" :label="'采集时间\n('+joinLastName+':'+searchData+')'" :formatter="hqDateFormat1"></el-table-column>
  	</el-table>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		props: {
			activeClass: {
				type: String
			},
			showSearchData: {
				type: String,
				required: true
			},
			joinFirstName: {
				type: String,
				required: true
			},
			joinLastName: {
				type: String,
				required: true
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
			addressName: {
				type: String,
				required: true
			},
			startName: {
				type: String,
				required: false
			},
			endName: {
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
					list: JSON.stringify(this.list)
				}));
				this.smallTable = this.placeDataFormat(result);
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