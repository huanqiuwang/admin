<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content role-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item">
							<span><b>*</b>角色名称：</span>
							<input type="text" v-model="username" placeholder="请输入" :maxlength="max.COMMON" />
							<error-tip :tip="tip.username"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>描述说明：</span>
							<textarea v-model="remark" placeholder="请输入" :maxlength="max.REMARK"></textarea>
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
			'error-tip': tip
		},
		data () {
			return {
				animationClass: '',
				title: '添加角色',
				addAjaxData: {},
		        max: MAX,
		        username: '',
		        remark: '',
		        tip: {},
			}
		},
		methods: {
			reset: function(){
				this.username = '';
				this.mark = '';
			},
			add: async function(){
				if(!this.username){
					this.$message("请输入系统名称！");
				}else if(!this.mark){
					this.$message("请输入系统标识！");
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
						this.title = '添加角色';
						this.reset();
					}else if(this.dataType === 'edit'){
						this.title = '编辑角色';
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
			&.role-content{
				height: 450px;
				.case-info-body{
					height: 300px;
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