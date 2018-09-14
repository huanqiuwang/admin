<template>
	<div class="case-dest-warpper">
		<div class="case-top-radio">
			<el-radio v-model="type" label="1" :disabled="activeList[1]">IMSI</el-radio>
		  	<el-radio v-model="type" label="2" :disabled="activeList[2]">IMEI</el-radio>
		  	<el-radio v-model="type" label="3" :disabled="activeList[3]">MAC</el-radio>
		  	<el-radio v-model="type" label="4" :disabled="activeList[4]">人像</el-radio>
		  	<el-radio v-model="type" label="5" :disabled="activeList[5]">车牌</el-radio>
		</div>
		<div class="case-bottom-input">
			<input v-if="type != 4" v-model="data" type="text" placeholder="请输入对应的目标,多个目标用逗号‘，’分隔" />
			<picture-upload
				v-show="type == 4"
				:oldList="imgList"
				@refreshImgList="refreshImg"></picture-upload>
		</div>
	</div>
</template>
<script>
	import pictureUpload from '../index/PictureUpload.vue'

	export default {
		props: {
			defaultData: {
				required: false
			}
		},
		data () {
			return {
				type: '1',
				imgList: [],	//	原来的图片列表
				list: [],		//	最新的图片列表
				data: '',
				activeList: [false, false, false, false, false, false]
			}
		},
		components: {
			'picture-upload': pictureUpload
		},
		methods: {
			refreshImg: function(e){
				this.list = [];
				e.map(item => {
					if(item.url.split(';base64,').length === 2){
						this.list.push({
							fid: '',
							base64: item.url.split(';base64,')[1]
						})
					}else{
						this.list.push({
							url: item.url,
							fid: item.id
						})
					}
				});
			}
		},
		watch: {
			defaultData: function(){
				if(!this.defaultData){
					this.type = '1';
					this.list = [];
					this.data = '';
					this.activeList = [false, false, false, false, false, false]
				}else if(this.defaultData.type == 4){
					this.type = String(this.defaultData.type);
					this.imgList = this.defaultData.data;
					this.activeList = [true, true, true, true, false, true];
				}else{
					this.type = String(this.defaultData.type);
					this.data = this.defaultData.data;
					this.activeList = [true, true, true, true, true, true];
					this.$set(this.activeList,this.defaultData.type,false);
				}
			},
			list: function(){
				this.$emit("refreshHandle",{
					type: this.type,
					data: this.list
				});
			},
			data: function(){
				this.data = this.trimAll(this.data).replace("，",',');
				this.$emit("refreshHandle",{
					type: this.type,
					data: this.data
				});
			},
			type: function(){
				if(this.type == 4){
					this.$emit("refreshHandle",{
						type: this.type,
						data: this.list
					});
				}else{
					this.$emit("refreshHandle",{
						type: this.type,
						data: this.data
					});
				}
			}
		}
	}
</script>
<style lang="scss">
	.case-dest-warpper{
		width: 100%;
		.case-top-radio{
			label{
				margin: 5px 0 5px 15px;
			}
		}
		.case-bottom-input{
			input{
				padding-left: 6px;
			    width: 426px;
			    height: 32px;
			    border: 1px solid #dedede;
			    border-radius: 3px;
			    margin: 0 5px;
			    outline: none;
			    margin: 10px 0 0 6px;
			}
		}
	}
</style>