<template>
	<!-- 案件布控-弹窗专用头部 -->
	<div class="case-header">
		<span>{{title}}</span>
		<i class="case-close" @click="close">×</i>
	</div>
</template>
<script>
	export default {
		props: {
			title: {
				type: String,
				default: '弹窗标题',
				required: false
			}
		},
		methods: {
			close: function(){
				this.$emit("closeFormMood")
			}
		}
	}
</script>
<style lang="scss">
	.case-header{
		height: 54px;
		position: relative;
		background: #efefef;
		font-size:18px;
		color:#333333;
		text-align:left;
		line-height: 54px;
		padding-left: 15px;
		i{
			font-size: 36px;
			color: #888888;
			position: absolute;
			right: 12px;
			top: 1px;
			cursor: pointer;
		}
	}
</style>