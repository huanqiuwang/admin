<template>
	<div class="ty-btn-wrapper">
		<div class="ty-btn-list">
			<p @click.stop="alter">修改部门名称</p>
			<p @click.stop="add">添加子部门名称</p>
			<p @click.stop="del">删除</p>
			<p @click.stop="up">上移</p>
			<p @click.stop="down">下移</p>
		</div>
		<div class="ty-opacity-backmood" @click.stop="close"></div>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import { MessageBox } from 'element-ui'

	export default {
		props: {
			id: {
				required: true
			}
		},
		data () {
			return {

			}
		},
		methods: {
			alter: function(){
				this.$emit("copration",{
					id: this.id,
					type: 'alter'
				})
			},
			add: function(){
				this.$emit("copration",{
					id: this.id,
					type: 'add'
				})
			},
			del: function(){
				let _this = this;
				MessageBox.confirm("确认要删除该部门？", "提示", {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(async function(){
					let res = loading(AJAX.delete("删除部门",{
						id: _this.id
					}))
					_this.$message({
						message: res.message,
						type: 'success'
					})
					_this.$emit("refreshHandle");
					_this.close();
				})
			},
			up: function(){
				// this.$emit("refreshHandle");
				// this.close();
				console.log("up:", this.id)
			},
			down: function(){
				// this.$emit("refreshHandle");
				// this.close();
				console.log("down:", this.id)
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
			box-shadow: 0px 0px 4px #d2d2d2;
			left: calc(100% + 10px);
			top: calc(100% - 25px);
			width: 150px;
			text-align: center;
			line-height: 32px;
		    z-index: 4;
		    border-radius: 3px;
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