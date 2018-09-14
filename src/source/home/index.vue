<template>
	<div class="search">
		<el-select v-model="value" placeholder="请选择">
		    <el-option
		      	v-for="item in options"
		      	:key="item.value"
		      	:label="item.label"
		      	:value="item.value">
		    </el-option>
	  	</el-select>
	  	<input type="text" v-model="key" />
	  	<el-button type="primary" icon="el-icon-search" v-on:click="beginSearch">搜索</el-button>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				options: [{
		            value: '1',
		            label: 'IMSI、IMEI'
		        }, {
		            value: '2',
		            label: 'MAC'
		        }, {
		            value: '3',
		            label: '车牌'
		        }, {
		            value: '4',
		            label: '虚拟身份'
		        }],
		        value: '1',
		        key: ''
			}
		},
		methods: {
			beginSearch: function(){
				var _this = this;
				if(this.value == 1){
					this.$router.push({
						name: 'searchImei',
						params: {
							key: _this.key
						}
					});
				}else if(this.value == 2){
					
				}else if(this.value == 3){
					this.$router.push({path: '/search/car'});
				}else if(this.value == 4){
					this.$router.push({path: '/search/other'});
				}
			}
		}
	}
</script>
<style lang="scss">
	.search{
		width: 1000px;
		height: 40px;
		display: inline-block;
		margin: 150px auto;
		margin-left: calc(50% - 500px);
		&>input{
			width: 640px;
			height: 38px;
			border-radius: 5px;
			border: 1px solid #d2d2d2;
			outline: none;
			padding-left: 10px;
		}
	}
</style>