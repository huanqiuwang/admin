<template>
	<div class="ty-btn-wrapper">
		<div class="ty-btn-list">
			<p @click.stop="edit">编辑</p>
			<p @click.stop="add">添加</p>
		</div>
		<div class="ty-opacity-backmood" @click.stop="close"></div>
	</div>
</template>
<script>
	export default {
		props: {
			id: {
				type: String,
				required: true
			}
		},
		data () {
			return {

			}
		},
		methods: {
			edit: function(){
				this.$emit("copration",{
					id: this.id,
					type: 'edit'
				})
			},
			add: function(){
				this.$emit("copration",{
					id: this.id,
					type: 'add'
				})
			},
			close: function(){
				this.$emit("closeBtn");
			}
		}
	}
</script>
<style lang="scss">
	.ty-btn-wrapper{
		.ty-btn-list{
			position: absolute;
			left: calc(100% + 10px);
			top: calc(100% - 25px);
			width: 150px;
			text-align: center;
			line-height: 32px;
		    z-index: 4;
		    border-radius: 3px;
		    &::before{
		    	content: '';
				position: absolute;
				border-left: 0px solid transparent;
				border-top: 4px solid transparent;
				border-bottom: 4px solid transparent;
				border-right: 6px solid white;
				z-index: 4;
				left: -6px;
				top: 5px;
		    }
			p{
				color: #666666;
				background: white;
				cursor: pointer;
				&:hover{
					color: #1890ff;
					background: #bbdeff;
				}
			}
		}
		.ty-opacity-backmood{
			position: fixed;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 2;
			cursor: pointer;
		}
	}
	
</style>