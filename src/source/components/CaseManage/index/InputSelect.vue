<template>
	<!-- 案件布控-添加出警人 -->
	<div class="input-select">
		<div class="show-input">
			<div class="select-item" v-for="(item,ind) in selected">
				<span v-text="item.name"></span>
				<i @click="del(ind)">×</i>
			</div>
			<input placeholder="搜索" class="search-input" type="text" @focus="showDatalist" @blur="closeDatalist" v-model="search" >
		</div>
		<div class="data-list" :class="dataListClass">
			<div class="data-item" v-for="(item,ind) in datalist" :class="item.active?'':'hidden'" @click="add(ind)">
				<span v-text="item.name"></span>
			</div>
			<div class="screen-backmood" @click="hideDatalist"></div>
		</div>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

	export default {
		props: {
			// datalist: {
			// 	type: Array,
			// 	required: true
			// }
			defaultData: {
				required: false
			},
		},
		data () {
			return {
				datalist: [],
				selected: [],
				dataListClass: 'hidden',
				search: '',
			}
		},
		watch: {
			search: function(){
				var _this = this;
				// this.key = this.search
				this.datalist.filter(e => {
					if(e.name.indexOf(this.search) == -1){
						e.active = false;
					}else{
						e.active = true;
					}
				});
			},
			selected: function(){
				this.$emit("selected",this.selected);
			},
			//	存在系统处警人时，清空插件，先查库，然后渲染页面上面的数据
			defaultData: async function(){
				await this.reset();
				if(this.defaultData.length >= 1){
					for(let i = this.datalist.length - 1;i >= 0;i--){
						this.datalist[i].active = 'active';
						if(this.defaultData.find(n => n.uuid == this.datalist[i].uuid)){
							this.add(i);
						}
					}
				}
			}
		},
		methods: {
			reset: async function(){
				let { result } = await loading(AJAX.post('user/search'));
				this.datalist = result;
				this.datalist.map(e => e.active = 'active');
				this.selected = [];
			},

			//	显示数据列表
			showDatalist: function(){
				if(this.datalist.length != 0){
					this.dataListClass = 'active'
				}
			},
			hideDatalist: function(){
				this.dataListClass = 'hidden';
			},
			closeDatalist: function(){
				let _this = this;
				setTimeout(function(){
					_this.hideDatalist();
				},300);
			},

			//	选择数据列表到input
			add: function(index){
				this.search = '';
				this.datalist[index].active = 'active';
				this.selected.push(this.datalist[index]);
				this.datalist.splice(index,1);
				this.hideDatalist();
			},
			del: function(index){
				this.datalist.push(this.selected[index]);
				this.selected.splice(index,1);
			}
		},
		created: async function(){
			this.reset();
		}
	}
</script>
<style lang="scss">
	.input-select{
		position: relative;
		width: 400px;
		height: auto;
		.show-input{
			padding-right: 6px;
			width: 426px;
			position: relative;
			z-index: 2;
			border: 1px solid #dedede;
			border-radius: 3px;
			margin: 0 5px;
			outline: none;
			text-align: right;
			overflow: hidden;
			.select-item{
				position: relative;
				user-select: none;
				height: 28px;
				padding: 0 25px 0 5px;
				line-height: 28px;
				background: #d8e6f9;
				border-radius: 4px;
				transform: scale(.9);
				font-size: 16px;
				float: left;
				margin: 3px 0 0;
				z-index: 5;
				i{
					position: absolute;
					right: 5px;
					top: 1px;
					font-size: 24px;
					cursor: pointer;
				}
			}
			.search-input{
				border: none;
				background: transparent;
				outline: none;
				height: 32px;
				width: 120px;
				float: left;
				padding-left: 5px;
			}
		}
		.data-list{
			position: absolute;
			width: calc(100% - 5px);
			top: calc(100% - 1px);
			left: 5px;
			border-radius: 2px;
			border: 1px solid #dfdfdf;

			background: #ffffff;
			max-height: 170px;
			overflow-y: auto;
			margin-bottom: 30px;
		    z-index: 10;
			.data-item{
				height: 32px;
				line-height: 32px;
				padding-left: 10px;
				cursor: pointer;
				&:hover{
					background: #def9c8;
				}
			}
		}
	}
</style>