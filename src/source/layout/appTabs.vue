<template>
  	<div class="tabs-wrapper">
  		<span class="el-icon-caret-left" v-on:click="movLeft"></span>
  		<div class="tabs-list">
  			<el-tooltip v-for="(item,ind) in tablist" class="item" effect="dark" :content="item.text" placement="top-start" :key="ind">
	  			<router-link class="tab-item" :class="{'active':ind === index}" :to="item.url" v-on:click.native="changeTab(item,ind)" tag="div">
				{{item.text}}
					<i class="el-icon-error" v-on:click.stop="deleteTab(ind)"></i>
				</router-link>
			</el-tooltip>
  		</div>
  		<span class="el-icon-caret-right" v-on:click="movRight"></span>
	</div>
</template>

<script>
	export default {
		name: 'appHeader',
		data() {
			return {
				tabWidth: 133,
				spanWidth: 32
			}
		},
		methods: {
	      	changeTab: function(e,ind){
	      		let WE = document.getElementsByClassName("tabs-wrapper")[0],	//	wrapper元素
	      			LE = document.getElementsByClassName("tabs-list")[0],		//	list元素
	      			total = this.tablist.length * this.tabWidth,				//	tabs总长度
	      			w = WE.offsetWidth - this.spanWidth * 2,					//	能够显示的宽度
	      			now = LE.offsetLeft;										//	当前tab的位置
	      		if((ind + 1) * this.tabWidth + now > w){
	      			LE.style.left = LE.offsetLeft + "px";
	      		}
	      		this.$emit("changeTabHandle",{
	      			data: e,
	      			index: ind
	      		});
	      	},
	      	deleteTab: function(ind){
	      		this.$emit("deleteTabHandle",ind);
	      	},
	      	movLeft: function(){
	      		let WE = document.getElementsByClassName("tabs-wrapper")[0],	//	wrapper元素
	      			LE = document.getElementsByClassName("tabs-list")[0],		//	list元素
	      			total = this.tablist.length * this.tabWidth,				//	tabs总长度
	      			w = WE.offsetWidth - this.spanWidth * 2,					//	能够显示的宽度
	      			now = LE.offsetLeft,										//	当前tab的位置
	      			movLength = 0;												//	需要移动的距离
	      		if(now === "" || now >= 0 || w >= total){
	      			return false; 
	      		}else{
	      			movLength = parseInt(w/this.tabWidth)*this.tabWidth;
	      			LE.style.left = (LE.offsetLeft + movLength > 32)?"32px":LE.offsetLeft + movLength + "px";
	      		}
	      	},
	      	movRight: function(){
	      		let WE = document.getElementsByClassName("tabs-wrapper")[0],	//	wrapper元素
	      			LE = document.getElementsByClassName("tabs-list")[0],		//	list元素
	      			total = this.tablist.length * this.tabWidth,				//	tabs总长度
	      			w = WE.offsetWidth - this.spanWidth * 2,					//	能够显示的宽度
	      			now = LE.offsetLeft,										//	当前tab的位置
	      			movLength = 0;												//	需要移动的距离
	      		if(w >= total || total + now < w){
	      			return false; 
	      		}else{
	      			movLength = parseInt(w/this.tabWidth)*this.tabWidth;
	      			LE.style.left = LE.offsetLeft - movLength + "px";
	      		}
	      	}
	    },
	    props: [
	    	"tablist",
	    	"index"
	    ]
	}
</script>

<style lang="scss">
	$active-color: #1890ff;

	.tabs-wrapper{
    	width: 100%;
	    height: 42px;
	    line-height: 42px;
	    font-size: 13px;
	    font-weight: bold;
	    color: #aaaaaa;
	    border-radius: 5px 5px 0 0;
	    position: relative;
	    overflow: hidden;
	    span{
	    	text-align:center;
			position: absolute;
			top: 0;
			width: 32px;
			height: 40px;
			border-bottom: 2px solid #f3f3f3;
			display: inline-block;
			line-height: 40px;
			font-size: 24px;
			background: white;
			cursor: pointer;
			z-index: 1;
			&.el-icon-caret-right{
				right: 0;
			}
			&.el-icon-caret-left{
				left: 0;
			}
			&:hover{
				background: #f6f6f6;
			}
	    }
	    .tabs-list{
	    	position: absolute;
	    	background: white;
	    	transition: left .6s ease;
	    	top: 0;
	    	left: 28px;
	    	width: 10000px;
	    	height: 40px;
	    	border-bottom: 2px solid #f3f3f3;
			.tab-item{
		    	display: inline-block;
		    	line-height: 40px;
		    	padding: 0 25px 0 20px;
		    	cursor: pointer;
		    	position: relative;
	    	    width: 88px;
			    white-space: nowrap;
			    overflow: hidden;
			    text-overflow: ellipsis;
		    	&.active{
	    		    border-bottom: 2px solid $active-color;
	    		    color: $active-color;
		    	}
		    	i{
		    		position: absolute;
		    		right: 5px;
		    		top: 12px;
		    		font-size: 15px;
		    		&:hover{
		    			color: red;
		    		}
		    	}
		    	&:hover i{
	    			display: block;
	    		}
		    }
	    }
	}
</style>
