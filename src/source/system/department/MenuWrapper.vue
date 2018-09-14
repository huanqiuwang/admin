<template>
	<div class="department-left-menu">
		<menu-list
		    class="item"
		    depth='0'
		    :model="treeData" 
		    @choose="chooseItem" 
		    :current="currentId">
	  	</menu-list>
	</div>
</template>
<script>
	var data = {
	  	name: '树形结构菜单',
	  	id: 1,
	  	children: [
	    	{ name: '一级菜单1', id: 2 },
	    	{ name: '一级菜单2',id: 3 },
	    	{
	      		name: '一级菜单3',
	      		id: 4,
	      		children: [
					{
		          		name: '二级菜单1',
		          		id: 5,
		          		children: [
				            { name: '三级菜单1', id: 6 },
				            { name: '三级菜单2', id: 7 }
	          			]
	        		},
			        { name: '二级菜单2', id: 8 },
			        { name: '二级菜单3', id: 9 },
			        {
				        name: '二级菜单4',
				        id: 10,
				        children: [
				            { name: '三级菜单3', id: 11 },
				            { name: '三级菜单4', id: 12 }
			          	]
			       	}
	      		]
	    	}
	  	]
	}

	import MenuList from './MenuList.vue';
	export default {
		components: {
			'menu-list': MenuList
		},
		data () {
			return {
				treeData: data,
		    	currentId: '0',
			}
	  	},
	  	methods: {
		    chooseItem(info) {
		    	this.currentId = info.id
		      	console.log(this.currentId)
		    }
	  	}
	}
</script>
<style lang="scss">

	.department-left-menu{
		width: 280px;
		height: auto;
		background: #f2f2f2;
		li{
			list-style: none;
		}
		ul {
		  	padding-left: 1em;
			line-height: 1.5em;
			list-style-type: dot;
		}
	}
	.item {
	  	cursor: pointer;
	}
	.bold {
	  	font-weight: bold;
	}
</style>