<template>
	<!-- 树形插件 -->
	<div class="default-tree level-up-1" :class="activeClass">
		<div class="default-backmood"></div>
		<div class="tree-case">
			<input placeholder="输入关键字进行过滤" v-model="filterText" />
			<i class="el-icon-close" v-on:click="treeClose"></i>
			<el-tree
				class="filter-tree"
				:data="treeDateTest"
				show-checkbox
				node-key="id"
				ref="tree"
				:filter-node-method="filterNode"
				highlight-current
				:props="defaultProps"
				:default-expanded-keys="[treeDateTest[0].id]"
				@check-change="handleCheckChange"
				check-strictly>
			</el-tree>
			<div class="buttons">
				<el-button type="primary" @click="getCheckedNodes">确认</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		props: {
			activeClass: {
				type: String,
				required: false
			},
			defaultKey: {
				type: String,
				required: false
			}
		},
		name: 'departTree',
		data() {
			return {
		        selectTreeIndex: 0,

				filterText: '',
	        	treeDateTest: [{
	        		id: -666
	        	}],
		        defaultProps: {
		          	children: 'children',
		          	label: 'name',
		          	disabled: 'disabled'
		        }
			}
		},
		methods: {
			//	过滤搜索
			filterNode(value, data) {
		        if (!value) return true;
		        return data.name.indexOf(value) !== -1;
	      	},

	      	// 获取树形菜单被选取的数据
	      	getCheckedNodes() {
	      		var _this = this,
	      			data;
		        if(!this.$refs.tree.getCheckedKeys()){
		        	return false;
		        }else{
		        	data = {
		        		nodes: _this.getNodeFromList(_this.$refs.tree.getCheckedNodes()),
		        		keys: _this.arrTrim(_this.$refs.tree.getCheckedKeys())
		        	}
		        	this.$refs.tree.setCheckedNodes([]);
			        this.$emit("getCheckedCallback",data);
		        }
	      	},
	      	arrTrim: function(arr){
	      		var dest = new Array();
	      		for(let i = 0;i<arr.length;i++){
	      			if(!arr[i]){
	      				continue;
	      			}else{
	      				dest.push(arr[i]);
	      			}
	      		}
	      		return dest;
	      	},
	      	getNodeFromList: function(e){
	      		var arr = [],i = 0;
	      		for(i = 0;i<e.length;i++){
	      			arr.push(e[i].name);
	      		}
	      		return arr;
	      	},
	      	treeClose: function(){
	      		this.$refs.tree.setCheckedNodes([]);
	      		this.$emit("closeTree");
	      	},
	      	treeFormat: function(tree){
			    var i = 0,_this = this;
			    if(!!tree.device && tree.device.length!=0){          //  存在device
			    	tree.disabled = true;
			        for(i = 0;i < tree.device.length; i++){
			            tree.child.push(tree.device[i]);
			        }
			        delete tree.device
			    }
			    if(!!tree.child && tree.child.length!=0){
			    	tree.disabled = true;
			        tree.children = [];
			        for(i = 0;i < tree.child.length; i++){
			            tree.children[i] = _this.treeFormat(tree.child[i]);
			        }
			        delete tree.child
			    }
			    if(!tree.id){
			    	tree.disabled = true;
			    }
			    return tree;
	      	},

	      	//	只能选择一个子节点
	      	handleCheckChange(data, checked, indeterminate) {
	      		var _this = this,now = data.id,arr = [];
	      		for(let i = 0;i<this.$refs.tree.getCheckedNodes().length;i++){
	      			arr.push(_this.$refs.tree.getCheckedNodes()[i].id);
	      		}
	        	if(arr.length > 1){
	        		this.$refs.tree.setChecked(data.id == arr[0]?arr[1]:arr[0],false);
	        	}
	      	},
	      	//	获取树形菜单被选取的数据,不会清空树,用于传值
	      	justGetCheckedNodes: function(){
	      		var _this = this,
	      			data;
		        if(!this.$refs.tree.getCheckedKeys()){
		        	return false;
		        }else{
		        	data = {
		        		nodes: _this.getNodeFromList(_this.$refs.tree.getCheckedNodes()),
		        		keys: _this.arrTrim(_this.$refs.tree.getCheckedKeys())
		        	}
			        this.$emit("getCheckedCallback",data);
		        }
	      	},
		},
		watch: {
			defaultKey: function(){
				this.$refs.tree.setCheckedKeys([this.defaultKey]);
				this.justGetCheckedNodes();
			},

			//	树形菜单过滤搜索用
	      	filterText(val) {
	        	this.$refs.tree.filter(val);
	      	}
		},
		created: async function(){
			// let deviceVersion = sessionStorage.getItem('DEVICE_VERSION') || '',
			// 	res = await loading(AJAX.get("area-device?key="+deviceVersion));
			// if(!!res && res.key != deviceVersion){
			// 	res.result.id = -666;
			// 	sessionStorage.setItem("DEVICEID_LIST",JSON.stringify(res.result));
   //   			sessionStorage.setItem("DEVICE_VERSION",res.key);
			// 	this.treeDateTest = [this.treeFormat(res.result)];
			// }else{
			// 	this.treeDateTest = [this.treeFormat(JSON.parse(sessionStorage.getItem("DEVICEID_LIST")))];
			// }
		}
	}
</script>
<style lang="scss">
	//	默认的树形菜单
	.default-tree{
		&.level-up-1{
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 15;
			&.hidden{
				display: none;
			}
			input{
				border: none;
				border-bottom: 1px solid #f2f2f2;
				width: 400px;
				padding: 10px;
				outline: none;
				margin: 0 0 0 10px;
			}
			.el-icon-close{
				position: absolute;
				right: 10px;
				top: 10px;
				font-size: 18px;
				color: #888888;
				cursor: pointer;
				&:hover{
					transform: scale(1.2);
					font-weight: bold;
					color: red;
				}
			}
			.default-backmood{
				position: fixed;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				background: rgba(0,0,0,.5);
				z-index: 15;
			}
			.tree-case{
				position: fixed;
				z-index: 16;
				width: 560px;
				height: 420px;
				border-radius: 5px;
				background: #ffffff;
				box-shadow: 0 0 20px #323232;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				overflow: hidden;
				.buttons{
					width: 100%;
					position: absolute;
					bottom: 0;
					left: 0;
					padding: 5px 0 15px;
					text-align: center; 
				}
				.el-tree{
				    height: 320px;
	    			overflow-y: scroll;
				}
			}
		}
	}
</style>
