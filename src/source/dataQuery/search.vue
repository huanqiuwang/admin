<template>
	<div class="search-wrapper" ref='wrapper'>
		<div class="main-search-form">
			<el-select v-model="value" placeholder="请选择">
			    <el-option
			      	v-for="item in options"
			      	:key="item.value"
			      	:label="item.label"
			      	:value="item.value">
			    </el-option>
		  	</el-select>
			<input class="search-input" type="text" v-model="searchKey" v-on:keyup="enterKey($event)" />
			<el-button type="primary" :class="permit" icon="el-icon-search" v-on:click="beginSearch">搜索</el-button>
			<p id="box" :class="active">+</p>
			<div class="upload-file" v-on:click="upload" :class="active">
				<input id="fileUpload" v-on:change="change" type="file" name="file" accept="image/*" multiple/>
			</div>
		</div>

		<div class="quick-btn" v-on:click="gotoQuick">
			<img src="../../assets/images/quick-menu.png" alt="">快捷入口
		</div> 
	
		 <!-- 树形选择器 -->
        <tree-case 
            :activeClass="treeActiveClass"
            @closeTree="treeClose"
            @getCheckedCallback="getNodes">
        </tree-case>
	</div>
</template>
<script>
	import tree from "../components/common/tree.vue"
	import { MAX_UPLOAD_IMG,TIPS } from '../../config/global.js'

	export default {
		name: "search",
		data() {
			return {
				file: '',
				active: "hidden",
				treeActiveClass: 'hidden',
				permit: "permit",
				options: [{
		            value: '1',
		            label: 'IMSI'
		        }, {
		            value: '2',
		            label: 'IMEI'
		        }, {
		            value: '3',
		            label: 'MAC'
		        }, {
		            value: '4',
		            label: '车牌'
		        }, {
		            value: '5',
		            label: '虚拟身份'
		        },{
		        	value: '6',
		        	label: "人像"
		        }],
		        value: '1',
		        searchKey: ''
			}
		},
		components: {
            'tree-case': tree,
        },
		methods: {
			beginSearch: function(){
				var _this = this;
				if(this.value == 1 || this.value == 2){
					this.$parent.addNewTab({
						url: '/search/imei/list',
						text: "IMSI/IMEI",
						name: 'searchImei',
						query:{
							searchKey: this.value+"_"+this.searchKey
						}
					})
				}else if(this.value == 3){
					this.$parent.addNewTab({
						url: '/search/mac/list',
						text: "MAC查询",
						name: 'searchMac',
						query:{
							searchKey: _this.searchKey
						} 
					})
				}else if(this.value == 4){
					this.$parent.addNewTab({
						url: '/search/car/list',
						text: "车牌查询",
						name: 'searchCar',
						query:{
							searchKey: _this.searchKey
						} 
					})
				}else if(this.value == 5){
				}
			},
			upload: function(){
				document.getElementById("fileUpload").click();
			},
			change: async function(e){
				var _this = this,
				 	f = document.getElementById("fileUpload").files[0],
				 	fr = new FileReader();//实例FileReader对象
			 	if(f.size > MAX_UPLOAD_IMG){
                    _this.$message(TIPS.imgUpload);
                    return Promise.reject(TIPS.imgUpload);
                }
				document.getElementById("fileUpload").value = '';
			 	fr.readAsDataURL(f);//把上传的文件对象转换成url
			 	fr.onload = function(e){
			 		sessionStorage.setItem("humanImgBase64",this.result);
			 		sessionStorage.setItem("humanImgBase64Used",false);
			 		_this.$parent.addNewTab({
						url: '/search/face/list',
						text: "人像查询",
						name: 'searchFace'
					})
			 	}
			},
			enterKey: function(e){
				if(e.keyCode == '13' && this.permit == ''){
					this.beginSearch();
				}
			},
			treeClose: function(){

			},
			getNodes: function(){

			},
			gotoQuick: function(){
				this.$parent.addNewTab({
					url: "/search/searchEntry",
                    text: "快捷入口",
                    name: "searchEntry"
				});
			},
			dataInit: async function(){
				var box = document.getElementById('box'),_this = this;
				box.ondragover = function (e){
				 	e.preventDefault();
				}
				box.ondrop = async function (e){
				 	e.preventDefault();
				 	var f = e.dataTransfer.files[0];//获取到第一个上传的文件对象
				 	var fr = new FileReader();	//实例FileReader对象
				 	if(f.size > MAX_UPLOAD_IMG){
	                    _this.$message(TIPS.imgUpload);
	                    return Promise.reject(TIPS.imgUpload);
	                }
				 	fr.readAsDataURL(f);		//把上传的文件对象转换成url
				 	fr.onload=function (e){
					  	var Url = this.result;//上传文件的URL
					  	// box.innerHTML+='<img src="'+Url+'" alt="">';
					  	sessionStorage.setItem("humanImgBase64",Url);
					  	sessionStorage.setItem("humanImgBase64Used",false);
					  	_this.$parent.addNewTab({
							url: '/search/face/list',
							text: "人像查询",
							name: 'searchFace'
						})
				 	}
				}
			}
		},
		watch: {
			value: function(){
				this.active = this.value == 6?'active':'';
				if(this.value == 1 || this.value == 2){
					this.permit = this.searchKey.length == 15?'':'permit';
				}else if(this.value == 3){
					this.permit = this.searchKey.length == 12?'':'permit';
				}else if(this.value == 4 || this.value == 5){
					this.permit = this.searchKey.length > 0?'':'permit';
				}
			},
			searchKey: function(){
				this.searchKey = this.trimAll(this.searchKey);
				if(this.value == 1 || this.value == 2){
					this.permit = this.searchKey.length == 15?'':'permit';
				}else if(this.value == 3){
					this.permit = this.searchKey.length == 12?'':'permit';
				}else if(this.value == 4 || this.value == 5){
					this.permit = this.searchKey.length > 0?'':'permit';
				}
			}
		},
		mounted: function(){
			this.dataInit();
		},
		activated: function(){
			this.dataInit();
		}
	}
