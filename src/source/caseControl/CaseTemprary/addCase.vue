<template>
	<!-- 添加布控 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="bk-item">
					<span>目标名称：<label class="el-icon-info"></label></span>
					<input type="text" v-model="caseCheck" />
					<i v-if="!isvalid">(*必填项)</i>
					<span v-if="!!isvalid" class="el-icon-success"></span>
				</div>
				<div class="bk-item">
					<span>布控设备：</span>
					<input type="text" readonly="readonly" class="place" placeholder="点击选择布控设备" @click="showTree" v-model="list.place" />
					<i>(*必填项)</i>
					<!-- 设备选择组件 -->
					<device-tree
						:defaultKey="defaultData.devices"
						:activeClass="treeActiveClass"
			            @closeTree="treeClose"
			            @getCheckedCallback="getNodes"></device-tree>
				</div>


				<div class="bk-item">
					<span>选择布控类型：</span>
					<case-dest-select
						:defaultData="defaultData.list"
						@refreshHandle="refreshList"></case-dest-select>
					<i>(*必填项)</i>
				</div>

				<div class="bk-item">
					<span>时间范围：</span>
					<!-- 时间选择插件 -->
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
				    <i>(*必填项)</i>
				</div>

				<div class="bk-item bk-select">
					<span>设定处警人：</span>
					<!-- 选择系统处警人插件 -->
					<input-select
						class="control-datalist"
						:defaultData='defaultData.policeIn'
						@selected="selectedSys"></input-select>
					<i>(*必填项)</i>
				</div>
				<div class="bk-item bk-overset">
					<span class="opacity">的：</span>
					<label class="btn active" @click="showPolice">添加非系统用户<em v-if="extraUser.length != 0">{{extraUser.length}}</em></label>
				</div>
			</div>
			<div class="btn-wrapper">
				<span v-if="type == 'add'" class="btn active" @click="sub">添加</span>
				<span v-if="type == 'edit'" class="btn active" @click="edit">提交</span>
				<span class="btn" @click="close">取消</span>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>

		<police-list
			:activeClass="policeActiveClass"
			@closeHandle="closePolice"
			@refreshHandle="policeRefresh"
			:data="extraUser"></police-list>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import {backMood,caseHeader,pictureUpload,inputSelect} from '../../components/CaseManage/index/index.js'
	import { caseDestSelect } from '../../components/CaseManage/temprary/index.js'
	import deviceTree from '../../components/common/tree.vue'
	import PoliceList from '../../components/CaseManage/Police.vue'

	function getInitDate(){
    	let now = new Date(),
    		last = new Date();
    		last.setTime(Date.parse(now) + 30 * 24 * 60 * 60 * 1000); 
    	return [now,last];
    }

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
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
			'picture-upload': pictureUpload,
			'device-tree': deviceTree,
			'input-select': inputSelect,
			'case-dest-select': caseDestSelect,
			'police-list': PoliceList
		},
		data () {
			return {
				policeActiveClass: 'hidden',
				defaultData: {
					devices: []
				},
				title: '创建布控',
				sysUser: [],
				extraUser: [],

				animationClass: '',
				treeActiveClass: 'hidden',
				list: {
					place: '',			//	页面显示的设备地点组合		-- array
					deviceId: '',		//	页面保存的设备地点的id组合  -- array
				},
				destType: '1',
				imgList: [],
				caseCheck: '',
				isvalid: false,
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
		        date: getInitDate(),
		        circle: 30,
			}
		},
		methods: {
			reset: function(){
				this.list = {
					place: '',
					deviceId: '',
				}
				this.caseCheck = '';
				this.imgList = [];
				this.sysUser.splice(0,this.sysUser.length);
				this.date = '';
				this.defaultData = {
					devices: [],
					list: '',
					policeIn: [],
					policeList: ''
				}
				this.extraUser = []
			},
			//	提交添加的表单
			sub: async function(){
				if(!this.caseCheck){
					this.$message({
						message: '目标名称不能为空！',
						type: 'waining'
					});
					return false;
				}else if(!this.isvalid){
					this.$message({
						message: '目标名称已存在！',
						type: 'waining'
					});
					return false;
				}else if(!this.list.deviceId.length){
					this.$message({
						message: '请选择布控设备！',
						type: 'waining'
					});
					return false;
				}else if(!this.imgList.length){
					this.$message({
						message: '请填写选择的布控类型！',
						type: 'waining'
					});
					return false;
				}else if(!this.date || !this.date[0] || !this.date[1]){
					this.$message({
						message: '请选择布控时间！',
						type: 'waining'
					});
					return false;
				}else if(!this.extraUser.length && !this.sysUser.length){
					this.$message({
						message: '请选择处警人！',
						type: 'waining'
					});
					return false;
				}

				let res = await loading(AJAX.post("monitor/add",
					{
						monitorstr: JSON.stringify({
							monitorname: this.caseCheck,
							devices: this.list.deviceId.join(","),
							monitortype: this.destType,
							monitorvalue: this.destType != 4?this.imgList:'',
							inPolice: this.sysUser.join(","),										//	系统处警人
							outPolice: this.extraUser.join(','),												//	非系统处警人
							begintime: Date.parse(new Date(this.date[0]))/1000 || '',
							endtime: Date.parse(new Date(this.date[1]))/1000 || '',
							monitortime: this.circle,
							faceList: this.destType == 4?this.imgList:[]
						})
					},
				));
				this.$message({
					type: 'success',
					message: res.message
				})
				this.close(1)
			},

			edit: async function(){
				if(!this.caseCheck){
					this.$message({
						message: '目标名称不能为空！',
						type: 'waining'
					});
					return false;
				}else if(!this.list.deviceId.length){
					this.$message({
						message: '请选择布控设备！',
						type: 'waining'
					});
					return false;
				}else if(!this.date || !this.date[0] || !this.date[1]){
					this.$message({
						message: '请选择布控时间！',
						type: 'waining'
					});
					return false;
				}

				let res = await loading(AJAX.post("monitor/editor",{
					monitorstr: JSON.stringify({
						mid: this.caseId,
						monitorname: this.caseCheck,
						devices: this.list.deviceId.join(","),
						monitortype: this.destType,
						monitorvalue: this.destType != 4?this.imgList:'',
						inPolice: this.sysUser.join(","),										//	系统处警人
						outPolice: this.extraUser.join(','),												//	非系统处警人
						begintime: Date.parse(new Date(this.date[0]))/1000 || '',
						endtime: Date.parse(new Date(this.date[1]))/1000 || '',
						monitortime: this.circle,
						faceList: this.destType == 4?this.imgList:[]
					})
				}));
				this.$message({
					type: 'success',
					message: res.message
				})
				this.close(1)
			},

			//	系统处警人格式组装
			selectedSys: function(e){
				var arr = [];
				e.map((item,index) => arr.push(item.uuid));
				this.sysUser = arr;
			},
			
			close: function(e){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.reset();
					_this.$emit("closeHandle",e);
				},300);
			},
			refreshList: function({type, data}){
				this.destType = type;
				this.imgList = data;
			},
			showPolice: function(){
            	this.policeActiveClass = 'active';
            },
            closePolice: function(){
            	this.policeActiveClass = 'hidden';
            },
            policeRefresh: function(e){
            	this.extraUser = e;
            },

			// 获取树形菜单被选取的数据
            getNodes(e) {
                this.list.place = e.nodes;
                this.list.deviceId = e.keys;
                this.treeClose();
            },
            showTree: function(){
                this.treeActiveClass = '';
            },
            treeClose: function(){
                this.treeActiveClass = 'hidden';
            },


		},
		watch: {
			//	显示控制，触发显示的时候同时检查窗口用途
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
					if(this.type === 'edit'){
						let { monitorname, devices, monitortype, monitorvalue, faceList, begintime, endtime, inPolice, outPolice } = JSON.parse(this.data);
						let arr = [],
							policeIn = [];
						if(inPolice){
							arr = inPolice.split(',');
							for(let n = 0;n<arr.length; n++){
								policeIn.push({
									uuid: arr[n],
									name: ''
								});
							}
						}
						this.caseCheck = monitorname;

						this.defaultData.list = {
							type: monitortype,
							data: monitorvalue || [{id: faceList[0].fid,url: faceList[0].url}]
						};
						this.defaultData.devices = devices.split(',') || [];
						this.defaultData.policeIn = policeIn;
						this.extraUser = outPolice?outPolice.split(','):[];
						
						this.date = [new Date(begintime*1000),new Date(endtime*1000)];
						this.title = "编辑布控";
					}else{
						this.title = "创建布控";
						this.reset();
					}
				}
			},
			// 布控名后台校验
			caseCheck: async function(){
				this.caseCheck = this.trimAll(this.caseCheck);
				if(!this.caseCheck){
					this.isvalid = ''; 
					return false;
				}else{
					let { message } = await AJAX.post("monitor/checkname/"+this.caseCheck);
					if(message == '布控名称可用'){
						this.isvalid = true;
					}else{
						this.isvalid = false;
					}
				}
			},
			date: function(){
				if(!!this.date){
					this.begintime = Date.parse(this.date[0])/1000;
					this.endtime = Date.parse(this.date[1])/1000;
					this.circle = (Date.parse(this.date[1])/1000 - Date.parse(this.date[0])/1000)/86400;
				}else{
					this.begintime = '';
					this.endtime = '';
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
		.case-content{
			width: 1018px;
			height: 80vh;
			.case-info-body{
				.bk-item{
					overflow: hidden;
					padding: 30px 0 0;
					color:rgba(0,0,0,0.85);
					font-size: 14px;
				    float: left;
				    line-height: 32px;
				    &.bk-overset{
				    	width: 500px;
				    	overflow: hidden;
				    	padding-left: 6px;
				    }
					&>span:nth-child(1){
						width: 200px;
						display: inline-block;
						text-align: right;
						float: left;
						white-space: pre;
						&.opacity{
							opacity: 0;
						}
						.el-icon-info{
							color: #888888;
						}
					}
					label{
						position: relative;
						margin: 0px 20px 10px 5px;
						em{
							position: absolute;
						    right: -12px;
						    top: -12px;
						    width: 24px;
						    height: 24px;
						    border-radius: 50%;
						    background: #ff4141;
						    color: white;
						    line-height: 24px;
						    text-align: center;
						    transform: scale(.7);
						}
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