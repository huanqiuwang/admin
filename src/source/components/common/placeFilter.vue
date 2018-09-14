<template>
	<div class="place-filter-wrapper" :class="placeActive">
		<div class="place-filter">
			<div class="place-search">
				<input type="text" v-model="searchWords" />
				<i class="iconfont icon-sousuo"></i>
				<p>地点名称</p>
			</div>
			<div class="place-list">
				<div class="place-item" v-for="item in placeListData1" :class="item.active">
					<input type="checkbox" v-model="item.checked" />
					<p>{{item.name+hqDateFormat(item.stime)+"至"+hqDateFormat(item.etime)}}</p>
				</div>
			</div>
			<div class="btn-list">
				<button class="active" v-on:click="placeConfirm">确定</button>
				<button v-on:click="placeSelectOther">反选</button>
			</div>
		</div>
		<div class="place-backdrop" v-on:click="placeClose"></div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				searchWords: '',
				placeListData1: []
			}
		},
		methods: {
			placeConfirm: function(){
				var arr = [];
				for(let i = 0;i<this.placeListData1.length;i++){
					if(!this.placeListData1[i].active&&!!this.placeListData1[i].checked){
						arr.push(i);
					}
				}
				if(arr.length<=1){
					this.$message("至少选择两项···");
				}else{
					this.$emit("confirmHandle",arr);
				}
			},
			placeSelectOther: function(){
				for(let i = 0;i<this.placeListData1.length;i++){
					this.placeListData1[i].checked = !this.placeListData1[i].checked?true:false;
				}
			},
			placeClose: function(){
				this.$emit("closeHandle");
			}
		},
		watch: {
			searchWords: function(val){
				var _this = this
				this.placeListData1 = this.placeListData.filter(item => {
					if((item.name + '').indexOf(_this.searchWords) == -1 && !!item.name){
						item.active = "hidden";
						item.checked = false;
                	}else {
                		item.active = "";
                	}
                	return item
				});
			},
			placeListData: function(){
				this.placeListData1 = this.placeListData;
			}
		},
		props: {
			placeActive: {
				type: String,
				require: true
			},
			placeListData: {
				type: Array,
				require: true
			}
		},
		created: function(){
			this.placeListData1 = this.placeListData;
		}
	}
</script>
<style lang="scss">
	.place-filter-wrapper{
		&.active{
			display: block;
		}
		display: none;
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		.place-backdrop{
			width: 100%;
			height: 100%;
			position: relative;
			z-index: 1;
		}
	}
	.place-filter{
	    width: 391px;
	    height: 441px;
	    border: 1px solid #d2d2d2;
	    position: fixed;
	    top: calc(50% - 220px);
	    background: #ffffff;
	    left: calc(50% - 195px);
	    z-index: 2;
	    .place-search{
	    	position: relative;
	    	height: 85px;
	    	background: #f5f5f5;
	    	input[type="text"]{
		    	width: 356px;
		    	padding-left: 10px;
			    margin: 8px 10px;
			    height: 38px;
			    border-radius: 3px;
			    border: 1px solid #d2d2d2;
		    }
		    i{
		    	position: absolute;
		    	font-size: 24px;
		    	right: 18px;
		    	top: 15px;
		    	color: #bdbdbd;
		    }
		    p{
		    	padding-left: 10px;
		    }
	    }
	    .place-list{
	    	height: 280px;
	    	overflow: auto;
    	 	.place-item{
		    	width: calc(100% - 20px);
		    	padding: 20px 10px 0;
		    	overflow: hidden;
		    	input[type="checkbox"]{
		    		float: left;
		    		-webkit-appearance: none;
	                appearance: none;
	                background: url("../../../assets/images/checkbox_default.png") no-repeat;
	                width: 18px;
	                height: 18px;
	                position: relative;
	                top: 3px;
	                outline: none;
	                &:checked{
	                    background: url("../../../assets/images/checkbox.png") no-repeat;
	                }
		    	}
		    	p{
		    		width: calc(100% - 30px);
		    		padding-left: 10px;
					float: left;
		    	}
		    }
	    }
		.btn-list{
			padding: 10px 0;
			text-align: center;
			button{
				width: 120px;
				height: 36px;
				margin: 0 10px;
				appearance: none;
				border: 1px solid #d2d2d2;
				background: #ffffff;
				border-radius: 4px;
				outline: none;
				cursor: pointer;
				color: #909090;
				&.active{
					background: #1890ff;
					color: white;
				}
			}
		}
	}
</style>