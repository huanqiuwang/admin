<template>
	<div class="caplate-wrapper" :class="active">
		<div class="carplate-content">
			<div class="carplate-header">
				{{title}}
			</div>
			<div class="carplate-body">
				<div class="left-detail">
					<div class="carplate-info">
						<p><span>车牌：</span><span class="active">{{showList.PLATE}}</span></p>
						<p><span>颜色：</span><span>{{showList.COLOR}}</span></p>
						<p><span>时间：</span><span>{{hqDateFormat(showList.CAPTURETIME)}}</span></p>
						<p><span>地址：</span><span>{{showList.ADDRESS}}</span></p>
					</div>
					<div class="small-img-list">
						<div class="small-img-item" v-for="item in showList.FACEIMGS.faceUrls">
							<img :src="item" alt="">
						</div>
					</div>
				</div>
				<div class="right-img">
					<img :src="showList.FACEIMGS.panoramaUrl" alt="">
				</div>
			</div>
			<div class="buttom-info">
				<p><span>共 {{pageSize}} 条</span>，<span>当前第 {{pageNow}} 条</span></p>
				<button :class="beforeClass" @click="before">上一条</button>
				<button :class="afterClass" @click="after">下一条</button>
			</div>
		</div>
		<div class="carplate-backmood" @click="closePlugins"></div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				pageNow: 1,
				pageSize: 1,
				active: '',
				showList: {
					FACEIMGS: {
						faceUrls: [],
						panoramaUrl: ''
					}
				},
				beforeClass: false,
				afterClass: false,
			}
		},
		props: {
			title: {
				type: String,
				default: '人像详情查看'
			},
			carplateImgList: {
				required: true,
				type: Array
			},
			activeClass: {
				type: String,
				default: 'active'
			},
			indexNow: {
				type: Number,
				default: 1,
				required: true
			}
		},
		methods: {
			//	上一条			
			before: function(){
				let movLength = 1,
					arrIndex = this.pageNow-1;
				if(arrIndex > 0){
					while(!this.carplateImgList[arrIndex-movLength].FACEIMGS){
						movLength ++;
					}
					this.pageNow = this.pageNow - movLength;
					this.showList = this.carplateImgList[this.pageNow - 1];
				}
				this.checkJump();
			},
			//	下一条
			after: function(){
				let movLength = 1,
					arrIndex = this.pageNow-1;
				if(this.pageNow < this.pageSize){
					while(!this.carplateImgList[arrIndex+movLength].FACEIMGS){
						movLength ++;
					}
					this.pageNow = this.pageNow + movLength;
					this.showList = this.carplateImgList[this.pageNow - 1];
				}
				this.checkJump();
			},
			closePlugins: function(){
				this.$emit("hiddenPluginsHandle");
			},
			changePage: function(){
				if(this.pageNow<1){
					this.pageNow = 1;
				}else if(this.pageNow>this.pageSize){
					this.pageNow = this.pageSize;
				}
				this.showList = this.carplateImgList[this.pageNow - 1];
			},
			//	验证上一条与下一条的是否可点击情况
			checkJump: function(){
				let now = this.pageNow - 1,
					last = this.pageSize - 1,
					before = false,
					after = false;
				for(let i = 0; i<=last; i++){
					if(i<now && !!this.carplateImgList[i].FACEIMGS){
						before = true;
					}else if(i>now && !!this.carplateImgList[i].FACEIMGS){
						after = true;
					}
				}
				this.beforeClass = before?'':'permit';
				this.afterClass = after?'':'permit';
			}
		},
		watch: {
			activeClass: function () {
				this.active = this.activeClass;
				this.pageSize = this.carplateImgList.length;
				this.pageNow = this.indexNow;
				this.showList = this.carplateImgList[this.pageNow - 1];
				this.checkJump();
			},
			indexNow: function(){
				this.pageNow = this.indexNow;
				this.showList = this.carplateImgList[this.pageNow - 1];
			}
		}
	}
</script>
<style lang="scss">
	.caplate-wrapper{
		transition: opacity .3s ease;
		display: none;
		&.active{
			display: block;
			&.hide{
				opacity: 0;
			}
		}
	    .carplate-backmood{
	    	position: fixed;
	    	top: 0;
	    	left: 0;
			width: 100%;
	    	height: 100%;
	    	z-index: 5;
	    	background: rgba(0,0,0,.35);
	    }
	    .carplate-content{
			position: fixed;
			z-index: 10;
			width: 1230px;
			height: 726px;
			top: calc(50% - 363px);
			left: calc(50% - 615px);
			background: rgba(255,255,255,1);
			padding: 0px;
			border-radius: 2px;
			.carplate-header{
				height: 54px;
				background: #1890ff;
				color: #fff;
				line-height: 54px;
				padding-left: 20px;
			}
			.carplate-body{
				padding: 0 0 0 20px;
				height: calc(100% - 135px);
				.left-detail{
					width: 410px;
					display: inline-block;
					.carplate-info{
						p{
							padding: 18px 0 0 0;
							&>span:nth-child(1){
								text-align: center;
								width: 60px;
								display: inline-block;
								color: #666666;
							}
							&>span:nth-child(2){
								color: #333333;
								&.active{
									color: #1890ff;
								}
							}
						}
					}
					.small-img-list{
						width: 400px;
						height: 390px;
						overflow-y: auto;
						background:#f3f3f3;
						border:1px solid #dcdcdc;
						margin: 10px 0 0 5px;
						.small-img-item{
							width: 90px;
							height: 90px;
							margin: 18px;
							background: white;
							float: left;
							img{
								width: 100%;
								height: 100%;
								transition: transform .3s ease;
								&:hover{
									transform: scale(1.3,1.3);
								}
							}
						}
					}
				}
				.right-img{
					background:#d8d8d8;
					width:727px;
					height:539px;
					display: inline-block;
					float: right;
					margin: 20px 40px 0 0;
					text-align: center;
					position: relative;
					img{
						position: relative;
						top: 50%;
						transform: translateY(-50%);
						max-width: 727px;
						max-height: 539px;
					}
				}
			}
			.buttom-info{
				width: 100%;
				text-align: center;
				position: relative;
				p{
					position: absolute;
					top: 10px;
					left: 30px;
					input{
						width: 30px;
						height: 30px;
						text-align: center;
						position: relative;
						top: -3px;
						margin: 0 10px 5px;
						display: inline-block;
					}
				}
				button{
					-webkit-appearance: none;
					appearace: none;
					display: inline-block;
					margin: 10px 20px;
					background: #1890ff;
					border-radius:4px;
					width:88px;
					height:32px;
					color: #fff;
					border: none;
					cursor: pointer;
					&:active{
						opacity: .85;
						box-shadow: 0 2px 4px #1890ff;
					}
					&.permit{
						-webkit-pointer-events: none;
						pointer-events: none;
						-webkik-user-select: none;
						user-select: none;
						background: #aaaaaa;
						color: white;
					}
				}
			}
	    }
	}
</style>