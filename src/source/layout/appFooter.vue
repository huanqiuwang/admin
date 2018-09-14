
<template>
  	<div class="footer-wrapper">
		<p>© by 深圳天彦</p>
	</div>
</template>

<script>
	export default {
		name: 'appFooter',
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss">
	.mini-mode .footer-wrapper{
		width: calc(100% - 60px);
	}
	.footer-wrapper{
		height: 40px;
		text-align: right;
		box-shadow: 0px 0px 1px #888888;
	    position: absolute;
	    bottom: 0;
	    right: 0;
	    width: calc(100% - 240px);
		p{
			color: #a8a8a8;
			font-size: 12px;
			line-height: 40px;
			padding-right: 50px;
		}
	}
</style>
