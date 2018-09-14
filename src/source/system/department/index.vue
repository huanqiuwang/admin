<template>
	<div class="department-wrapper">

		<!-- 头部查询 -->
		<div class="department-query-case">
			<input type="text" v-model="searchKey" placeholder="查找成员或部门" >
			<span class="btn active">查询</span>
			<span class="btn">清空</span>
		</div>

		<!-- 内容显示 -->
		<div class="department-content">
			<menu-wrapper></menu-wrapper>
			<div class="department-right">
				<div>
					<span class="btn active">添加用户</span>
					<span class="btn">批量修改部门</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import MenuWrapper from './MenuWrapper.vue'

	export default {
		components: {
			'menu-wrapper': MenuWrapper
		},
		data () {
			return {
				searchKey: '',
			}
		}
	}
</script>
<style lang="scss" scoped>
	.department-query-case{
		padding: 15px 0;
		input{
			width: 220px;
			height: 32px;
			border-radius: 3px;
			border: 1px solid #d2d2d2;
			padding: 0 0 0 10px;
		}
	}

	
</style>