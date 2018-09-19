<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="jur-left-menu">
					<div class="jur-menu-item" v-for="(item,index) in testData" :class="item.activeClass" @click="changeActive(index)">
						{{ item.name }}
					</div>
				</div>
				<div class="jur-right-tree">
					<div class="jur-tree-item" v-for="(item,index) in testData" v-show="item.activeClass == 'active'">
						<div class="jur-tree-wrap" v-if="item.activeClass == 'active'">
							<el-tree
								class="filter-tree"
								:data="item.menu"
								show-checkbox
								node-key="id"
								ref="tree"
								:default-expanded-keys="item.checked || []"
								highlight-current
								check-on-click-node
								:props="defaultProps">
							</el-tree>
						</div>
						<div class="btn-wrapper">
							<span class="btn active" @click="getCheckedNodes">添加</span>
							<span class="btn" @click="close">关闭</span>
						</div>
					</div>
				</div>					
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import {backMood, caseHeader, caseTypeSelect, tip} from '../../components/common/TYbox/index.js'
	import { MAX } from '../../../config/global.js'
	
	export default {
		props: {
			data: {
				type: Object,
				required: false,
				default: e => {}
			},
			activeClass: {
				type: String,
				required: true
			},
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
			'case-type-select': caseTypeSelect,
			'error-tip': tip
		},
		data () {
			return {
				animationClass: '',
				title: '权限设置',
				ajaxData: {
		        	
		        },
		        defaultProps: {
		          	children: 'children',
		          	label: 'name'
		        },
		        testData: [
		        	{
		        		id: '1',
		        		name: '目录一',
		        		activeClass: 'active',
		        		menu: [{
		        			id: '123',
		        			name: "菜单1",
		        			children: [
		        				{
		        					id: 'asda4d',
		        					name: '二级菜单1'
		        				},{
		        					id: 'asdasd',
		        					name: '二级菜单2'
		        				}
		        			]
		        		},{
		        			id: '112323',
		        			name: "菜单1",
		        			children: [
		        				{
		        					id: 'asd12asd',
		        					name: '二级菜单3'
		        				},{
		        					id: 'asd24342asd',
		        					name: '二级菜单4'
		        				}
		        			]
		        		}]
		        	},{
		        		id: '48',
		        		name: '目录二',
		        		menu: [{
		        			id: '2123',
		        			name: "菜单1",
		        			children: [
		        				{
		        					id: '2asdasd',
		        					name: '二级菜单5'
		        				},{
		        					id: '2asda4sd',
		        					name: '二级菜单6'
		        				}
		        			]
		        		},{
		        			id: '112323',
		        			name: "菜单1",
		        			children: [
		        				{
		        					id: '2asd12asd',
		        					name: '二级菜单7'
		        				},{
		        					id: '2asd24342asd',
		        					name: '二级菜单8'
		        				}
		        			]
		        		}]
		        	}
		        ]
			}
		},
		methods: {
			reset: function(){
				
			},
			edit: async function(){
				var res = await loading(AJAX.post("case/update",this.addAjaxData));
				this.$message({
		          	message: '修改成功！',
		          	type: 'success'
		        });
				this.reset();
				this.close(1);
			},
			refreshType: function(e){
				this.addAjaxData.caseTypeId = e.key;
			},
			close: function(e){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.$emit("closeHandle",e);
				},300);
			},
			changeActive: function(index){
				this.testData.map((e,i) => {
					if(i != index){
						e.activeClass = ''
					}else{
						e.activeClass = 'active'
					}
				})
				this.$set(this.testData, index, this.testData[index]);
			},

			//	过滤搜索
			filterNode(value, data) {
		        if (!value) return true;
		        return data.name.indexOf(value) !== -1;
	      	},

	      	// 获取树形菜单被选取的数据,点击确认的时候触发
	      	getCheckedNodes() {
	      		let maxlength = this.testData.length,
	      			checkedNodes = [];
	      			this.$refs.tree.map(e => {
	      				console.log(e.getCheckedKeys());
	      				checkedNodes.push(e.getCheckedKeys());
	      			})
	      			console.log('结果：',checkedNodes);
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
	      	treeFormat: function(tree){
			    var i = 0,_this = this;
			    if(!!tree.device && tree.device.length!=0){          //  存在device
			        for(i = 0;i < tree.device.length; i++){
			            tree.child.push(tree.device[i]);
			            _this.allNotesId.push(tree.device[i].id);
			        }
			        delete tree.device
			    }
			    if(!!tree.child && tree.child.length!=0){
			        tree.children = [];
			        for(i = 0;i < tree.child.length; i++){
			            tree.children[i] = _this.treeFormat(tree.child[i]);
			        }
			        delete tree.child
			    }
			    return tree;
	      	}
		},
		watch: {
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
		.case-content{
			height: 550px;
			.case-info-body{
				overflow-y: auto;
				height: 496px;
				.jur-left-menu{
				    width: 300px;
				    float: left;
				    height: 100%;
				    border-right: 1px solid #d2d2d2;
				    .jur-menu-item{
				    	padding: 15px 0 15px 30px;
				    	color: #666666;
				    	cursor: pointer;
				    	&.active{
				    		border-right: 2px solid #1890ff;
				    		background: #e6f7ff;
				    	}
				    }
				}
				.jur-right-tree{
					width: calc(100% - 332px);
					height: calc(100% - 30px);
					float: right;
					padding: 30px 0 0 30px;
					.jur-tree-item{
					    height: calc(100% - 5px);
						.jur-tree-wrap{
							height: calc(100% - 60px);
							overflow-y: auto;
						}
					}
				}
			}
		}
	}
</style>