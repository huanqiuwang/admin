<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content group-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item">
							<span><b>*</b>组织名称：</span>
							<input type="text" v-model="name" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>有效期：</span>
							<el-date-picker
						        v-model="date"
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
				title: '添加组织',
				addAjaxData: {
		        
		        },
		        max: MAX,
		        date: '',
		        name: '',
		        remark: '',
		        pickerOptions2: {
	          	shortcuts: [{
		            text: '最近一年',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近两年',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 2);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近五年',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              end.setTime(start.getTime() + 3600 * 1000 * 24 * 365 * 5);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		      	}
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
					this.animationClass = '';
					if(!this.data.id){
						this.title = '添加组织';
						this.reset();
					}else if(!!this.data.id){
						this.title = '编辑组织';
						let { name, startTime, endTime, remark, id } = this.data;
						this.name = name;
						this.date = [new Date(startTime),new Date(endTime)];
						this.remark = remark;
					}
				}
			},
		}
	}
</script>
<style lang="scss">
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
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