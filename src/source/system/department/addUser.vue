<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item">
							<span><b>*</b>用户名：</span>
							<input type="text" v-model="username" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>身份证号码：</span>
							<input type="text" v-model="idcard" placeholder="请输入" :maxlength="max.IDCARD" />
							<error-tip v-if="!regs.idcard.test(idcard)" :tip="tips.idcard"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>警号：</span>
							<input type="text" v-model="policeid" placeholder="请输入" :maxlength="max.POLICEID" />
							<error-tip v-if="!regs.policeid.test(policeid)" :tip="tips.policeid"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>所属部门：</span>
							<input type="text" readonly="readonly" v-model="department" @click="showTree" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>IP地址：</span>
							<input type="text" v-model="iplist" placeholder="请输入" :maxlength="max.IP" />
							<error-tip v-if="!regs.iplist.test(iplist)" :tip="tips.iplist"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>手机号码：</span>
							<input type="text" v-model="phone" placeholder="请输入" :maxlength="max.PHONE" />
							<error-tip v-if="!regs.phone.test(phone)" :tip="tips.phone"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>邮箱：</span>
							<input type="text" v-model="email" placeholder="请输入" :maxlength="max.EMAIL" />
							<error-tip v-if="!regs.email.test(email)" :tip="tips.email"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>用户状态：</span>
							<div class="case-input-status">
								<el-radio v-model="status" label="1">启用</el-radio>
  								<el-radio v-model="status" label="2">禁用</el-radio>
							</div>
						</div>
						<div class="case-input-item">
							<span><b>*</b>备注：</span>
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
	import { MAX, TIPS, REGS } from '../../../config/global.js'
	
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
		        tips: TIPS,
		        regs: REGS,
		        username: '',
				idcard: '',
				policeid: '',
				iplist: '',
				phone: '',
				email: '',
				status: '1',
		        remark: '',
		        department: '',
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
			.case-info-body{
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
</style>