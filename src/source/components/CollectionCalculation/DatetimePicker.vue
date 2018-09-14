<template>
	<div class="calculate-wrapper" :class="showDatepicker">
		<div class="calculate-content">
			<div class="calculate-header">
				{{title}}
			</div>
			<div class="calculate-body">
				<div class="calculate-basic">
					<device-picker class="value" v-model="place" />
					<el-date-picker
				      	v-model="datetime"
				      	:type="datetype"
				      	:picker-options="pickerOptions2"
				      	range-separator="至"
				      	start-placeholder="开始日期"
				      	end-placeholder="结束日期"
				      	align="right">
				    </el-date-picker>

					<el-time-picker
					 	v-if="showExtra === 'active'"
					    is-range
					    v-model="time"
					    range-separator="至"
					    start-placeholder="开始时间"
					    end-placeholder="结束时间"
					    placeholder="选择时间范围">
				  	</el-time-picker>
				    <button class="calculate-btn" @click="add" v-if="showExtra === 'active'">添加</button>
				</div>
				<el-checkbox class="calculate-checkbox" v-model="checked">日时间段统计（可选）</el-checkbox>
				<div class="calculate-more" v-if="showExtra === 'active'">
					<el-table 
						:data="data"
						@cell-click="deleteHandle">
			        	<el-table-column type="index" label="序号"></el-table-column>
			        	<el-table-column prop="time" label="日时间段">
							<template slot-scope="scope">
								<span>{{scope.row.stime + '-' + scope.row.etime}}</span>
							</template>
			        	</el-table-column>
			        	<el-table-column label="操作" prop="delete">
							<template slot-scope="scope">
								<span class="calculate-delete">删除</span>
							</template>
			        	</el-table-column>
			      	</el-table>
				</div>
			</div>
			<div class="calculate-footer">
				<span class="calculate-btn active" @click="commit">保存</span>
				<span class="calculate-btn" @click="close">关闭</span>
			</div>
		</div>
		<div class="calculate-backmood"></div>
	</div>
</template>
<script>
	import DevicePicker from '../DevicePicker'

	const getInitTime = () => {
	    let start = new Date()
	    let end = new Date()
	    start.setDate(start.getDate() - 1)
	    start.setHours(0)
	    start.setMinutes(0)
	    start.setSeconds(0)
	    end.setHours(23)
	    end.setMinutes(59)
	    end.setSeconds(59)
	    return [start, end]
  	}

	export default {
		props: {
			title: {
				type: String,
				default: '添加条件'
			},
			showDatepicker: {
				type: String,
				default: 'hidden'
			}
		},
		components: {
	      	'device-picker': DevicePicker
	    },
		data () {
			return {
				place: [],
				time: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 9, 0)],
				data: '',
				datetype: 'datetimerange',
				checked: false,
				data: [],
				showExtra: 'hidden',
				datetime: getInitTime(),
				pickerOptions2: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
			}
		},
		methods: {
			deleteHandle: function(row, column, cell, event){
				if(column.label == "操作"){
					this.data.splice(row.index,1);
				}
			},
			add: function(){
				let stime = this.hqDateFormat(Date.parse(this.time[0])).split(' ')[1],
					etime = this.hqDateFormat(Date.parse(this.time[1])).split(' ')[1];
				if(this.data.length !== 0){
					for(let i = 0;i<this.data.length;i++){
						if(stime>this.data[i].etime || etime<this.data[i].stime){
							continue;
						}else{
							this.$message({
								message: "存在重复时间段！",
								type: "warning"
							});
							return false;
						}
					}
				}
				this.data.push({
					stime: stime,
					etime: etime,
					index: ''
				});
			},
			commit: function(){
				// 优先检查额外条件是否被勾选，如果未勾选则忽略额外的数据
				if(this.showExtra === 'hidden'){
					this.$emit("commitHandle",{
						locations: this.place,
						start: this.hqDateFormat(Date.parse(this.datetime[0])),
						end: this.hqDateFormat(Date.parse(this.datetime[1])),
						time: []
					});
				}else{									
					this.$emit("commitHandle",{
						locations: this.place,
						start: this.hqDateFormat(Date.parse(this.datetime[0])).split(' ')[0],
						end: this.hqDateFormat(Date.parse(this.datetime[1])).split(' ')[0],
						time: this.timeFormat(this.data)
					});
				}
				this.close();
			},
			close: function(){
				this.$emit("closeHandle");
			},
			timeFormat: function(e){
				var json = [];
				for(let i = 0;i<e.length;i++){
					json.push(e[i].stime+'-'+e[i].etime);
				}
				return json;
			}
		},
		watch: {
			checked: function(){
				if(!this.checked){
					this.showExtra = 'hidden';
					this.datetype = 'datetimerange';
				}else{
					this.showExtra = 'active';
					this.datetype = 'daterange';
				}
			},
			data: function(){		//	在改变数组长度的时候为data重新刷新index的值，方便删除的时候传值
				for(let i = 0;i< this.data.length;i++){
					this.data[i].index = i;
				}
			}
		}
	}
</script>
<style lang="scss">
	.el-date-editor--timerange.hidden{
		display: none;
	}

	.calculate-wrapper{
		.calculate-content{
			position: fixed;
			width: 1000px;
			height: auto;
			z-index: 10;
			left: calc(50% - 500px);
			top: 10vh;
			background: #ffffff;
			.calculate-header{
				height: 54px;
				line-height: 54px;
				background:#1890ff;
				color: #ffffff;
				padding-left: 20px;
			}
			.calculate-body{
				.calculate-basic{
					padding: 0 0 10px;
					position: relative;
					.calculate-btn{
						color: #ffffff;
						border-radius:4px;
						width: 108px;
						height: 32px;
						border: none;
						margin: 12px;
						background: #1890ff;
						cursor: pointer;
						position: absolute;
						right: 180px;
						top: 48px;
					}
					&>div:nth-child(1){
						background:#ffffff;
						border-radius:4px;
						width: 298px;
						height: 30px;
						margin: 15px 10px;
						display: inline-block;
						position: relative;
					}
					&>div:nth-child(2){
						position: relative;
						top: 4px;
					}
					.el-date-editor{
						height: 32px;
						line-height: 32px;
						i{
						    position: relative;
    						top: -3px;
						}
						span{
						    position: relative;
						    top: -3px;	
						}
					}
					.el-date-editor--timerange{
						position: absolute;
						top: 60px;
						left: 304px;
						margin-left: 20px;
					}
				}
				.calculate-checkbox{
					padding: 0 15px 15px;
				}
				.calculate-more{
					height: 350px;
					overflow: auto;
					width: calc(100% - 30px);
					margin: 0 15px;
				}
			}
			.calculate-footer{
				height: 86px;
				text-align: center;
				.calculate-btn{
					display: inline-block;
					color: #ffffff;
					border-radius:4px;
					width:120px;
					height:36px;
					margin: 12px;
					cursor: pointer;
					outline: none;
					color: #999999;
					border: 1px solid #d2d2d2;
					line-height: 36px;
					font-size: 13px;
					&.active{
						background:#1890ff;
						color: #ffffff;
					}
				}
			}
		}
		.calculate-backmood{
			position: fixed;
	    	top: 0;
	    	left: 0;
			width: 100%;
	    	height: 100%;
	    	z-index: 5;
	    	background: rgba(0,0,0,.35);
		}
		table{
			.calculate-delete{
				cursor: pointer;
			}
		}
	}
</style>