</script>
<style lang="scss">
	.search-wrapper{
		position: relative;
		.main-search-form{
			width: 880px;
			height: 40px;
			display: inline-block;
			margin: 200px auto 0;
			margin-left: calc(50% - 440px);
			position: relative;
			.el-select{
				width: 120px;
				float: left;
				input{
					border-radius: 4px 0 0 4px;
				}
				position: relative;
				z-index: 1;
			}
			#box{
				display: none;
				user-select: none;
				&.active{
					display: block;
					position: absolute;
					right: 0;
					width: calc(100% - 122px);
					height: 140px;
					background: #ffffff;
					border: 1px solid #dfdfdf;
					border-radius: 3px;
					top: 0;
					text-align: center;
					font-size: 40px;
					padding-top: 60px;
					color: #666666;
					font-weight: 100;
					&:after{
						content: '';
						width: calc(100% - 20px);
						margin: 10px;
						background: rgba(0,0,0,.05);
						height: 120px;
						position: absolute;
						top: 0;
						left: 0;
					}
					&:before{
						position: absolute;
						color: #666666;
						text-align: center;
						content: "拖拽图片到这里";
						width: 100%;
						top: 40px;
						left: 0;
						z-index: 1;
						letter-spacing: 1px;
						font-size: 16px;
					}
				}
			}
			input.search-input{
			    width: 640px;
				height: 38px;
				border-radius: 0;
				border: 1px solid #d2d2d2;
				outline: none;
				position: relative;
				float: left;
				left: -1px;
				border-left: none;
				padding-left: 10px;
			}
			button{
				width: 100px;
				float: left;
				border-radius: 0px 4px 4px 0;
				position: relative;
				height: 40px;
				left: -2px;
			}
			.el-button--primary{
				&.permit{
					background: #d2d2d2;
					color: #ffffff;
					border-color: #d2d2d2;
				}
			}
			.upload-file{
				display: none;
				user-select: none;
				&.active{
					display: block;
					position: absolute;
					width: 130px;
					left: calc(50% - 5px);
					top: 150px;
					height: 32px;
					border: 1px solid #d2d2d2;
					cursor: pointer;
					background: url("../../assets/images/upload.png") no-repeat left;
					background-position: 12px;
					&:before{
						content: "本地上传图片";
						position: absolute;
						top: 6px;
						left: 40px;
						color:#333333;
					}
					input{
						display: none;
					}
				}
			}
		}
		.quick-btn{
			position: absolute;
			right: 10px;
			top: 10px;
			cursor: pointer;
			color: #3aa0ff;
			img{
				position: relative;
				top: 2px;
				right: 10px;
			}
		}
	}
	
</style>