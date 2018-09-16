<template>
	<!-- 案件布控-弹窗专用遮罩 -->
	<div class="case-backmood" @click="close"></div>
</template>
<script>
	export default {
		methods: {
			close: function(){
				this.$emit("closeFormMood")
			}
		}
	}
</script>
<style lang="scss" scoped>
	.case-backmood{
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 5;
		left: 0;
		top: 0;
		background: rgba(0,0,0,.65);
	}
</style>