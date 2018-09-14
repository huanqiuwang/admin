<template>
	<!-- 添加布控 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="bk-item">
					<span>布控名：<label class="el-icon-info"></label></span>
					<input type="text" v-model="caseCheck" />
					<i v-if="!isvalid">(*必填项)</i>
					<span v-if="!!isvalid" class="el-icon-success"></span>
				</div>
				<div class="bk-item">
					<span>布控设备：</span>
					<input type="text" readonly="readonly" class="place" placeholder="点击选择布控设备" @click="showTree" v-model="list.place" />
					<!-- 设备选择组件 -->
					<device-tree
						:defaultKey="defaultData.device"
						:activeClass="treeActiveClass"
			            @closeTree="treeClose"
			            @getCheckedCallback="getNodes"></device-tree>
				</div>

				<div class="bk-item">
					<span>监控周期：</span>
					<input type="text" readonly="readonly" placeholder="请输入监控周期" @click="showTree" v-model="time" />
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
				</div>
				<div class="bk-item bk-overset">
					<span class="opacity">的：</span>
					<label class="btn active" @click="showPolice">添加非系统用户<em v-if="extraUser.length != 0">{{extraUser.length}}</em></label>
				</div>

				<div class="bk-item">
					<span>预警个数：</span>
					<input type="text"  placeholder="请输入预警数"  v-model="number" />
					<i>(*必填项)</i>
				</div>

				<div class="bk-item">
					<span>设置归属地：</span>
					<city-select
						:defaultData="defaultData.placeList"
						class="case-right-city"
						@refreshData="getOwerPlace"></city-select>
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
	import {backMood,caseHeader,pictureUpload,inputSelect,inputSearchTip} from '../../components/CaseManage/index/index.js'
	import { ownership } from '../../components/CaseManage/Ownership/index.js'
	import { PoliceList } from '../../components/CaseManage/index.js'
	import deviceTree from '../../components/common/tree.vue'

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
		data () {
			return {
				policeActiveClass: 'hidden',
				defaultData: {
					device: []
				},
				title: '创建布控',
				sysUser: [],
				extraUser: [],
				placeList: [],
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

				animationClass: '',
				treeActiveClass: 'hidden',
				list: {
					place: '',			//	页面显示的设备地点组合		-- array
					deviceId: '',		//	页面保存的设备地点的id组合  -- array
				},
				time: '60',
				number: '',
				caseCheck: '',
				isvalid: false
			}
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
			'device-tree': deviceTree,
			'input-select': inputSelect,
			'city-select': ownership,
			'police-list': PoliceList
		},
		methods: {
			reset: function(){
				this.list = {
					place: '',
					deviceId: '',
				}
				this.defaultData = {
					placeList: '',
					policeIn: '',
					device: [],
				}
				this.extraUser = [];
				this.number = '';
				this.time = 60;
				this.caseCheck = '';
				this.sysUser.splice(0,this.sysUser.length);
			},

			checkData: async function(){
				if(!this.caseCheck){
					this.$message({
						message: '布控名称不能为空！',
						type: 'waining'
					});
					return Promise.reject("布控名称不能为空！");
				}else if(!this.time){
					this.$message({
						message: '请填写布控周期！',
						type: 'waining'
					});
					return Promise.reject("请填写布控周期！");
				}else if(!this.date){
					this.$message({
						message: '请填选择布控的时间范围！',
						type: 'waining'
					});
					return Promise.reject("请填选择布控的时间范围！");
				}else if(!this.sysUser.length){
					this.$message({
						message: '请选择处警人！',
						type: 'waining'
					});
					return Promise.reject("请选择处警人！");
				}else if(!this.number){
					this.$message({
						message: '请填写预警个数！',
						type: 'waining'
					});
					return Promise.reject("请填写预警个数！");
				}else if(!this.placeList.length){
					this.$message({
						message: '请设置归属地！',
						type: 'waining'
					});
					return Promise.reject("请设置归属地！");
				}
				return Promise.resolve(true);
			},

			//	提交添加的表单
			sub: async function(){
				let passOn = await this.checkData();
				let res = await loading(AJAX.post("location/monitor/add",{
					rid: this.caseId,
					name: this.caseCheck,
					deviceIds: !!this.list.deviceId?this.list.deviceId.join(","):sessionStorage.getItem("allNotesId"),
					cyTime: this.time,
					sTime: Date.parse(this.date[0])/1000,
					eTime: Date.parse(this.date[1])/1000,
					warnCount: this.number,
					addressIds: this.placeList.join(','),
					policeIds: this.extraUser.join(','),
					userIds: this.sysUser.join(","),
					userName: sessionStorage.getItem("username")
				}));
				if(res.code == 200){
					this.close(1);
				}
			},

			edit: async function(){
				let passOn = await this.checkData();
				let res = await loading(AJAX.post("location/monitor/update",{
					rid: this.caseId,
					name: this.caseCheck,
					devicesIds: !!this.list.deviceId?this.list.deviceId.join(","):sessionStorage.getItem("allNotesId"),
					cyTime: this.time,
					sTime: Date.parse(this.date[0])/1000,
					eTime: Date.parse(this.date[1])/1000,
					warnCount: this.number,
					addressIds: this.placeList.join(','),
					policeIds: this.extraUser.join(','),
					userIds: this.sysUser.join(","),
					userName: sessionStorage.getItem("username")
				}));
				if(res.code == 200){
					this.close(1);
				}
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

            //	更新归属地
            getOwerPlace: function(e){
            	this.placeList = e;
            },
            showPolice: function(){
            	this.policeActiveClass = 'active';
            },
            closePolice: function(){
            	this.policeActiveClass = 'hidden';
            },
            policeRefresh: function(e){
            	this.extraUser = e;
            }

		},
		watch: {
			//	显示控制，触发显示的时候同时检查窗口用途
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
					if(this.type === 'edit'){
						this.defaultData = {
							device: [],
							policeIn: [],
							placeList: []
						}
						//	{ 归属地 ，设备id ，其他数据 ，      }
						let { address, devices, locationMonitor, policeMan, user } = JSON.parse(this.data);

						address.map(e => {
							this.defaultData.placeList.push(e.addressid);
						});
						devices.map(e => {
							this.defaultData.device.push(e.deviceid);
						});

						this.defaultData.policeIn = user;
						this.extraUser = policeMan;
						this.caseCheck = locationMonitor.name;
						this.time = locationMonitor.cytime;
						this.number = locationMonitor.warncount;
						this.date = [new Date(locationMonitor.stime * 1000),new Date(locationMonitor.etime * 1000)]
						this.title = "编辑布控";
					}else{
						this.title = "创建布控";
						this.defaultData = {
							device: [],
							policeIn: []
						}
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
		.case-content{
			.case-info-body{
				.bk-item{
					overflow: hidden;
					padding: 30px 0 0;
					color:rgba(0,0,0,0.85);
					font-size: 14px;
				    float: left;
				    line-height: 32px;
				    &.bk-overset{
			    	    width: calc(100% - 6px);
					    overflow: auto;
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
						margin-right: 20px;
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
					.case-right-city{
						float: left;
						margin-left: 12px;
					}
					.case-dest-warpper{
						width: calc(100% - 200px);
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
</style>