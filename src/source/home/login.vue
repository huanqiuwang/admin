<template>
	<div class="login-wrapper">
		<div class="login-header-bar">
			<p>客户服务热线：400-060-1213</p>
		</div>
		<div class="login-content">
			<h1>TY6800</h1>
			<div class="login-item">
				<i><img src="../../assets/images/username.png" alt=""></i>
				<input type="text" placeholder="账户" v-model="username" @blur="checkedUser" />
			</div>
			<div class="login-item">
				<i><img src="../../assets/images/lock.png" alt=""></i>
				<input type="password" placeholder="密码" v-model="password" @blur="checkedPass" v-on:keyup="keyLogin($event)" />
			</div>
			<div class="login-btn">
				<router-link class="fr hidden" to="/login" tag="span">忘记密码</router-link>
				<button v-on:click="login">登录</button>
				<router-link class="fr hidden" to="/login" tag="span">注册账户</router-link>
			</div>
		</div>
		<div class="login-footer">
			<p><span>帮助</span><span>隐私</span><span>条款</span></p>
			<p>Copyright © 2018 深圳天彦通讯股份有限公司版权所有</p>
		</div>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		data() {
			return {
				username: '',
				password: '',
				checked: false
			}
		},
		methods: {
			keyLogin: function(e){
				if(e.keyCode == '13'){
					if(!this.username || !this.password){
						return false;
					}else{
						this.permit = '';
						this.login();
					}
				}
			},
			login: async function(){
				if(!this.username){
					this.$message("请输入用户名！")
				}else if(!this.password){
					this.$message("请输入密码！")
				}else{
					let res = await loading(AJAX.post('/login/system/user',{
					name: this.username,
						password: this.password
					}));
					this.$router.push({
						name: "search"
					})
				}
			},
			checkedUser: function(){
				if(!this.username){
					this.$message("请输入用户名！")
				}
			},
			checkedPass: function(){
				if(!this.password){
					this.$message("请输入用户密码！")
				}
			}
		},
		watch: {
			username: function(){
				this.username =  this.trimAll(this.username);
			},
			password: function(){
				this.password =  this.trimAll(this.password);
			}
		},
		mounted: function(){
			
		}
	}
</script>
<style lang="scss">
 	$theme-color: #1890ff;
	.permit{
        -webkit-pointer-events: none;
        pointer-events: none;
        background: #d2d2d2!important;
        color: #ffffff;
        border-color: #d2d2d2;
    }

	.login-wrapper{
		width: 100%;
		height: 100%;
		background: #f0f3f7;
		.login-header-bar{
			background: url("../../assets/images/login-icon.png") no-repeat left,#41628c;
			color: white;
			text-align: right;
			height: 32px;
			line-height: 32px;
			background-position: 30px 4px;
			padding: 0 30px;
			font-size: 13px;
		}
		.login-footer{
			color: rgba(0,0,0,0.45);
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			font-size: 13px;
			p{
				padding: 0 0 15px;
				text-align: center;
				span{
					margin: 0 30px;
					font-size: 14px;
				}
			}
		}
		.login-content{
			width: 624px;
			height: 519px;
			position: fixed;
			left: calc(50% - 312px);
			top: calc(50% - 259.5px);
			background: #ffffff;
			box-shadow:0 2px 22px 7px rgba(25,65,101,0.20);
			h1{
				margin: 90px 0 50px;
				padding: 0;
				text-align: center;
				color:rgba(0,0,0,0.85);
			}
			.login-item{
				width: 366px;
				margin: 20px 128px 0;
				border: 1px solid #d9d9d9;
				height: 38px;
				border-radius: 4px;
				input{
					width: 330px;
					float: right;
					height: 38px;
					border: none;
					outline: none;
				}
				i{
					color: #868686;
					float: left;
					position: relative;
					left: 10px;
					top: 11px;
					user-select: none;
				}
			}
			.login-btn{
				width: 366px;
				margin: 20px 128px 0;
				button{
					width: 100%;
					height: 40px;
					margin: 20px 0;
					appearance: none;
					border: none;
					background: $theme-color;
					border-radius:4px;
					color: #ffffff;
					letter-spacing: 4px;
					cursor: pointer;
				}
				span.fr{
					float: right;
					font-size: 13px;
					color: $theme-color;
				}
			}
		}
	}

</style>