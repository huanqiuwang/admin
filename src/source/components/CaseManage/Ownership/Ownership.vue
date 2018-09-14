<template>
	<!-- 省市联动选择器 -->
	<div class="owner-wrapper">
		<div>
			<el-cascader
			    expand-trigger="hover"
			    :options="options"
			    v-model="selectedOptions"
			    @change="handleChange"
			    :props="props">
		  	</el-cascader>
		</div>
	 	<div class="address-list">
	 		<div class="address-item" v-for="(item,index) in list">
	 			<span>{{item.name}}</span>
	 			<i @click="del(index)">-</i>
	 		</div>
	 	</div>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		props: {
			defaultData: {
				required: false
			}
		},
		data () {
			return {
				props: {
					value: 'rid',
					label: 'city',
					children: 'cityList'
				},
				list: [],
				options: [],
		        selectedOptions: [],
		        selectNow: ''
			}
		},
		methods: {
			add: function(){
				if(!!this.selectNow.rid && !this.list.find(e => e.rid == this.selectNow.rid)){
					this.list.push(this.selectNow);
					this.selectedOptions = [];
				}
			},
			del: function(index){
				this.list.splice(index,1);
			},
			handleChange(value) {
				if(!!value){
					let { provinceName, cityName } = this.getTextFromList(value);
					this.selectNow = {
						rid: value[1],
						name: provinceName + '/' + cityName
					}
					this.add();
				}else{
					this.selectNow = {
						rid: '',
						name: ''
					}
				}
	      	},
	      	loadData: async function(){
	      		let res = await loading(AJAX.post("province/city/all"));
	      		this.options = this.CityJosnFormat(res.result);
	      	},
	      	CityJosnFormat: function(list){
	      		if(list.length == 0){
	      			return list;
	      		}else if(!!list.length){
	      			for(let i = 0;i<list.length;i++){
	      				list[i].city = list[i].province;
	      				list[i].rid = '1010'+i;
	      			}
	      		}
	      		return list;
	      	},
	      	//	根据选择的id获取省份城市名字，只能两级联动
	      	getTextFromList: function([provID,cityID]){
	      		let provinceName = '',
	      			cityName = '';
	      		this.options.map(e => {
	      			if(e.rid == provID){
	      				provinceName = e.province;
	      				e.cityList.map(item =>{
	      					if(item.rid == cityID){
	      						cityName = item.city;
	      					}
	      				})
	      			}
	      		})
	      		return {
	      			provinceName: provinceName,
					cityName: cityName
	      		}
	      	},
	      	getTextFromCityId: function(cityID){
	      		let provinceName = '',
	      			cityName = '';
	      		this.options.map((e,i) => {
      				e.cityList.map(item =>{
      					if(item.rid == cityID){
      						cityName = item.city;
      						provinceName = e.city;
      					}
      				})
	      		})
	      		return {
	      			provinceName: provinceName,
					cityName: cityName
	      		}
	      	}
		},
		watch: {
			list: function(){
				let arr = [];
				this.list.map(e => arr.push(e.rid));
				this.$emit("refreshData",arr);
			},
			defaultData: function(){
				if(!this.defaultData || !this.defaultData.length){
					this.list = [];
				}else{
					let arr = this.defaultData,dest = [],provCityName;
					arr.map(e => {
						provCityName = this.getTextFromCityId(e);
						dest.push({
							rid: e,
							name: provCityName.provinceName + '/' + provCityName.cityName
						})
					})
					this.list = dest;
				}
			}
		},
		mounted: function(){
			this.loadData();
		}
	}
</script>
<style lang="scss">
	.owner-wrapper{
		width: 600px;
		padding-bottom: 100px;
		.el-cascader{
			div{
				input{
					height: 34px;
				}
			}
		}
		.btn{
			height: 32px;
			padding: 0 20px;
			line-height: 32px;
			background: #1890ff;
			color: #ffffff;
		}
		.address-list{
			width: 100%;
			overflow: hidden;
			.address-item{
				float: left;
				margin: 10px 10px 0 0;
				background: #f5f5f5;
				border: 1px solid rgba(0,0,0,0.15);
				border-radius: 4px;
				width: 121px;
				height: 30px;
				text-align: center;
				position: relative;
				i{
					position: absolute;
					right: -5px;
				    top: -5px;
				    width: 12px;
				    height: 12px;
				    background: #ff5454;
				    border-radius: 50%;
				    line-height: 10px;
				    color: white;
				    cursor: pointer;
				}
			}
		}
	}
</style>