<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content repaire-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item">
							<span><b>*</b>部门名称：</span>
							<input type="text" v-model="username" placeholder="请输入" :maxlength="max.COMMON" />
							<error-tip :tip="tip.username"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>所属部门：</span>
							<input type="text" readonly="readonly" v-model="mark" @click="showTree" :maxlength="max.COMMON" />
						</div>
					</div>
				</div>
			</div>
			<div class="btn-wrapper">
				<span class="btn active" @click="add">添加</span>
				<span class="btn" @click="close">关闭</span>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>

		<depart-tree
			:defaultKey="defaultKey"
			:activeClass="treeActive"
			@closeTree="closeTree"
			@getCheckedCallback="getSelectNodes"></depart-tree>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import {backMood, caseHeader, caseTypeSelect, tip} from '../../components/common/TYbox/index.js'
	import departTree from '../../components/common/system/tree.vue'
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
			dataType: {
				type: String,
				required: false,
				default: 'add'
			}
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
			'case-type-select': caseTypeSelect,
			'error-tip': tip,
			'depart-tree': departTree
		},
		data () {
			return {
				treeActive: 'hidden',
				animationClass: '',
				title: '添加子部门',
				addAjaxData: {},
		        max: MAX,
		        username: '',
		        mark: '',
		        tip: {},
		        defaultKey: ''
			}
		},
		methods: {
			reset: function(){
				this.username = '';
				this.mark = '';
			},
			add: async function(){
				if(!this.username){
					this.$message("请输入部门名称！");
				}else{
					var res = await loading(AJAX.post("group/add",{
						username: this.username,
						mark: this.mark,
					}));
				 	this.$message({
			          	message: res.message || '操作成功！',
			          	type: 'success'
			        });
					this.reset();
					this.close(1);
				}
			},
			getSelectNodes: function(nodes){
				console.log(nodes);
				this.closeTree();
			},
			showTree: function(){
				this.treeActive = 'active';
			},
			closeTree: function(){
				this.treeActive = 'hidden';
			},
			close: function(e){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.$emit("closeHandle",e);
				},300);
			}
		},
		watch: {
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
					if(this.dataType === 'add'){
						this.title = '添加子部门';
						this.reset();
					}else if(this.dataType === 'edit'){
						this.title = '编辑子部门';
						let { username, mark, id } = this.data;
						this.username = username;
						this.mark = mark;
					}
				}
			},
			username: function(){
				if(!this.username || this.username.length > 30){
					this.tip.username = "必填项,支持中英文、数字、特殊字符,最长30字符！";
				}else{
					this.tip.username = '';
				}
			},
			mark: function(){
				if(!this.mark || this.mark.length > 30){
					this.tip.mark = "必填项,支持中英文、数字、特殊字符,最长30字符！";
				}else{
					this.tip.mark = '';
				}
			},
		},
		mounted: async function(){
			// let res = AJAX.get("getdepartment");
			// this.options = res.result;
		}
	}
</script>
<style lang="scss">
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
		.case-content{
			&.repaire-content{
				height: 350px;
				.case-info-body{
					height: 200px;
					.case-input-item{
						&>span:nth-child(1){
							height: 34px;
							line-height: 34px;
						}
						.ty-tip{
							padding: 8px 0 8px 300px;
						}
						.el-input__inner{
							height: 34px;
							width: 350px;
						}
						.case-input-status{
							padding: 10px 0 0;
						}
					}
				}
			}
		}
	}
</style>