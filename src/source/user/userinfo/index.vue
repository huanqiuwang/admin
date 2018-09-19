<template>
	<div class="user-info-wrapper">
		<div class="user-info-cont">
			<div class="user-info-item">
				<span>用户名：</span>
				<span>{{testData.username}}</span>
			</div>
			<div class="user-info-item">
				<span>注册时间：</span>
				<span>{{hqDateFormat1(testData.username)}}</span>
			</div>
			<div class="user-info-item">
				<span>状态：</span>
				<span>{{testData.status==1?'启用':'禁用'}}</span>
			</div>
			<div class="user-info-item">
				<span>身份证号：</span>
				<span>{{testData.idcard}}</span>
			</div>
			<div class="user-info-item">
				<span>警号：</span>
				<span>{{testData.policeId}}</span>
			</div>
			<div class="user-info-item">
				<span>手机号码：</span>
				<span v-if="!phoneAlter">{{testData.phone}} <label @click="alterphone">修改</label></span>
				<input v-if="phoneAlter" type="text" v-model="testData.phone" />
				<label class="user-info-label" v-if="phoneAlter" @click="savephone">保存</label>
			</div>
			<div class="user-info-item">
				<span>所在部门：</span>
				<span>{{testData.department}}</span>
			</div>
			<div class="user-info-item">
				<span>所属组：</span>
				<span>{{testData.group}}</span>
			</div>
			<div class="user-info-item">
				<span>邮箱：</span>
				<span v-if="!emailAlter">{{testData.email}} <label @click="alteremail">修改</label></span>
				<input v-if="emailAlter" type="text" v-model="testData.email" />
				<label class="user-info-label" v-if="emailAlter" @click="saveemail">保存</label>
			</div>
			<div class="user-info-item">
				<span>备注：</span>
				<span>{{testData.remark}}</span>
			</div>
			<div class="user-info-item">
				<span>账户密码：</span>
				<span>********<label @click="alterpass">修改</label></span>
			</div>
		</div>

		<alter-pass
			@closeHandle="closePass"
			:activeClass="showPassClass"></alter-pass>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import alterpass from './alterpass.vue'

	export default {
		components: {
			'alter-pass': alterpass
		},
		data () {
			return {
				showPassClass: 'hidden',
				testData: {
					username: "高德地图",
					registerTime: 1582546124,
					status: '1',
					idcard: 4566418522102475941,
					policeId: 1131153153,
					phone: 13566552225,
					department: '小卖部',
					group: '系统管理，设备管理',
					email: '1as56d@as56d.com',
					remark: 'test',
				},
				emailAlter: false,
				phoneAlter: false 
			}
		},
		methods: {
			alterphone: function(){
				this.phoneAlter = true;
			},
			savephone: function(){
				this.phoneAlter = false;
			},
			alteremail: function(){
				this.emailAlter = true;
			},
			saveemail: function(){
				this.emailAlter = false;
			},
			alterpass: function(){
				this.showPassClass = 'active';
			},
			closePass: function(){
				this.showPassClass = 'hidden';
			}
		}
	}
</script>
<style lang="scss">
	.user-info-wrapper{
		text-align: center;
		padding: 50px 0 0;
		.user-info-cont{
			width: 600px;
			display: inline-block;
			.user-info-item{
				padding: 10px 0;
				overflow: hidden;
				span{
					float: left;
					line-height: 30px;
				}
				&>span:nth-child(1){
					width: 150px;
					text-align: right;
					color: #999999;
					margin-right: 20px;
				}
				&>span:nth-child(2){
					width: 350px;
					text-align: left;
					color: #323232;
				}
				input{
					width: 350px;
					height: 32px;
					line-height: 32px;
					border-radius: 3px;
					border: 1px solid #d2d2d2;
					padding-left: 10px;
					float: left;
				}
				label{
					color: #1890ff;
					cursor: pointer;
					margin-left: 5px;
					line-height: 30px;
					&.user-info-label{
						position: relative;
						left: -18px;
					}
				}
			}
		}
	}
</style>