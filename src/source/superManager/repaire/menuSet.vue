<template>
	<div class="ty-content ty-menu-content">
		<div class="menu-set-title">
			<span><label>系统维护></label><label class="active">菜单配置</label></span>
			<span class="btn active" @click="copration({id: '',type: 'add'})">添加配置</span>
		</div>
		<div class="menu-set-content">
			<menu-list
				v-for="item in menuData"
				:data="item"
				:key="item.id"
				depth="0"
				@selectHandle="selectHandle"
				@copration="copration"
				:current="current"></menu-list>
		</div>

		<menu-add
			:activeClass="menuAddClass"
			:data= "menuAddData"
			@closeHandle="closeMenuAdd"></menu-add>
	</div>
</template>
<script>
	import menuList from './menuList.vue'
	import menuAdd from './menuAdd.vue'

	export default {
		props: {
			id: {
				type: String,
				required: false
			}
		},
		components: {
			'menu-list': menuList,
			'menu-add': menuAdd
		},
		data () {
			return {
				menuAddClass: 'hidden',
				menuAddData: {},
				menuData: [
					{
						id: '1',
						name: '以及菜单',
						alins: 'firstMenu'
					},{
						id: '2',
						name: '一级菜单2',
						alins: 'firstMenu two',
						children: [
							{
								id: '3',
								name: 'erji菜单',
								alins: 'secondMenu'
							},{
								id: '4',
								name: 'erji菜单',
								alins: 'secondMenu two'
							}
						]
					}
				],
				current: ''
			}
		},
		methods: {
			reset: function(){
				this.menuAddData = {};
			},
			selectHandle: function(id){
				this.current = id;
			},
			copration: function({id, type}){
				this.menuAddData = {
					type: type,
					id: id
				}
				this.menuAddClass = 'active';
				console.log("这是id：", id, "这是操作类型：", type);
			},
			closeMenuAdd: function(){
				this.reset();
				this.menuAddClass = 'hidden';
			}
		},
	}
</script>
<style lang="scss">
.ty-menu-content{
	height: 100%;
	.menu-set-title{
		padding: 30px 10px 10px;
		span:nth-child(1){
			&>span:nth-child(2){
				color: #1890ff;
			}
		}
		span:nth-child(2){
			float: right;
		}
	}
	.menu-set-content{
		margin: 10px;
		background: #f2f2f2;
		border-radius: 5px;
		padding: 50px 10px 10px 140px;
		height: calc(100% - 120px);
	}
}
</style>