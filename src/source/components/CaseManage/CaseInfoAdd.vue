<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-menu">
					<div v-for="(item,ind) in menulist" :class="item.active?'active':''" @click="changeTab(ind)">{{item.name}}</div>
				</div>
				<div class="case-info-mian">
					<div :class="menulist[0].active?'active':'hidden'">
						<p v-if="!!addAjaxData.rid"><span>编号：</span><span>{{addAjaxData.rid}}</span></p>
						<p>
							<span>案件类型：</span>
							<case-type-select
								:defaultData="addAjaxData.caseTypeId"
								@changeTypeHandle="refreshType"></case-type-select>
							<i class="warining-tip">(*必填项)</i>					
						</p>
						<p>
							<span>案件别名：</span>
							<input :maxlength="max.COMMON" type="text" placeholder="请输入" v-model="addAjaxData.alias" /><i class="warining-tip">(*必填项)</i>
						</p>
						<p>
							<span>案件地址：</span>
							<input :maxlength="max.COMMON" type="text" placeholder="请输入" v-model="addAjaxData.address" />
						</p>
						<p>
							<span>经纬度：</span>
							<input :maxlength="max.COMMON" type="text" placeholder="请用逗号分隔" v-model="addmap" />
						</p>
						<p>
							<span>案件说明：</span>
							<textarea :maxlength="max.REMARK" name="" v-model="addAjaxData.description" id="" cols="30" rows="10"></textarea>
						</p>
						<div class="btn-wrapper">
							<span v-if="dataType=='add'" class="btn active" @click="add">添加</span>
							<span v-if="dataType=='edit'" class="btn active" @click="edit">保存</span>
							<span class="btn" @click="close">关闭</span>
						</div>
					</div>
					<!-- <div :class="menulist[1].active?'active':'hidden'">
						<p><span>经纬度：</span><input type="text" placeholder="请用逗号分隔" v-model="testData.airInfo.lt" /></p>
						<p><span>基站信息：</span><input type="text" placeholder="请输入" v-model="testData.airInfo.website" /></p>
						<p><span>天气：</span><input type="text" placeholder="请输入" v-model="testData.airInfo.air" /></p>
						<p><span>热点信息：</span><input type="text" placeholder="请输入" v-model="testData.airInfo.info" /></p>
						<p><span>现场信息：</span><input type="text" placeholder="请输入" v-model="testData.airInfo.live" /></p>
						<p class="br"></p>
						<div class="btn-wrapper"><span class="btn active">添加</span><span class="btn" @click="close">关闭</span></div>
					</div> -->
				</div>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import {backMood,caseHeader,caseTypeSelect} from './index/index.js'
	import { MAX } from '../../../config/global.js'
	
	export default {
		props: {
			data: {
				type: String,
				required: false
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
			'case-type-select': caseTypeSelect
		},
		data () {
			return {
				addmap: '',
				animationClass: '',
				title: '案件添加',
				menulist: [
					{
						name: '基本信息',
						active: true
					}
					// ,{
					// 	name: '空中信息',
					// 	active: false
					// }
				],
				addAjaxData: {
		        	alias: '',
		        	caseTypeId: '',
		        	CaseLongitude: '',
		        	Caselatitude: '',
		        	address: '',
		        	description: ''
		        },
		        max: MAX
			}
		},
		methods: {
			reset: function(){
				this.addmap = '';
				this.addAjaxData = {
					alias: '',
		        	caseTypeId: '',
		        	CaseLongitude: '',
		        	Caselatitude: '',
		        	address: '',
		        	description: ''
				}
			},
			add: async function(){
				if(!this.addAjaxData.caseTypeId){
					this.$message("请选择案件类型！");
				}else if(!this.addAjaxData.alias){
					this.$message("请输入案件别名！");
				}else{
					var res = await loading(AJAX.post("case/add",this.addAjaxData));
				 	this.$message({
			          	message: '添加成功！',
			          	type: 'success'
			        });
					this.reset();
					this.close(1);
				}
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
			changeTab: function(ind){
				this.menulist.map((e,index) => {
					if(index !== ind){
						e.active = false;
					}else{
						e.active = true;
					}
				})
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
						this.title = '案件添加';
						this.reset();
					}else if(this.dataType === 'edit'){
						this.title = '案件编辑';
						let { ADDRESS, ALIAS, CAPTURETIME, CASELONGITUDE, CASELATITUDE, CASETYPEID, DESCRIPTION, RID} = JSON.parse(this.data);
						this.addAjaxData  = {
							alias: ALIAS,
							rid: RID,
				        	caseTypeId: CASETYPEID,
				        	CaseLongitude: CASELONGITUDE || '',
				        	Caselatitude: CASELATITUDE || '',
				        	address: ADDRESS || '',
				        	description: DESCRIPTION || ''
						}
						this.addmap = CASELONGITUDE?(CASELONGITUDE||'') + ',' + (CASELATITUDE||''):'';
					}
				}
			},
			//	经纬度信息
			addmap: function(){
				if(this.addmap.replace("，",',').split(',').length == 1){
					this.addAjaxData.CaseLongitude = this.addmap;
					this.addAjaxData.Caselatitude = '';
				}else{
					this.addAjaxData.CaseLongitude = this.addmap.replace("，",',').split(',')[0];
					this.addAjaxData.Caselatitude = this.addmap.replace("，",',').split(',')[1];
				}
			}
		}
	}
