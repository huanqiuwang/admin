<template>
	<div class="ty-menu-list">
		<div class="ty-menu-item"
			:class="{active: current == data.id}" 
			@click.stop="selectHandle(data.id)">
			<p :style="'padding-left:' + parseInt(depth) * 20 + 'px'">
				<span>{{data.name}}</span>
				<span>({{data.alins}})</span>
			</p>
			<copration-btn
				v-if="current == data.id"
				:id="data.id"
				@copration="copration"
				@closeBtn="closeBtn"></copration-btn>
		</div>

		<div class="ty-menu-wrap">
			<coop-menu
				:depth="parseInt(depth) + 1"
				v-for="item in data.children"
				:current="current"
				:key="item.id"
				:data="item"
				@copration="copration"
				@selectHandle="selectHandle"></coop-menu>		
		</div>
	</div>
</template>
<script>
	import copration from './copration.vue'

	export default {
		name: 'coop-menu',
		props: {
			current: {
				type: String,
				required: false
			},
			data: {
				type: Object,
				required: true
			},
			depth: {
				required: true
			}
		},
		components: {
			'copration-btn': copration
		},
		data () {
			return {

			}
		},
		methods: {
			selectHandle: function(id){
				this.$emit("selectHandle",id);
			},
			copration: function (arg) {
				this.$emit("copration",arg);
			},
			closeBtn: function(){
				this.$emit("selectHandle",'');
			}
		}
	}
</script>
<style lang="scss">
	.ty-menu-item{
		padding: 8px 0;
		display: inline-block;
		position: relative;
		cursor: pointer;
		&.active{
			color: #1890ff;
		}
	}
</style>