<template>

	<!-- :oldList='原本存在的图片'
	@refreshImgList="更新图片列表" -->

	<!-- 案件布控-图片批量上传 -->
	<div class="img-upload-wrapper">
		<div class="img-item" v-for="(item,ind) in imgList">
			<img :src="item.url" alt="" />
			<div class="img-delete" @click="imgDelete(ind)">×</div>
		</div>
		<div class="img-case" id="uploadBox">
	        <span>+</span>
	        <p>拖入图片</p>
	        <small @click="clickUpload">点击上传</small>
	        <input type="file" @change="changeUpload" id="filesUpload">
		</div>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		data () {
			return{
				imgList: [],
				deleteid: []
			}
		},
		props: {
			oldList: {
				type: Array,
				required: false
			}
		},
		methods: {
			//	删除图片，保存被删除图片的id
			imgDelete: function(e){
				if(!!this.imgList[e].id){
					this.deleteid.push(this.imgList[e].id);
				}
				this.imgList.splice(e,1);
			},
			clickUpload: function(){
				document.getElementById("filesUpload").click();
			},
			changeUpload: function(){
				var _this = this,
				 	f = document.getElementById("filesUpload").files[0],
				 	fr = new FileReader();			//实例FileReader对象
				document.getElementById("filesUpload").value = '';
			 	fr.readAsDataURL(f);				//把上传的文件对象转换成url
			 	fr.onload = function(e){
			 		_this.imgList.push({
				  		id: '',
				  		url: this.result
				  	})
			 	}
			}
		},
		watch: {
			oldList: function(){
				if(!!this.oldList){
					this.imgList = this.oldList;
				}
			},
			imgList: function(){
				this.$emit("refreshImgList",this.imgList);
			}
		},
		mounted: function(){
			var _this = this,
	            box = document.getElementById('uploadBox'),_this = this;
			box.ondragover = function (e){
			 	e.preventDefault();
			}
			box.ondrop=function (e){
			 	e.preventDefault();
			 	var f = e.dataTransfer.files[0];		//	获取到第一个上传的文件对象
			 	var fr = new FileReader();				//	实例FileReader对象
			 	fr.readAsDataURL(f);					//	把上传的文件对象转换成url
			 	fr.onload=function (e){
				  	_this.imgList.push({
				  		id: '',
				  		url: this.result
				  	})
			 	}
			}
		}
	}
</script>
<style lang="scss">
	.img-case{
		width: 80px;
        height: 80px;
        border: 1px dashed #1890ff;
        position: relative;
        display: inline-block;
        float: left;
        overflow: hidden;
        margin: 5px;
        span{
            font-size: 16px;
            display: line-block;
            position: absolute;
            transform: translate(35px,20px) scale(2);
            color: #d2d2d2;
            z-index: 1;
        }
        p{
            font-size: 12px;
            color: #aaaaaa;
            text-align: center;
            position: absolute;
            width: 100%;
            top: 50px;
        }

        &:hover small{
			bottom: 0;
		}	
        small{
			position: absolute;
			bottom: -100%;
			left: 0;
			width: 100%;
			color: white;
			padding: 3px 0;
			text-align: center;
			background: rgba(0,0,0,.65);
			transition: bottom .5s ease;
			cursor: pointer;
		    line-height: 20px;
        }
        input{
        	display: none;
        }
	}

	.img-item{
        width: 80px;
        height: 80px;
        border: 1px dashed #808080;
        position: relative;
        display: inline-block;
        float: left;
        overflow: hidden;
        margin: 5px;
        img{
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            left: -1px;
            top: -1px;
            position: absolute;
            z-index: 2;
            border: none;
            box-shadow: none;
            display: block;
            transition: transform .6s ease;
            &:hover{
	        	transform: scale(1.2);
	        }
        }
        .img-delete{
            background: #000;
            color: transparent;
            width: 20px;
            height: 20px;
            position: absolute;
            right: 0;
            border-radius: 0 0 0 200%;
            text-align: center;
            line-height: 14px;
            text-shadow: 2px 0px white;
            cursor: pointer;
            z-index: 4;
            transition: top .5s ease;
            top: 0px;
            &.active{
                top: 0;
            }
        }
    }
</style>