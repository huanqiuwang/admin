<template>
	<!-- 添加布控 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="bk-item">
					<span>目标名称：<label class="el-icon-info"></label></span>
					<input type="text" v-model="caseCheck" :maxlength="max.DESTNAME" />
					<i>(*必填项)</i>
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
		            <i>(*必填项)</i>
				</div>
				<div class="bk-item">
					<span>IMSI：</span>
					<input type="text" placeholder="请输入IMSI,多个请用逗号分开" v-model="imsi" />
				</div>
				<div class="bk-item">
					<span>IMEI：</span>
					<input type="text" placeholder="请输入IMEI,多个请用逗号分开" v-model="imei" />
				</div>
				<div class="bk-item">
					<span>微信：</span>
					<input type="text" placeholder="请输入微信ID,多个请用逗号分开" v-model="wechatId" />
				</div>
				<div class="bk-item">
					<span>QQ：</span>
					<input type="text" placeholder="请输入QQ帐号,多个请用逗号分开" v-model="qqId" />
				</div>
				<div class="bk-item">
					<span>MAC：</span>
					<input type="text" placeholder="请输入MAC号码,多个请用逗号分开" v-model="mac" />
				</div>
				<div class="bk-item">
					<span>车牌：</span>
					<input type="text" placeholder="请输入车牌号码,多个请用逗号分开" v-model="carplate" />
				</div>
				
				<div class="bk-item">
					<span>上传人像：</span>
					<!-- 上传人像组件 -->
					<picture-upload
						class="control-upload-box"
						:oldList="defaultData.img"
						@refreshImgList="refreshImgList"></picture-upload>
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
				<div class="bk-item">
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
	import {backMood,caseHeader,pictureUpload,inputSelect} from './index/index.js'
	import deviceTree from '../common/tree.vue'
	import policeList from './Police.vue'
	import { MAX } from '../../../config/global.js'

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
			'police-list': policeList
		},
		data () {
			return {
				policeActiveClass: 'hidden',
				defaultData: {
					device: []
				},
				title: '创建布控',
				imsi: '',
				imei: '',
				wechatId: '',
				qqId: '',
				mac: '',
				carplate: '',
				sysUser: [],
				extraUser: [], 

				animationClass: '',
				treeActiveClass: 'hidden',
				list: {
					place: '',			//	页面显示的设备地点组合		-- array
					deviceId: '',		//	页面保存的设备地点的id组合  -- array
				},
				imgList: [],
				caseCheck: '',
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
		        max: MAX
			}
		},
		methods: {
			reset: function(){
				this.list = {
					place: '',
					deviceId: '',
				}
				this.defaultData = {
					policeIn: '',
					device: [],
					policeIds: []
				}
				this.caseCheck = '';
				this.imgList.splice(0,this.imgList.length);
				this.imsi = '';
				this.imei = '';
				this.wechatId = '';
				this.qqId = '';
				this.mac = '';
				this.carplate = '';
				this.sysUser.splice(0,this.sysUser.length);
				this.date = ['',''];
				this.extraUser = [];
			},
			//	提交添加的表单
			sub: async function(){
				let correct = await this.checkAddDetail();
				let res = await loading(AJAX.post("caseTarget/insertTarget",{
					caseId: this.caseId,
					targetName: this.caseCheck,
					device: this.list.deviceId.join(","),
					imsi: this.imsi,
					imei: this.imei,
					wechatId: this.wechatId,
					qqId: this.qqId,
					mac: this.mac,
					carplate: this.carplate,
					img: this.imgListFormat(this.imgList),
					policeIn: this.sysUser.join(","),
					start: Date.parse(new Date(this.date[0])) || '',
					end: Date.parse(new Date(this.date[1])) || '',
					policeOut: this.extraUser.join(',')
				}));
				if(res.code == 200){
					this.close(1);
				}
			},
			// 验证点击提交or添加时验证数据格式
			checkAddDetail: async function(){
				if(!this.caseCheck){
					this.$message({
						message: '目标名称不能为空！',
						type: 'waining'
					});
					return Promise.reject("目标名称不能为空！");
				}else if(!this.list.deviceId.length){
					this.$message({
						message: '请选择布控设备！',
						type: 'waining'
					});
					return Promise.reject("请选择布控设备！");
				}else if(!this.imsi && this.imei && this.wechatId && this.qqId && this.mac && this.carplate && this.img.length){
					this.$message({
						message: '至少填写一个需要布控的对象！',
						type: 'waining'
					});
					return Promise.reject("至少填写一个需要布控的对象！");
				}else if(!this.date || !this.date[0] || !this.date[1]){
					this.$message({
						message: '请选择布控时间！',
						type: 'waining'
					});
					return Promise.reject("请选择布控时间！");
				}else if(!this.extraUser.length && !this.sysUser.length){
					this.$message({
						message: '请选择处警人！',
						type: 'waining'
					});
					return Promise.reject("请选择处警人！");
				}
			},
			edit: async function(){
				let correct = await this.checkAddDetail();
				let res = await loading(AJAX.post("caseTarget/updateTarget",{
					targetId: this.targetId,
					caseId: this.caseId,
					targetName: this.caseCheck,
					device: this.list.deviceId.join(","),
					imsi: this.imsi,
					imei: this.imei,
					wechatId: this.wechatId,
					qqId: this.qqId,
					mac: this.mac,
					carplate: this.carplate,
					img: this.imgListFormat(this.imgList),
					policeIn: this.sysUser.join(","),
					start: Date.parse(new Date(this.date[0])) || '',
					end: Date.parse(new Date(this.date[1])) || '',
					policeOut: this.extraUser.join(',')
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

            //	图片数据冒泡到父组件
            refreshImgList: function(e){
            	this.imgList = e;
            },
            imgListFormat: function(list){
            	list.map(e => e.url = e.url.split('base64,')[1]);
            	return JSON.stringify(list);
            }
		},
		watch: {
			//	显示控制，触发显示的时候同时检查窗口用途
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
					if(this.type === 'edit'){
						let {targetName, device, imsi, imei, mac, qq, wechat, carplate, img, start, end, policeIn, policeOut} = JSON.parse(this.data);
						this.caseCheck = targetName;
						this.defaultData.img = img || '';
						this.imsi = imsi || '';
						this.imei = imei || '';
						this.wechatId = wechat || '';
						this.qqId = qq || '';
						this.mac = mac || '';
						this.carplate = carplate || '';

						this.defaultData.device = device;
						this.defaultData.policeIn = policeIn;
						
						this.date = [new Date(start),new Date(end)];
						this.extraUser = policeOut || [];
						this.title = "编辑布控";
					}else{
						this.title = "创建布控";
						this.defaultData = {
							device: [],
							policeIn: [],
						}
					}
				}
			},
			imsi: function(){
				this.imsi = this.trimAll(this.imsi);
				this.imsi = this.imsi.replace("，",",");
			},
			imei: function(){
				this.imei = this.trimAll(this.imei);
				this.imei = this.imei.replace("，",",");
			},
			wechatId: function(){
				this.wechatId = this.trimAll(this.wechatId);
				this.wechatId = this.wechatId.replace("，",",");
			},
			qqId: function(){
				this.qqId = this.trimAll(this.qqId);
				this.qqId = this.qqId.replace("，",",");
			},
			mac: function(){
				this.mac = this.trimAll(this.mac);
				this.mac = this.mac.replace("，",",");
			},
			carplate: function(){
				this.carplate = this.trimAll(this.carplate);
				this.carplate = this.carplate.replace("，",",");
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
				height: calc(100% - 120px);
				overflow-y: auto;
				.bk-item{
					&:last-child{
						margin-bottom: 100px;
					}
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
					.control-upload-box{
						width: 795px;
						height: auto;
						display: inline-block;
						float: left;
					}
					i{
						color: red;
						margin-left: 10px;
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