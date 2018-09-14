<template>
    <div class="img-case" id="uploadBox">
        <img :src="imgUrl" alt="" />
        <span>+</span>
        <p>拖入图片</p>
        <div class="img-delete" :class="showClose" @click="imgDelete">×</div>
    </div>
</template>
<script>
    import { Message } from 'element-ui'
    import { MAX_UPLOAD_IMG,TIPS } from '../../../../config/global.js'

	export default {
		data () {
			return{
				realimgUrl: '',
				showClose: 'hidden'
			}
		},
		props: {
			imgUrl: {
				type: String,
				required: false
			}
		},
		methods: {
			imgDelete: function(){
				this.realimgUrl = '';
				this.showClose = 'hidden';
				this.$emit("updateImgHandle",'');
			},
            imgCheck: async function(file){
                if(!file){
                    return Promise.reject('请传入图片！');
                }else if(!file.size){
                    return Promise.reject('读取不到该图片的信息！');
                }else if(file.size > MAX_UPLOAD_IMG){
                    Message.info(TIPS.imgUpload);
                    return Promise.reject(TIPS.imgUpload);
                }else{
                    return true;
                }
            }
		},
		watch: {
			imgUrl: async function(){
                if(this.imgUrl.length > 1.33*MAX_UPLOAD_IMG){
                    Message.info(TIPS.imgUpload);
                }else{
                    this.realimgUrl = this.imgUrl;
                    if(!!this.imgUrl){
                        this.showClose = 'active';
                    }else{
                        this.showClose = 'hidden';
                    }
                }
			}
		},
		mounted: function(){
			var _this = this,
	            box = document.getElementById('uploadBox'),_this = this;
			box.ondragover = function (e){
			 	e.preventDefault();
			}
			box.ondrop= async function (e){
			 	e.preventDefault();
			 	var f = e.dataTransfer.files[0];		//获取到第一个上传的文件对象
                await _this.imgCheck(f);
			 	var fr = new FileReader();				//实例FileReader对象
			 	fr.readAsDataURL(f);					//把上传的文件对象转换成url
			 	fr.onload=function (e){
				  	_this.realimgUrl = this.result;		//上传文件的URL
                    console.log(_this.realimgUrl.length);
				  	_this.$emit("updateImgHandle",this.result);
			 	}
			}
		}
	}
</script>
<style lang="scss">
    .img-case{
        width: 66px;
        height: 66px;
        border: 1px dashed #1890ff;
        position: relative;
        display: inline-block;
        float: left;
        overflow: hidden;
        span{
            font-size: 16px;
            display: line-block;
            position: absolute;
            transform: translate(27px,16px) scale(2);
            color: #d2d2d2;
            z-index: 1;
        }
        p{
            font-size: 12px;
            color: #aaaaaa;
            text-align: center;
            position: absolute;
            width: 100%;
            top: 40px;
        }
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
            width: 16px;
            height: 16px;
            position: absolute;
            right: 0;
            border-radius: 0 0 0 200%;
            text-align: center;
            line-height: 14px;
            text-shadow: 2px 0px white;
            cursor: pointer;
            z-index: 4;
            transition: top .5s ease;
            top: -16px;
            &.active{
                top: 0;
            }
        }
    }
</style>
