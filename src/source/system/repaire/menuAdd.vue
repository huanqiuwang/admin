<template>
	<!-- 添加案件 -->
	<div class="case-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content menu-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<div class="case-info-main">
					<div class="case-input-list">
						<div class="case-input-item" v-if="data.type=='add'">
							<span><b>*</b>菜单标识：</span>
							<input type="text" v-model="menuMark" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>菜单名称：</span>
							<input type="text" v-model="menuName" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>菜单URL：</span>
							<input type="text" v-model="menuURL" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>排序：</span>
							<input type="number" v-model="sort" placeholder="请输入" :maxlength="max.COMMON" />
						</div>
						<div class="case-input-item">
							<span><b>*</b>父菜单：</span>
							<el-select v-model="parent" placeholder="请选择">
							    <el-option
							        v-for="item in options"
  							        :key="item.value"
  							        :label="item.label"
  							        :value="item.value">
							    </el-option>
						  	</el-select>
						</div>
					</div>
					<div class="case-table-list">
						<h4>权限设置</h4>
						<el-table
							ref="multipleTable"
							:data="list"
							tooltip-effect="dark">
		                    <el-table-column type="index" label="序号"  width="50"></el-table-column>
		                    <el-table-column label="权限名称">
								<template slot-scope="scope">
									<span v-if="scope.row.type == 1">{{ scope.row.name }}</span>
									<input v-else type="text" maxlength="20" v-model="scope.row.name" />
								</template>
		                    </el-table-column>
		                    <el-table-column label="URL">
								<template slot-scope="scope">
									<span v-if="scope.row.type == 1">{{ scope.row.URL }}</span>
									<input v-else type="text" maxlength="30" v-model="scope.row.URL" />
								</template>
		                    </el-table-column>
		                    <el-table-column label="操作" width="145">
								<template slot-scope="scope">
									<el-button v-if="scope.row.type == 1" size="mini" @click="edit(scope.$index,scope.row)">编辑</el-button>
								 	<el-button v-if="scope.row.type != 1" size="mini" @click="save(scope.$index,scope.row)">保存</el-button>
								 	<el-button size="mini" @click="del(scope.$index,scope.row)">删除</el-button>
								</template>
		                    </el-table-column>
						</el-table>
						<div class="police-add-btn" @click="add">＋ 新增权限</div>
					</div>
				</div>
			</div>
			<div class="btn-wrapper">
				<span class="btn active" @click="add">添加</span>
				<span class="btn" @click="close">关闭</span>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import {backMood, caseHeader, caseTypeSelect, tip} from '../../components/common/TYbox/index.js'
	import { tyCheckNull, tyCheckBlank, tyCheckLength } from '../../../config/global.js'
	import { MAX } from '../../../config/global.js'
	
	export default {
		props: {
			data: {
				type: Object,
				required: false,
				default: e => {}
			},
			activeClass: {
				type: String,
				required: true
			},
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
			'case-type-select': caseTypeSelect,
			'error-tip': tip
		},
		data () {
			return {
				animationClass: '',
				title: '添加菜单',
				addAjaxData: {
		        
		        },
		        max: MAX,
				menuMark: "",
				menuName: "",
				menuURL: "",
				sort: "",
				parent: "",
				options: [{
		            value: '选项1',
		            label: '黄金糕'
		        }, {
		            value: '选项2',
		            label: '双皮奶'
		        }, {
		            value: '选项3',
		            label: '蚵仔煎'
		        }, {
		            value: '选项4',
		            label: '龙须面'
		        }, {
		            value: '选项5',
		            label: '北京烤鸭'
		        }],
		        list: [],
			}
		},
		methods: {
			reset: function(){
			},
			add: async function(){
				this.list.push({
					type: 3,
					rid: '',
					name: "",
					url: ""
				})
			},
			edit: async function(index, row){
				this.$set(this.list, index, Object.assign({}, this.list[index], {type: 2}))
			},
			//	数据验证处理
			checkData: async function(row){
				let checkname = tyCheckNull({name: '权限名称',value: row.name}),
					checkpolice = tyCheckNull({name: 'URL',value: row.url})

				if(checkname){
					this.$message({
						type: 'warning',
						message: checkname
					})
					return Promise.reject(checkname);
				}else if(checkpolice){
					this.$message({
						type: 'warning',
						message: checkpolice
					})
					return Promise.reject(checkpolice);
				}
			},
			save: async function(index, row){
				let url = '';
				await this.checkData(row);
				if(this.list[index].type == 2){
					url = 'custPolice/update';
				}else{
					url = 'custPolice/insert';
				}
				let res = await loading(AJAX.post(url,{
					rid: row.rid || 0,
					name: row.name,
					url: row.url
				}))
				this.$message({
					type: 'success',
					message: '保存成功！'
				})
				this.list[index].type = 1;
				this.list[index].rid = res.result;

				this.$refs.multipleTable.toggleRowSelection(this.list[index]);
			},
			del: async function(index, row){
				if(row.type != 3){
					await loading(AJAX.post('custPolice/delete',{
						rid: row.rid
					}))
				}
				this.list.splice(index, 1);
			},
			close: function(e){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.$emit("closeHandle",e);
				},300);
			}
		},
		watch: {
			activeClass: function(){
				if(this.activeClass === 'active'){
					this.animationClass = '';
					if(this.data.type === 'add'){
						this.title = '添加菜单';
						this.reset();
					}else if(this.data.type === 'edit'){
						this.title = '编辑菜单';
					}
				}
			},
		}
	}
</script>
<style lang="scss">
	@import "../../../assets/scss/modal.scss";

	.case-wrapper{
		.case-content{
			&.menu-content{
				.case-info-body{
					overflow-y: auto;
					.case-input-item{
						&>span:nth-child(1){
							line-height: 32px;
						}
						.el-input__inner{
							height: 34px;
							line-height: 34px;
						}
					}
					.case-table-list{
						h4{
							padding-left: 10px;
						}
						.el-table{
							width: calc(100% - 20px);
							margin: 10px 10px 0;
							.el-table__body-wrapper{
								max-height: 350px;
								overflow-y: auto;
							}
							.el-table__empty-block{
								display: none;
							}
							table{
								tr{
									td{
										input{
											width: calc(100% - 4px);
										}
										.el-button{
											border: none;
											border-right: 1px solid #1890ff;
											border-radius: 0px;
											margin: 5px 10px 5px 0px;
											padding: 0 12px 0 0;
											background: transparent;
											&:last-child{
												border: none!important;
											}
										}
									}
								}
							}
						}
						.police-add-btn{
							width: calc(100% - 22px);
							margin: 0 10px;
							border: 1px dashed #1890ff;
							color: #1890ff;
							text-align: center;
							height: 38px;
							line-height: 38px;
							font-size: 24px;
							cursor: pointer;
							&:hover{
								background: rgba(0,0,0,.05);
							}
						}
					}
				}
			}
		}
	}
</style>