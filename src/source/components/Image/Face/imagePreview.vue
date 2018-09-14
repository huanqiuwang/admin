<template>
	<div class="img-prew-wrapper" :class="showClass">
		<div class="img-prew-content">
			<div class="img-header">{{title}}</div>
			<div class="img-content">
				<p><img src="../../../../assets/img/location-result.png" alt="">{{address}}</p>
				<div class="img-list">
					<div class="img-item" v-for="item in imgList1">
						<img :src="item.captureImgFullUrl" alt="">
						<p><span>相似度:  </span><span class="active">{{autoPercentage(item.score)}}</span></p>
						<p>{{hqDateFormat(item.time)}}</p>
					</div>
				</div>
				<div class="img-btn-list">
					<span>{{pageNow}}/{{total}}</span>
					<button v-on:click="imgBefore">上一地址</button>
					<button v-on:click="imgNext">下一地址</button>
				</div>
			</div>
		</div>
		<div class="picture-backmood" @click="hiddenPlugins"></div>
	</div>
</template>
<script>
	export default {
		props: {
			title: {
				type: String,
				default: "人像详情查看",
				require: false
			},
			imgList: {
				type: Array,
				require: true
			},
			showClass: {
				type: String
			},
			indexNow: {
				type: Number,
				require: false,
				default: 1
			}
		},
		data () {
			return {
				imgList1: [],
				total: 1,
				pageNow: 1,
				address: ''
			}
		},
		methods: {
			imgBefore: function(){
				if(this.pageNow > 1){
					this.pageNow --;
					this.imgList1 = this.imgList[this.pageNow-1].faceAnalysisResult;
				}
			},
			imgNext: function(){
				if(this.pageNow < this.total){
					this.pageNow ++;
					this.imgList1 = this.imgList[this.pageNow-1].faceAnalysisResult;
				}
			},
			hiddenPlugins: function(){
				this.$emit("hiddenPrev");
			}
		},
		watch: {
			imgList: function(){
				this.total = this.imgList.length;
			},
			pageNow: function(){
				this.address = this.imgList[this.pageNow - 1].address;
			},
			indexNow: function(){
				this.pageNow = this.indexNow;
			},
			showClass: function(){
				if(this.showClass == 'active'){
					this.pageNow = this.indexNow;
					this.imgList1 = this.imgList[this.pageNow-1].faceAnalysisResult;
					this.address = this.imgList[this.pageNow-1].address;
				}
			}
		},
		mounted: function(){
			
		}
	}
</script>
<style lang="scss">
	.img-prew-wrapper{
		display: none;
		&.active{
			display: block;
		}
	    .picture-backmood{
	    	position: fixed;
	    	top: 0;
	    	left: 0;
			width: 100%;
	    	height: 100%;
	    	z-index: 5;
	    	background: rgba(0,0,0,.35);
	    }
	    .img-prew-content{
			position: fixed;
			z-index: 10;
			width: calc(100% - 200px);
			height: calc(100% - 200px);
			top: 100px;
			left: 100px;
			background: rgba(255,255,255,1);
			padding: 0px;
			border-radius: 2px;
			.img-header{
				height: 54px;
				background: #1890ff;
				color: #fff;
				line-height: 54px;
				padding-left: 20px;
			}
			.img-content{
				padding: 0 0 0 20px;
				height: calc(100% - 54px);
				p{
					text-align: center;
					padding: 5px 0 10px;
					img{
						position: relative;
						top: 3px;
						left: -4px;
					}
				}
				.img-list{
					height: calc(100% - 100px);
					overflow: auto;
					.img-item{
						width: 134px;
						height: 175px;
						background: #eeeeee;
						color: #666666;
						float: left;
						margin: 15px;
						position: relative;
						img{
							width: 134px;
							height: 175px;
						}
						p{
							position: absolute;
							bottom: 0;
							margin: 0;
							text-align: left;
							color: #fff;
							width: calc(100% - 8px);
							background: rgba(0,0,0,.6);
							padding: 5px 0 0 8px;
							z-index: 5;
							.active{
								color: orange;
							}
						}
						&>p:nth-child(2){
							bottom: 20px;
						}
					}
				}
				.img-btn-list{
					text-align: center;
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
					}
				}
			}
	    }
	}
</style>