<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content sys-member-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
				    <el-transfer
				      	style="text-align: left; display: inline-block"
				      	v-model="value3"
				      	filterable
				      	:left-default-checked="[2, 3]"
				      	:right-default-checked="[1]"
				      	:render-content="renderFunc"
				      	:titles="['用户列表', '组成员列表']"
				      	:button-texts="['移除', '添加']"
				      	:format="{
				        	noChecked: '${total}',
				        	hasChecked: '${checked}/${total}'
				      	}"
				     	 @change="handleChange"
				      	:data="data">
				    </el-transfer>
				</div>
			</div>
			<div class="btn-wrapper">
				<span class="btn active" @click="add">保存</span>
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
	
	const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          	data.push({
            	key: i,
            	label: `备选项 ${ i }`,
            	disabled: i % 4 === 0,
            	status: 1
          	});
        }
        return data;
  	};

	export default {
		props: {
			defaultData: {
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
				title: '成员设置',
				addAjaxData: {},
		        max: MAX,
		        username: '',
		        remark: '',
		        tip: {},
		        data: generateData(),
		        value3: [1],
		        value4: [1],
		        renderFunc(h, option) {
		          	return <p><span>{option.key}</span><span>{option.label}</span><span>{option.status=="0"?"禁止":"启用"}</span></p>;
		        }
			}
		},
		methods: {
			reset: function(){
				this.username = '';
				this.mark = '';
			},
			add: async function(){
				this.reset();
				this.close(1);
			},
			close: function(e){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.$emit("closeHandle",e);
				},300);
			},
		 	handleChange(value, direction, movedKeys) {
		        console.log(value, direction, movedKeys);
	      	}
		},
		watch: {
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
					this.title = '添加角色';
					this.reset();
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
			height: 650px;
			&.sys-member-content{
				.case-info-body{
					height: 510px;
					text-align: center;
					.el-transfer{
						margin: 20px 0 0;
						.el-transfer-panel{
							width: 350px;
						    height: 470px;
						    .el-transfer-panel__body{
					    	    height: 413px;
					    	    .el-transfer-panel__filter{
				    	    	    margin: 5px 10px;
					    	    }
					    	    .el-checkbox-group{
					    	    	height: 375px;
									.el-transfer-panel__item{
										&:nth-child(2n+1){
											background: #f2f2f2;
										}
										&.is-disabled{
											p{
												&>span:nth-child(1){
													color: #c0c4cc!important;
												}
											}
										}
										p{
											span{
												display: inline-block;
												overflow: hidden;
												white-space: pre;
												text-overflow: ellipsis;
											}
											&>span:nth-child(1){
												color: #1890ff;
												width: 80px;
											}
											&>span:nth-child(2){
												width: 160px;
											}
											&>span:nth-child(3){
												width: 50px;
											}
										}
									}
					    	    }
						    }
						}
					}
				}
			}
		}
	}
</style>