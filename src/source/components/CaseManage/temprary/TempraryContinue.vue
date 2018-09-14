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
				        type="daterange"
				        align="right"
				        unlink-panels
				        range-separator="至"
				        start-placeholder="开始日期"
				        end-placeholder="结束日期"
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
	import {backMood,caseHeader} from '../index/index.js'

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
			              picker.$emit('pick', [start, end]);
			            }
		          	}, {
		            	text: '一个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
			              picker.$emit('pick', [start, end]);
			            }
		          	}, {
			            text: '三个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
			              picker.$emit('pick', [start, end]);
			            }
		          	},{
			            text: '半年',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              end.setTime(start.getTime() + 3600 * 1000 * 24 * 180);
			              picker.$emit('pick', [start, end]);
			            }
		          	}]
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
				if(!!this.date[0] && !!this.date[1]){
	          		let res = await loading(AJAX.post("monitor/status",{
	          			monitorid: this.caseId,
	          			begintime: Date.parse(this.date[0])/1000,
	          			endtime: Date.parse(this.date[1])/1000,
	          			monitortime: (Date.parse(this.date[1])-Date.parse(this.date[0]))/1000/86400,
	          			status: '0'
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
	.case-wrapper{
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
			height: 360px;
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
				text-align: center;
				.control-center{
					margin: 50px 0 0;
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
					background: #1890ff;
				}
			}
		}
	}
</style>