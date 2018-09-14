<template>
	<div class="picture-preview" :class="showClass">
		<div class="picture-content">
			<div class="picture-big-img">
				<img :src="bigImg" alt="">
			</div>
			<div class="picture-small-img">
				<img :src="smallImg" alt="">

				<div class="picture-info">
					<p><span>相似度：</span><span class="active">{{autoPercentage(data.score)}}</span></p>
					<p><span>采集地点：</span><span>{{data.address}}</span></p>
					<p><span>采集时间：</span><span>{{hqDateFormat(data.time)}}</span></p>
				</div>
				<div class="page-split">
					<footer>{{pageNow}}/{{pageTotal}}</footer>
					<span @click="before">上一张</span>
					<span @click="next">下一张</span>
				</div>
			</div>
		</div>
		<div class="picture-backmood" @click="hiddenPlugins" v-on:keyup="keydown($event)"></div>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		data () {
			return {
				pageNow: 1,
				pageTotal: 1,
				data: [],
				bigImg: '',
				smallImg: '',
			}
		},
		props: {
			showClass: {
				type: String,
				required: true,
				default: 'hidden'
			},
			imgList: {
				type: Array,
				required: true,
				default: []
			},
			indexNow: {
				type: Number,
				required: true,
				default: 1
			},
		},
		methods: {
			keydown: function(e){
				if(e.keyCode == '27'){
					this.hiddenPlugins();
				}
			},
			hiddenPlugins: function(){
				this.$emit("hiddenBigger");
			},
			before: function(){
				if(this.pageNow === 1){
					return false;
				}else{
					this.pageNow --;
				}
			},
			next: function(){
				if(this.pageNow >= this.pageTotal){
					return false;
				}else{
					this.pageNow ++;
				}
			},
			showImg: async function(){
				let res = await loading(AJAX.post('face/getCaptureFaceUrl',{
                    captureId: this.data.captureId
                }));
                this.bigImg = res.result.fullPanoramaUrl;
				this.smallImg = res.result.fullFaceUrl;
			}
		},
		watch: {
			showClass: async function(){
				if(this.showClass === "active"){
					this.pageNow = this.indexNow;
					this.data = this.imgList[this.pageNow - 1];
					this.showImg();
				}
			},
			pageNow: async function(){
				this.data = this.imgList[this.pageNow - 1];
				this.showImg();
			},
			indexNow: function(){
				this.indexNow = this.pageNow;
			},
			imgList: function(){
				this.pageTotal = this.imgList.length;
			}
		}
	}
</script>
<style lang="scss">
	.picture-preview{
	    .picture-backmood{
	    	position: fixed;
	    	top: 0;
	    	left: 0;
			width: 100%;
	    	height: 100%;
	    	z-index: 5;
	    	background: rgba(0,0,0,.35);
	    }
	    .picture-content{
			position: fixed;
			z-index: 10;
			width: calc(100% - 280px);
			height: calc(100% - 280px);
			top: 100px;
			left: 100px;
			background: rgba(255,255,255,1);
			padding: 40px;
			border-radius: 2px;
			.picture-big-img{
				width: calc(100% - 300px);
				height: 100%;
				background: url("../../../../assets/images/default.png") center center no-repeat,#eeeeee;
				text-align: center;
				float: left;
				img{
					max-width: 100%;
					max-height: 100%;
					position: relative;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			.picture-small-img{
				float: left;
				width: 260px;
				margin-left: 40px;
				height: 100%;
				position: relative;
				img{
					max-width: 100%;
					max-height: 100%;
				}
				.picture-info{
					margin: 5vh 0 0;
					p{
						overflow: hidden;
						padding: 10px 0 0;
						color: #868686;
						&>span:nth-child(1){
							display: inline-block;
							width: 80px;
							float: left;
						}
						&>span:nth-child(2){
							display: inline-block;
							width: calc(100% - 80px);
							float: left;
							color: #323232;
							&.active{
								color: #409eff;
								font-size: 20px;
							}
						}
					}
				}
				.page-split{
					position: absolute;
					right: 0;
					bottom: 2vh;
					text-align: center;
					width: 100%;
					span{
						width: 88px;
						height: 32px;
						background: #409EFF;
						color: white;
						display: inline-block;
						border-radius: 3px;
						text-align: center;
						line-height: 32px;
						cursor: pointer;
						margin: 10px;
						-webkit-user-select: none;
						user-select: none;
					}
					footer{
						color: #666666;
						font-size: 24px;
						text-align: center;
					}
				}
			}
	    }
	}
</style>