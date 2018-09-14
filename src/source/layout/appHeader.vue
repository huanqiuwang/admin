<template>
  	<div class="header-wrapper">
		<i class="header-slider" v-on:click="slideToggle"></i>
		<div class="header-right">
			<div class="header-bell">
				<img  src="../../assets/images/bell.png" />
			</div>
			<div class="user-icon">
				<img src="../../assets/images/user.png" alt="">
			</div>
			<span>用户名</span>
			<span>
				<router-link to="/" v-on:click.native="loginout" tag="small">退出登录</router-link>
			</span>
		</div>
	</div>
</template>

<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		data() {
			return {
			}
		},
		methods: {
	      	slideToggle: function(){
	      		// if(this.active == ''){
	      		// 	this.active = 'active';
	      		// }else{
	      		// 	this.active = '';
	      		// }
	      		this.$emit("slideHandle");
	      	},
	      	loginout: function(){
	      		this.$confirm('此操作将移除您的登录状态, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	this.confirmLoginOut();
		        })
	      		
	      	},
	      	confirmLoginOut: async function(){
	      		var res = await loading(AJAX.post("login/loginout"));
	      		this.$router.push({
	      			name: 'login'
	      		})
	      	}
	    },
	    props: [
	    	'active'
	    ]
	}
</script>

<style lang="scss">
	.mini-mode .header-wrapper .header-slider{
		transform: rotateY(180deg);
	}

	.header-wrapper{
		height: 48px;
		width: 100%;
		color: #a2a2a2;
	    font-size: 13px;
	    font-weight: bold;
	    color: #868686;
	    background: #ffffff;
	    .header-slider{
	    	width: 20px;
	    	height: 20px;
	    	display: inline-block;
	    	background: url("../../assets/images/stop.png");
	    	margin: 14px 30px;
	    	cursor: pointer;
			transition: transform .5s ease;
	    }
	    .header-right{
	    	float: right;
	    	text-align: right;
	    	height: 24px;
	    	padding: 12px 21px;
	    	.user-icon{
	    		width: 24px;
	    		height: 24px;
	    		border-radius: 50%;
	    		display: inline-block;
	    		overflow: hidden;
	    		margin: 0 5px 0 10px;
	    	}
	    	span{
	    		position: relative;
	    		top: -5px;
	    		color: rgba(0,0,0,0.65);
	    		small{
	    			color: #898989;
	    			cursor: pointer;
	    			margin: 0 6px;
	    			&:hover{
	    				color: #868686;
	    			}
	    		}
	    	}
	    	.header-bell{
	    		width: 16px;
	    		height: 16px;
	    		display: inline-block;
	    		overflow: hidden;
	    		margin: 0 5px 0 10px;
	    		position: relative;
	    		top: -3px;
	    	}
	    }
	}
</style>
