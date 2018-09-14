<template>
	<div class="extra-query" :class="activeClass">
		<div class="extra-query-item" v-for="(item,ind) in listData" :key="item.id">
			<span class="extra-label">选择地点：</span>
			<input type="text" placeholder="请选择地点" v-model="item.place" readonly v-on:click="choosePlace(ind)" />

			<span class="extra-label">开始时间：</span>
			<el-date-picker
		      	v-model="item.startTime"
		      	type="datetime"
		      	placeholder="选择日期时间"
		      	@change="timeChange('start')">
		    </el-date-picker>
		    <span class="extra-label">结束时间：</span>
			<el-date-picker
		      	v-model="item.endTime"
		      	type="datetime"
		      	placeholder="选择日期时间"
		      	@change="timeChange('end')">
		    </el-date-picker>
		    <small class="el-icon-circle-plus" v-on:click="addRow"></small>
		    <small class="el-icon-remove" v-on:click="deleteRow(ind)"></small>
		</div>
	</div>
</template>
<script>
	export default {
		name: "datelist",
		data() {
			return {

			}
		},
		methods: {
			choosePlace: function(e){
	      		this.$emit("chooseEvents",e);
	      	},

	      	//	点击增加一条记录
	      	addRow: function(){	
	      		var now = new Date(),
	      			last = new Date();
	   				last = last.setTime(now.getTime() - 3600 * 1000 * 2);
	   			if(this.listData.length >= 5){
	   				this.$message({
	   					message: '最多只能添加5条查询条件！'
	   				})
	   			}else{
		    		this.listData.push({
	    			 	startTime: new Date(last),
	                    endTime: now,
	                    place: '',
	                    deviceId: ''
		    		});
		    	}
	    	},

	    	//	点击删除一条记录
	    	deleteRow: function(e){		
	    		var max = this.listData.length;
	    		if(max == 2){
	    			this.$message("至少保留两项！")
	    		}else{
	    			for(var i = e;i<max-1;i++){
		    			this.listData[i] = this.listData[i+1];
		    		}
		    		this.listData.pop();
	    		}
	    	},
	    	timeChange: function(mark){
	    		var _this = this,time;
	    		this.listData.map((e,i) => {
					if(e.startTime>e.endTime && _this.isDateTimeFormat(e.startTime) && _this.isDateTimeFormat(e.endTime)){
						_this.$message("开始时间不能晚于结束时间！");
						if(mark === 'start'){
							time = Date.parse(e.endTime) - 1000 * 60 * 60 * 24 * 7;
							e.startTime = new Date(time);
						}else if(mark == 'end'){
							time = Date.parse(e.startTime) + 1000 * 60 * 60 * 24 * 7;
							e.endTime = new Date(time);
						}
						return false;
					}
				})
	    	},

	    	isDateTimeFormat: function(e){
	    		if((Date.parse(e)+'').length == 13){
	    			return true
	    		}else{
	    			return false;
	    		}
	    	}
		},
		props: {
			activeClass: {
				type: String,
				require: true
			},
			listData: {
				type: Array,
				require: true
			}
		},
		watch: {
			
			//	数据重置时调用
			listData: function(){
				if(this.listData.length == 0){
					this.addRow();
					this.addRow();
				}
			}
		},
		mounted: function(){
			this.addRow();
			this.addRow();
		}
	}
</script>
<style lang="scss">
	$active-color: #1890ff;

	.extra-query{
		margin-bottom: 10px;
		padding: 8px 0;
    	background: #f3f3f3;
		display: none;
		&.active{
			display: block;
		}
		.extra-query-item{
			padding: 10px;
			input{
				width: 230px;
				height: 32px;
				border-radius: 3px;
				border: 1px solid #d2d2d2;
				padding: 0 10px;
				&.el-input__inner{
					padding-left: 30px;
					height: 34px;
					line-height: 34px;
				}
			}
			span.el-input__prefix,span.el-input__suffix{
				top: -3px;
			}
			span.extra-label{
				display: inline-block;
				width: 90px;
            	text-align: right;
			}
			small{
				font-size: 30px;
				color: #aaaaaa;
				display: inline-block;
				position: relative;
				top: 6px;
				left: 20px;
				cursor: pointer;
				&.el-icon-remove:hover{
					color: #f36a6a;
				}
				&.el-icon-circle-plus:hover{
					color: $active-color;
				}
			}
		}	
	}
</style>