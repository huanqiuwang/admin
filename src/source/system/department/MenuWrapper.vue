<template>
	<div class="department-left-menu">
		<menu-list
		    class="item"
		    depth='0'
		    :model="treeData" 
		    @choose="chooseItem" 
		    :current="currentId"
		    :current1="current1">
	  	</menu-list>
		
		<add-depart
			:activeClass="departClass"
			:defaultKey="defaultParent"
			@closeHandle="closeDepart"></add-depart>
	</div>
</template>
<script>
	import addDepart from './addDepart.vue'

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
			'menu-list': MenuList,
			'add-depart': addDepart,
		},
		data () {
			return {
				treeData: data,
		    	currentId: '0',
		    	current1: '0',
		    	departClass: "hidden",
		    	defaultParent: ''
			}
	  	},
	  	methods: {
		    chooseItem(info) {
		    	if(info.type === 'showCopration'){
		    		this.current1 = info.id;
		    	}else if(info.type === 'close'){
		    		this.current1 = '0';
		    	}else if(info.type === 'add'){
		    		this.defaultKey = '';
		    		this.departClass = 'active';
		    	}else if(info.type === 'alter'){
		    		this.defaultKey = info.id;
		    		this.departClass = 'active';
		    	}else{
		    		this.currentId = info.id
		    	}
		      	console.log(info);
		    },
		    closeDepart: function(){
				this.departClass = 'hidden';
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