</script>
<style lang="scss">
	@import "../../../assets/scss/modal.scss";

	.br{
		height: 40px;
	}

	.case-wrapper{
		.case-content{
			width: 1018px;
			height: 520px;
			.case-info-body{
				overflow: hidden;
				height: 466px;
				.case-info-menu{
					background:#e6f7ff;
					width:200px;
					height: 100%;
					float: left;
					div{
						text-align: center;
						height: 60px;
						color: #666666;
						line-height: 60px;
						cursor: pointer;
						user-select: none;
						&.active{
							background:#1890ff;
							color: #ffffff;
						}
					}
				}
				.case-info-mian{
					width: 818px;
					float: left;
					p{
						font-size:14px;
						color:rgba(0,0,0,0.85);
						padding: 20px 0 0;
						overflow: hidden;
						&>span:nth-child(1){
							display: inline-block;
							width: 290px;
							padding-right: 10px;
							text-align: right;
							float: left;
							position: relative;
							top: 3px;
						}
						&>span:nth-child(2){
							display: inline-block;
							text-align: right;
							position: relative;
							top: 6px;
						}
						input{
							background: #ffffff;
							border: 1px solid rgba(0,0,0,0.15);
							border-radius: 4px;
							width: 216px;
							height: 30px;
							padding-left: 10px;
							float: left;
							position: relative;
							outline: none;
							color: rgba(0,0,0,.65);
							&::placeholder{
								color: rgba(0,0,0,.25);
							}
						}
						textarea{
							color: rgba(0,0,0,.65);
						    width: 420px;
    						height: 95px;
    						padding: 5px;
    						resize: none;
    						outline: none;
						}
						.el-input{
							overflow: hidden;
						}
						.hq-input{
							float: left;
						}
						i.warining-tip{
							color: red;
							margin: 0 0 0 10px;
						}
					}
					.btn-wrapper{
						text-align: center;
					}
					div>.btn{
						border: 1px solid #d2d2d2;
						color: #666666;
						display: inline-block;
						border-radius: 3px;
						text-align: center;
						cursor: pointer;
						margin: 10px;
						-webkit-user-select: none;
						user-select: none;
						&.active{
							color: white;
							background: #409EFF;
						}
					}
					div>p:nth-child(1){
						margin-top: 20px;
					}
				}
			}
		}
	}
</style>