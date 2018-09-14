<template>
	<!-- 添加底库 -->
	<div class="base-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="bk-item">
					<span>姓名：</span>
					<input type="text" v-model="caseCheck" />
				</div>
				<div class="bk-item">
					<span>性别：</span>
			 		<el-select v-model="value" placeholder="请选择">
					    <el-option
					        v-for="item in options"
					        :key="item.value"
					        :label="item.label"
					        :value="item.value">
					    </el-option>
				  	</el-select>
				</div>
				<div class="bk-item">
					<span>身份证号：</span>
					<input type="text" v-model="identify" />
				</div>
				<div class="bk-item">
					<span>年龄：</span>
					<input type="text" v-model="age" />
				</div>
				<div class="bk-item">
					<span>名族：</span>
					<el-select v-model="nation" placeholder="请选择">
					    <el-option
					        v-for="item in national"
					        :key="item.value"
					        :label="item.label"
					        :value="item.value">
					    </el-option>
				  	</el-select>
				</div>
				
				<div class="bk-item">
					<span>标签：</span>
					<el-checkbox-group v-model="checkList">
					    <el-checkbox label="全部"></el-checkbox>
					    <el-checkbox label="在逃"></el-checkbox>
					    <el-checkbox label="涉隐"></el-checkbox>
					    <el-checkbox label="涉毒" disabled></el-checkbox>
					    <el-checkbox label="涉恐" disabled></el-checkbox>
				  	</el-checkbox-group>
				</div>
				<div class="bk-item">
					<span>备注：</span>
					<textarea maxlength="250" v-model="remark"></textarea>>
				</div>
			</div>
			<div class="btn-wrapper">
				<span v-if="type == 'add'" class="btn active" @click="sub">添加</span>
				<span v-if="type == 'edit'" class="btn active" @click="edit">提交</span>
				<span class="btn" @click="close">取消</span>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import {backMood,caseHeader,pictureUpload,inputSearchTip} from '../../components/CaseManage/index/index.js'
	import { tableEdit } from '../../components/CaseManage/temprary/index.js'

	export default {
		props: {
			activeClass: {
				type: String,
				required: true
			},
			caseId: {
				required: true
			},
			data: {
				type: String,
				required: false
			},
			type: {
				type: String,
				required: false,
				default: 'add'
			},
			targetId: {
				type: String,
				required: false
			}
		},
		data () {
			return {
				defaultData: {
					device: []
				},
				title: '创建布控',
				sysUser: [],
				options: [{
          			value: '1',
		          	label: '男'
		        }, {
		          	value: '2',
		          	label: '女'
		        }],
		        value: '',
		        identify: '',
				age: '',
				nation: '',
				national: [],
				checkList: [],
				remark: '',

				animationClass: '',
				caseCheck: '',
		        circle: 30,
			}
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
			'picture-upload': pictureUpload,
			'input-search-tip': inputSearchTip,
			'table-edit': tableEdit,
		},
		methods: {
			reset: function(){
				this.caseCheck = '';
				this.sysUser.splice(0,this.sysUser.length);
			},
			//	提交添加的表单
			sub: async function(){
				if(!this.caseCheck){
					this.$message({
						message: '布控名称不能为空！',
						type: 'waining'
					});
					return false;
				}
				let res = await loading(AJAX.post("monitor/add",{
					
				}));
				if(res.code == 200){
					this.close(1);
				}
			},

			edit: async function(){
				if(!this.caseCheck){
					this.$message({
						message: '布控名称不能为空！',
						type: 'waining'
					});
					return false;
				}

				let res = await loading(AJAX.post("caseTarget/updateTarget",{
				}));
				if(res.code == 200){
					this.close(1);
				}
			},
			close: function(e){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.reset();
					_this.$emit("closeHandle",e);
				},300);
			},
		},
		watch: {
			//	显示控制，触发显示的时候同时检查窗口用途
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
					if(this.type === 'edit'){
						let {targetName, device, img, start, end, policeIn, policeOut} = JSON.parse(this.data);
						this.caseCheck = targetName;

						this.title = "编辑布控";
					}else{
						this.title = "创建布控";
					}
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.base-wrapper{
		//	动画样式
		&.hidden{
			display: none;
		}
		&.mov-top{
			.case-content{
				transform: translateY(100px);
			}
		}
		&.active{
			.case-content{
				animation: movBottom .4s ease;
			}
		}
		@keyframes movBottom {
			0%{
				transform: translateY(-100px);
				filter: opacity(.3);
			}
			100%{
				transform: translateY(0px);
				filter: opacity(1);
			}
		}
		.case-content{
			width: 1018px;
			height: 80vh;
			position: fixed;
			z-index: 10;
			margin: auto;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: #fff;
			transform: translateY(0px);
			transition: transform .3s ease;
			.case-info-body{
				height: calc(100% - 120px);
				overflow-y: auto;
				.bk-item{
					overflow: hidden;
					padding: 30px 0 0;
					color:rgba(0,0,0,0.85);
					font-size: 14px;
				    float: left;
				    line-height: 32px;
					&>span:nth-child(1){
						width: 200px;
						display: inline-block;
						text-align: right;
						float: left;
						white-space: pre;
					}
					.case-dest-warpper{
						width: 440px;
						display: inline-block;
						float: left;
					}
					input{
						padding-left: 6px;
						width: 426px;
						height: 32px;
						border: 1px solid #dedede;
						border-radius: 3px;
						margin: 0 5px;
						outline: none;
						&.place{
							width: 402px;
						    padding-left: 30px;
						    background: url("../../../assets/img/location.png") no-repeat left center, #fff;
						    background-position: 7px 8px;
						}
						&::placeholder{
							color: rgba(0,0,0,0.25);
						}
					}
					i{
						color: red;
					}
					.el-icon-success{
						position:  relative;
						top: 3px;
						color: #45e045;
    					font-size: 24px;
					}
					p{
						display: inline-block;
						float: left;
						color: #888888;
					}

					//	调用插件的额外样式
					.control-datalist{
						float: left;
						width: 438px;
					}
					&.bk-select{
						min-height: 50px;
						overflow: visible;
					}
				}
			}
			.btn-wrapper{
				text-align: center;
				.btn{
					border: 1px solid #d2d2d2;
					color: #666666;
					padding: 5px 15px;
					display: inline-block;
					border-radius: 3px;
					text-align: center;
					cursor: pointer;
					margin: 10px;
					-webkit-user-select: none;
					user-select: none;
					&.active{
						color: white;
						background: #1890ff;
					}
				}
			}
		}
		.control-table{
			padding: 0px!important;
			width: calc(100% - 220px);
			float: right;
			padding: 5px 0;
			margin: 10px 20px 50px 0;
			border-top: 1px solid #dedede;
			border-left: 1px solid #dedede;
			tr{
				th{
					height: 32px;
					line-height: 32px;
					padding: 0;
					border-bottom: 1px solid #dedede;
					border-right: 1px solid #dedede;
				}
				td{
					height: 32px;
					line-height: 32px;
					padding: 0;
					border-bottom: 1px solid #dedede;
					border-right: 1px solid #dedede;
					input{
						width: 100%!important;
						height: 100%!important;
						padding: 0!important;
						margin: 0!important;
						text-align: center;
						border: none!important;
					}
					&:nth-child(1){
						width: 150px;
					}
					&:nth-child(2){
						width: 150px;
					}
					&:nth-child(3){
						width: 120px;
					}
					&:nth-child(4){
						width: 150px;
					}
					&:nth-child(5){
						width: 120px;
					}
					span{
						label{
							padding: 4px 10px;
							background: #1890ff;
							border-radius: 5px;
							margin: 0 0 0 7px;
							cursor: pointer;
							color: #ffffff;
							&.btn-table-warning{
								background: #f56c6c;
							}
							&:active{
								box-shadow: 0 2px 4px #d2d2d2;
								opacity: .8;
							}
						}
					}
				}
			}
		}
	}

	.default-datetime-select.el-date-editor{
		height: 34px;
		margin-left: 6px;
		span{
			position: relative;
			top: -3px;
		}
		i{
			position: relative;
			top: -3px;
		}
	}
</style>