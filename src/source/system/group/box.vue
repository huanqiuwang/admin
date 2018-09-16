<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item">
							<span><b>*</b>组织名称：</span>
							<input type="text" v-model="name" placeholder="请输入" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>有效期：</span>
							<el-date-picker
						        v-model="time"
	  					        type="daterange"
	  					        align="right"
	  					        unlink-panels
	  					        range-separator="至"
	  					        start-placeholder="开始日期"
	  					        end-placeholder="结束日期"
	  					        :picker-options="pickerOptions2">
						    </el-date-picker>
						</div>
						<div class="case-input-item">
							<span>备注：</span>
							<textarea v-model="remark" placeholder="请输入" :maxlength="max.REMARK"></textarea>
						</div>
						<div class="btn-wrapper">
							<span class="btn active">添加</span>
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
	import {backMood,caseHeader,caseTypeSelect} from '../../components/common/TYbox/index.js'
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
			'case-type-select': caseTypeSelect
		},
		data () {
			return {
				animationClass: '',
				title: '添加组织',
				addAjaxData: {
		        	alias: '',
		        	caseTypeId: '',
		        	CaseLongitude: '',
		        	Caselatitude: '',
		        	address: '',
		        	description: ''
		        },
		        max: MAX,
		        time: '',
		        name: '',
		        remark: '',
		        pickerOptions2: {
	          	shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		      	}
			}
		},
		methods: {
			reset: function(){
				
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
						this.title = '添加组织';
						this.reset();
					}else if(this.dataType === 'edit'){
						this.title = '编辑组织';
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
		}
	}
</script>
<style lang="scss">
	@import "../../../assets/scss/modal.scss";

</style>