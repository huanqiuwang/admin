<template>
	<el-select
	 	v-model="controlType" 
	 	clearable
	 	@clear="clearSelect" 
	 	placeholder="请选择" 
	 	class="hq-input">
	    <el-option
	      	v-for="item in options"
	      	:key="item.key"
	      	:label="item.value"
	      	:value="item.key">
	    </el-option>
  	</el-select>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		props: {
			defaultData: {
				required: false
			},
		},
		data () {
			return {
				controlType: '',
				options: [],
				url: 'caseType/list'
			}
		},
		watch: {
			controlType: function(){
				this.options.map(e => {
					if(e.key == this.controlType){
						this.changeType(e);
						return false;
					}
				})
			},
			defaultData: function(){
				this.controlType = this.defaultData;
			}
		},
		methods: {
			dataInit: async function(){
				let {result} = await loading(AJAX.post(this.url));
				this.options = result;
			},
			changeType: function(controlType){
				this.$emit("changeTypeHandle",controlType);
			},
			clearSelect: function(){
				this.controlType = '';
				this.changeType({
					key: '',
					value: ''
				});
			}
		},
		created: function(){
			this.dataInit();
		}
	}
</script>
<style lang="scss">
	.hq-input{
		&.el-select{
			height: 32px;
			.el-input{
				height: 32px;
				input{
					height: 32px;
				}
			}
		}
	}
	
</style>