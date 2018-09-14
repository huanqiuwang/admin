<template>
	<div class="cooporation-case">
		<p @click="alter">修改部门名称</p>
		<p @click="add">添加子部门名称</p>
		<p @click="del">删除</p>
		<p @click="top">上移</p>
		<p @click="down">下移</p>
		<div class="backdrop"></div>
	</div>
</template>
<script>
	export default {
		data () {
			return {

			} 
		},
		methods: {
			alter: function(){
				console.log("alter")
			},
			add: function(){
				console.log("alter")
			},
			del: function(){
				console.log("alter")
			},
			top: function(){
				console.log("alter")
			},
			down: function(){
				console.log("alter")
			},
		}
	}
</script>
<style lang="scss">
	.cooporation-case{
		position: absolute;
		left: calc(100% - 20px);
		width: 180px;
		height: auto;
		p{
			padding: 6px 0 6px 8px;
		}
	}
</style>