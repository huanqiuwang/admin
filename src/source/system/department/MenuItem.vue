<template>
	<div class="node-tree-item" @click.stop="active(data.id)">
		<span class="" :style="'padding-left: '+20*depth+'px'"></span>
		<span v-if="!!data.child" class="el-icon-caret-right"></span>
		<span class="el-icon-document"></span>
		<span class="el-icon-more" @click="showCopration(data.id)"></span>
		<span class="node-content">{{data.text}}</span>
	</div>
</template>
<script>
	export default {
		props: {
			data: {
				type: Object,
				required: true,
				default () {
					return {}
				}
			},
			depth: {
				required: false
			},
		},
		components: {
			
		},
		data () {
			return {
				oldId: ''
			}
		},
		methods: {
			showCopration: function(){
				alert(this.data.id);
			},
			active: function(e){
				this.$emit("refreshClass",e);
			}
		}
	}
</script>
<style lang="scss">
	.node-tree-item{
		position: relative;
		padding: 7px 0;
		cursor: pointer;
		.el-icon-more{
			position: absolute;
			right: 5px;
			top: 8px;
			transform: rotateZ(90deg);
			font-size: 15px;
			display: none;
		}
		&.active{
			background: #1093f1;
			color: white;
			.el-icon-more{
				display: block;
			}
		}
	}
</style>