<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content group-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item">
							<span><b>*</b>姓名：</span>
							<input type="text" v-model="username" placeholder="请输入" :maxlength="max.COMMON" />
							<error-tip :tip="tip.username"></error-tip>	
						</div>
						<div class="case-input-item">
							<span><b>*</b>身份证号码：</span>
							<input type="text" v-model="idcard" placeholder="请输入" :maxlength="max.COMMON" />
							<error-tip :tip="tip.idcard"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>警号：</span>
							<input type="text" v-model="policeId" placeholder="请输入" :maxlength="max.COMMON" />
							<error-tip :tip="tip.policeId"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>所在部门：</span>
							<el-select v-model="department" placeholder="请选择">
							    <el-option
							        v-for="item in options"
  							        :key="item.value"
  							        :label="item.label"
  							        :value="item.value">
							    </el-option>
						  	</el-select>
						</div>
						<div class="case-input-item">
							<span>手机号码：</span>
							<input type="text" v-model="phone" placeholder="请输入" :maxlength="max.PHONE" />
							<error-tip :tip="tip.phone"></error-tip>
						</div>
						<div class="case-input-item">
							<span>邮箱：</span>
							<input type="text" v-model="email" placeholder="请输入" :maxlength="max.EMAIL" />
							<error-tip :tip="tip.email"></error-tip>
						</div>
						<div class="case-input-item">
							<span><b>*</b>用户状态：</span>
							<div class="case-input-status">
								<el-radio v-model="status" label="1">启用</el-radio>
  								<el-radio v-model="status" label="2">禁用</el-radio>
							</div>
						</div>
						<div class="case-input-item">
							<span>备注：</span>
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
				title: '添加租户',
				addAjaxData: {},
		        max: MAX,
		        username: '',
				idcard: '',
				policeId: '',
				status: '1',
				phone: '',
				email: '',
				department: '',
		        remark: '',
		        tip: {},
		        options: [{
		            value: '选项1',
		            label: '黄金糕'
		        }, {
		            value: '选项2',
		            label: '双皮奶'
		        }, {
		            value: '选项3',
		            label: '蚵仔煎'
		        }, {
		            value: '选项4',
		            label: '龙须面'
		        }, {
		            value: '选项5',
		            label: '北京烤鸭'
		        }],
			}
		},
		methods: {
			reset: function(){
				this.name = '';
				this.remark = '';
			},
			add: async function(){
				if(!this.username){
					this.$message("请输入姓名！");
				}else if(!this.date){
					this.$message("请选择有效期限！");
				}else{
					var res = await loading(AJAX.post("group/add",{
						username: this.username,
						idcard: this.idcard,
						policeId: this.policeId,
						departmentId: this.department,
						phone: this.phone,
						email: this.email,
						status: this.status,
						remark: this.remark,
						id: this.data.id || ''
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
						this.title = '添加租户';
						this.reset();
					}else if(this.dataType === 'edit'){
						this.title = '编辑租户';
						let { name, stime, etime, remark, id } = this.data;
						this.name = name;
						this.date = [new Date(stime),new Date(etime)];
						this.remark = remark;
					}
				}
			},
			username: function(){
				if(!this.username){
					this.tip.username = "用户姓名不能为空！";
				}else if(!/^[\u4e00-\u9fa5a-zA-Z0-9_]{1,30}$/.test(this.username)){
					this.tip.username = "姓名由中英文、数字下划线组成，长度为1-30位！";
				}else{
					this.tip.username = '';
				}
			},
			idcard: function(){
				if(!this.idcard){
					this.tip.idcard = "身份证号码不能为空！";
				}else if(!/^[0-9]{15}[0-9A-Z]{3}?$/.test(this.idcard)){
					this.tip.idcard = "身份证号码由15位数字或者18位数字与大写字母组成！";
				}else{
					this.tip.idcard= '';
				}
			},
			policeId: function(){
				if(!this.policeId){
					this.tip.policeId = "警号不能为空！";
				}else if(!/^[\d]{1,10}?$/.test(this.policeId)){
					this.tip.policeId = "警号由1-10位数字构成！";
				}else{
					this.tip.policeId = '';
				}
			},
			phone: function(){
				if(!this.phone && !this.email){
					this.tip.phone = "手机号码与邮箱不能同时为空！";
				}else if(!/^[\d]{11}$/.test(this.phone)){
					this.tip.phone = "手机号码由11位数字组成！";
				}else{
					this.tip.phone = '';
				}
			},
			email: function(){
				if(!this.phone && !this.email){
					this.tip.email = "手机号码与邮箱不能同时为空！";
				}else if(!/^.*@.*\..*$/.test(this.email)){
					this.tip.email = "非法的邮箱格式！";
				}else{
					this.tip.email = '';
				}
			}
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
			&.group-content{
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
	}
</style>