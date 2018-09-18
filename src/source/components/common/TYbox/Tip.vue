<template>
	<div class="ty-tip" v-if="!!tip">
		<p><i class="el-icon-error"></i><span>{{tip}}</span></p>
	</div>
</template>
<script>
	export default {
		props: {
			tip: String,
			required: false,
			default: '数据格式错误！'
		},
	}
</script>
<style lang="scss" scoped="">
	.ty-tip{
		text-align: left;
		color: #f7706c;
		i{
			margin: 0 5px;
		}
		span{
			font-size: 12px;
			font-family: '微软雅黑','Arial';
		}
	}
</style>