<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content group-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item">
							<span><b>*</b>原始密码：</span>
							<input type="password" v-model="pass1" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>新密码：</span>
							<input type="password" v-model="pass2" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>再次输入密码：</span>
							<input type="password" v-model="pass3" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
					</div>
				</div>
			</div>
			<div class="btn-wrapper">
				<span class="btn active" @click="add">确定</span>
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
				title: '修改密码',
				addAjaxData: {},
		        max: MAX,
		        pass1: '',
		       	pass2: '',
		 		pass3: '',
			}
		},
		methods: {
			reset: function(){
				this.date = '';
				this.name = '';
				this.remark = '';
			},
			add: async function(){
				if(!this.name){
					this.$message("请输入组织名称！");
				}else if(!this.date){
					this.$message("请选择有效期限！");
				}else{
					var res = await loading(AJAX.post("group/add",{
						stime: Date.parse(this.date[0]),
						etime: Date.parse(this.date[1]),
						name: this.name,
						id: this.data.id,
						remark: this.remark
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
					this.reset();
				}
			},
		}
	}
</script>
<style lang="scss">
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
		text-align: left;
		.case-content{
			&.group-content{
				height: 450px;
				.case-info-body{
					overflow-y: auto;
					height: 300px;
				}
			}
		}
	}
</style>