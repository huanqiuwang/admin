<template>
	<!-- 案件详情 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" title="详情"></case-header>
			<div class="case-info-body">
				<div class="case-info-menu">
					<div v-for="(item,ind) in menulist" :class="item.active?'active':''" @click="changeTab(ind)">{{item.name}}</div>
				</div>
				<div class="case-info-main">
					<div :class="menulist[0].active?'active':'hidden'">
						<p><span>编号：</span><span>{{testData.baseInfo.RID}}</span></p>
						<p><span>案件类型：</span><span>{{testData.baseInfo.CASETYPE}}</span></p>
						<p><span>案件别名：</span><span>{{testData.baseInfo.ALIAS}}</span></p>
						<p><span>案件地址：</span><span>{{testData.baseInfo.ADDRESS}}</span></p>
						<p>
							<span>经纬度：</span>
							<span v-if="!!testData.baseInfo.CASELONGITUDE">{{(testData.baseInfo.CASELONGITUDE || '') + ',' + (testData.baseInfo.CASELATITUDE || '')}}</span>
							<span else></span>
						</p>
						<p><span>案件说明：</span><span>{{testData.baseInfo.DESCRIPTION}}</span></p>
					</div>
					<!-- <div :class="menulist[1].active?'active':'hidden'">
						<p><span>经纬度：</span><span>{{testData.airInfo.lt + ',' + testData.airInfo.nt}}</span></p>
						<p><span>基站信息：</span><span>{{testData.airInfo.website}}</span></p>
						<p><span>天气：</span><span>{{testData.airInfo.air}}</span></p>
						<p><span>热点信息：</span><span>{{testData.airInfo.info}}</span></p>
						<p><span>现场信息：</span><span>{{testData.airInfo.live}}</span></p>
					</div>
					<div :class="menulist[2].active?'active':'hidden'">
						<el-table :data="testData.destInfo">
						    <el-table-column prop="type" label="类型"></el-table-column>
						   	<el-table-column prop="dest" label="目标"></el-table-column>
						   	<el-table-column prop="adder" label="添加人"></el-table-column>
						   	<el-table-column prop="addtime" label="添加时间" :formatter="hqDateFormat1"></el-table-column>
					  	</el-table>
					</div> -->
				</div>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>
	</div>
</template>
<script>
 	import {backMood,caseHeader} from './index/index.js'

	export default {
		props: {
			data: {
				type: String,
				required: true
			},
			activeClass: {
				type: String,
				required: true
			}
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
		},
		data () {
			return {
				animationClass: '',
				menulist: [
					{
						name: '基本信息',
						active: true
					}
					// ,{
					// 	name: '空中信息',
					// 	active: false
					// },{
					// 	name: '目标信息',
					// 	active: false
					// }
				],
				testData: {
					baseInfo: {},
					airInfo: {
						lt: '22.23',
						nt: '123.65',
						website: '盗版',
						air: '28℃',
						info: '13456',
						live: '混乱'
					},
					destInfo: [
						{
							type: 'IMSI',
							dest: '4894645461657542,45151244545121',
							adder: '王环球',
							addtime: '1587894561'
						},{
							type: 'IMSI',
							dest: '4894645461657542,45151244545121',
							adder: '王环球',
							addtime: '1587894561'
						},{
							type: 'IMSI',
							dest: '4894645461657542,45151244545121',
							adder: '王环球',
							addtime: '1587894561'
						},{
							type: 'IMSI',
							dest: '4894645461657542,45151244545121',
							adder: '王环球',
							addtime: '1587894561'
						}
					]
				}
			}
		},
		methods: {
			changeTab: function(ind){
				this.menulist.map((e,index) => {
					if(index !== ind){
						e.active = false;
					}else{
						e.active = true;
					}
				})
			},
			close: function(){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.$emit("closeHandle")
				},300);
			}
		},
		watch: {
			data: function(){
				if(!!this.data){
					this.testData.baseInfo = JSON.parse(this.data);
					// console.log(this.testData.baseInfo);
				}
			},
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
			height: 480px;
			.case-info-body{
				overflow: hidden;
				height: 426px;
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
				.case-info-main{
					width: 818px;
					float: left;
					p{
						font-size:14px;
						color:rgba(0,0,0,0.85);
						padding: 20px 0 0;
						height: 20px;
						line-height: 20px;
						&>span{
							position: relative;
							top: 0;
							display: inline-block;
							
							&:nth-child(1){
								text-align: right;
								width: 300px;
							}
							&:nth-child(2){
								text-align: left;
							    width: 480px;
							    word-break: break-all;
							    padding-left: 10px;
							}
						}
					}
					div>p:nth-child(1){
						margin-top: 40px;
					}
				}
			}
		}
	}
</style>