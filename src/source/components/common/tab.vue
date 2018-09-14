<template>
	<div class="tab-case">
		<div :class="tabClass1" v-on:click="tab1">时间模式</div>
		<div :class="tabClass2" v-on:click="tab2">地点模式</div>
	</div>
</template>
<script>
 	export default {
 		name: 'tab',
	    data() {
	    	return {
	    		tabClass1: 'active',
	    		tabClass2: ''
	    	}
	    },
	    methods: {
	    	tab1: function(){
				this.tabClass1 = 'active';
				this.tabClass2 = '';
				this.$emit("handleTab1"); 		
	    	},
	    	tab2: function(){
				this.tabClass1 = '';
				this.tabClass2 = 'active';
				this.$emit("handleTab2")     		
	    	}
	    }
  	}
</script>
<style lang="scss">
	$coop-color: #f3f3f3;
	$active-color: #1890ff;

	.tab-case{
		width: calc(100% - 20px);
		padding: 10px 0 0;
		overflow: hidden;
		div{
			border-radius: 4px 4px 0 0;
			float: left;
			background: #ffffff;
			height: 35px;
			line-height: 35px;
			padding: 0 30px;
			color: #888888;
			cursor: pointer;
			border: 1px solid #d9d9d9;
			border-bottom: none;
			&.active{
			    border: none;
				color: $active-color;
				background: $coop-color;
				height: 36px;
			}
		}
	}
</style>