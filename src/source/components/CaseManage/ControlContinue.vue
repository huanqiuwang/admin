<template>
	<!-- 添加布控 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="control-center">
					<span>时间范围：</span>
					<el-date-picker
				      v-model="date"
				      type="datetime"
				      placeholder="选择日期时间"
				      align="right"
				      :picker-options="pickerOptions2"
				      class="default-datetime-select">
				    </el-date-picker>
				</div>
			</div>
			<div class="btn-wrapper">
				<span class="btn active" @click="sub">继续布控</span>
				<span class="btn" @click="close">取消</span>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>
	</div>
</template>
<script>
	import { MessageBox } from 'element-ui'
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import {backMood,caseHeader} from './index/index.js'

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
		},
		data () {
			return {
				title: '批量继续布控',
				animationClass: '',
				date: ['',''],
				pickerOptions2: {
		          	shortcuts: [{
			            text: '半个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              end.setTime(start.getTime() + 3600 * 1000 * 24 * 15);
			              picker.$emit('pick', end);
			            }
		          	}, {
		            	text: '一个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
			              picker.$emit('pick', end);
			            }
		          	}, {
			            text: '三个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
			              picker.$emit('pick', end);
			            }
		          	},{
			            text: '半年',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              end.setTime(start.getTime() + 3600 * 1000 * 24 * 180);
			              picker.$emit('pick', end);
			            }
		          	}],
		          	disabledDate: function(dat){
		          		let now = Date.parse(new Date()); 
		          		if( Date.parse(dat) > now ){
		          			return false
		          		}else{
		          			return true
		          		}
		          	}
		        },
			}
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
		},
		methods: {
			close: function(){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.$emit("closeHandle");
				},300);
			},

			//	继续布控提交
			sub: async function(){
				var _this = this;
				if(!!this.date){
	          		let res = await loading(AJAX.post("caseTarget/continueTarget",{
	          			list: this.caseId,
	          			start: '',
	          			end: Date.parse(this.date),
	          			userId: sessionStorage.getItem("username")
	          		}));
	          		_this.$message({
	          			message: "续控成功！",
	          			type: 'success'
	          		})
	          		this.close();
				}else{
					this.$message({
						type: 'warning',
						message: '请选择布控时间段！'
					})
				}
			},
		},
		watch: {

			//	显示控制，触发显示的时候同时检查窗口用图
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
		.case-content{
			width: 1018px;
			height: 360px;
			.case-info-body{
				height: calc(100% - 120px);
				overflow-y: auto;
				text-align: center;
				.control-center{
					margin: 50px 0 0;
				}
			}
		}
	}
</style>