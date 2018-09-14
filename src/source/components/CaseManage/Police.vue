<template>
		<!-- 处警人选择
		1.页面active时刷新已存在的police list
		2.添加、修改、删除时调用后台接口，接口成功之后本页处理数据，不刷新police list（注意返回的ID处理）
		3.编辑时 在active之后需要加载已勾选的数据，联动处理
		4.页面关闭清空数据
		5.type说明  1已保存 2编辑中 3新添加 -->

	<div class="case-wrapper union-police-wrapper" :class="activeClass+' '+animationClass">
		<div class="case-content">
			<case-header @closeFormMood="close" :title="title"></case-header>
			<div class="case-info-body">
				<el-table
					ref="multipleTable"
					:data="list"
					tooltip-effect="dark"
					@selection-change="selectChange">
					<el-table-column type="selection" label="全选"  width="45"></el-table-column>
                    <el-table-column type="index" label="序号"  width="50"></el-table-column>
                    <el-table-column label="姓名"  width="115">
						<template slot-scope="scope">
							<span v-if="scope.row.type == 1">{{ scope.row.name }}</span>
							<input v-else type="text" maxlength="10" v-model="scope.row.name" />
						</template>
                    </el-table-column>
                    <el-table-column label="警号">
						<template slot-scope="scope">
							<span v-if="scope.row.type == 1">{{ scope.row.policeCode }}</span>
							<input v-else type="text" maxlength="20" v-model="scope.row.policeCode" />
						</template>
                    </el-table-column>
                    <el-table-column label="身份证号">
						<template slot-scope="scope">
							<span v-if="scope.row.type == 1">{{ scope.row.idCard }}</span>
							<input v-else type="text" maxlength="20" v-model="scope.row.idCard" />
						</template>
                    </el-table-column>
                    <el-table-column label="手机号码">
						<template slot-scope="scope">
							<span v-if="scope.row.type == 1">{{ scope.row.phone }}</span>
							<input v-else type="text" maxlength="15" v-model="scope.row.phone" />
						</template>
                    </el-table-column>
                    <el-table-column label="邮箱">
						<template slot-scope="scope">
							<span v-if="scope.row.type == 1">{{ scope.row.email }}</span>
							<input v-else type="text" maxlength="30" v-model="scope.row.email" />
						</template>
                    </el-table-column>
                    <el-table-column label="操作" width="115">
						<template slot-scope="scope">
							<el-button v-if="scope.row.type == 1" size="mini" @click="edit(scope.$index,scope.row)">编辑</el-button>
						 	<el-button v-if="scope.row.type != 1" size="mini" @click="save(scope.$index,scope.row)">保存</el-button>
						 	<el-button size="mini" @click="del(scope.$index,scope.row)">删除</el-button>
						</template>
                    </el-table-column>
				</el-table>
				<div class="police-add-btn" @click="add">＋</div>
			</div>
			<div class="btn-wrapper">
				<span class="btn active" @click="confirm">确定</span>
				<span class="btn" @click="close">取消</span>
			</div>
		</div>
		<back-mood @closeFormMood="close"></back-mood>
	</div>
</template>
<script>
	import AJAX, { loading, CancelToken, transformRequest } from 'ajax'
	import { backMood, caseHeader, caseTypeSelect } from './index/index.js'
	import { tyCheckNull, tyCheckBlank, tyCheckLength } from '../../../config/global.js'
	
	export default {
		props: {
			data: {
				type: Array,
				required: false
			},
			activeClass: {
				type: String,
				required: true
			},
		},
		components: {
			'back-mood': backMood,
			'case-header': caseHeader,
			'case-type-select': caseTypeSelect
		},
		data () {
			return {
				selected: [],
				addmap: '',
				animationClass: '',
				title: '添加非系统人员',
				list: [],
				multipleSelection: []
			}
		},
		methods: {
			reset: async function(){
			 	this.$refs.multipleTable.clearSelection();
				this.list = [];
			},
			add: async function(){
				this.list.push({
					type: 3,
					rid: '',
					name: "",
					policeCode: "",
					idCard: "",
					phone: "",
					email: "",
				})
			},
			del: async function(index, row){
				if(row.type != 3){
					await loading(AJAX.post('custPolice/delete',{
						rid: row.rid
					}))
				}
				this.list.splice(index, 1);
			},
			//	数据验证处理
			checkData: async function(row){
				let checkname = tyCheckNull({name: '姓名',value: row.name}),
					checkpolice = tyCheckNull({name: '警号',value: row.policeCode}),
					checkidcard = tyCheckNull({name: '身份证号',value: row.idCard}),
					checkphone = tyCheckNull({name: '手机号码',value: row.phone}),
					checkemail = tyCheckNull({name: '邮箱',value: row.email})

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
				}else if(checkidcard){
					this.$message({
						type: 'warning',
						message: checkidcard
					})
					return Promise.reject(checkpolice);
				}else if(checkphone && checkemail){
					this.$message({
						type: 'warning',
						message: "手机号码与邮箱不能同时为空！"
					})
					return Promise.reject("手机号码与邮箱不能同时为空！");
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
					policeCode: row.policeCode,
					idCard: row.idCard,
					phone: row.phone,
					email: row.email,
				}))
				this.$message({
					type: 'success',
					message: '保存成功！'
				})
				this.list[index].type = 1;
				this.list[index].rid = res.result;

				this.$refs.multipleTable.toggleRowSelection(this.list[index]);
			},
			edit: async function(index, row){
				this.$set(this.list, index, Object.assign({}, this.list[index], {type: 2}))
			},
			confirm: function(){
				let dest = [];
				this.selected.map(e => {
					dest.push(e.rid);
				})
				this.$emit("refreshHandle",dest);
				console.log(dest);
				this.close();
			},
			close: function(e){
				let _this = this;
				this.animationClass = 'mov-top';
				setTimeout(function(){
					_this.reset();
					_this.$emit("closeHandle",e);
				},300);
			},
			selectChange: function(e){
				this.selected = e;
			},
			toggleSelection(rows) {
				console.log(rows);
	          	rows.forEach(row => {
		            this.$refs.multipleTable.toggleRowSelection(this.list[row]);
	          	});
	      	},
		},
		watch: {
			activeClass: async function(){
				let _this = this;
				if(this.activeClass === 'active'){
					this.animationClass = '';
					let { result } = await loading(AJAX.post('custPolice/list'));
					this.list = result
					this.list.map(e => {
						if(!e.type){
							e.type = 1;
						}
					})
					if(!!this.data && this.data.length != 0){
						let arr = this.data,sel = []
						this.list.map((e, index) => {
							arr.map(i => {
								if(e.rid == i){
									sel.push(index)
								}
							})
						})
						setTimeout(function(){
							_this.toggleSelection(sel);
						})
					}
				}
			},
		},
	}
</script>
<style lang="scss">
	@import "../../../assets/scss/modal.scss";

	.union-police-wrapper{
		&>.case-backmood{
			z-index: 11!important;
		}
		&>.case-content{
			z-index: 20!important;
		}
		.el-table{
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
					}
				}
			}
		}
	}

	.case-wrapper.union-police-wrapper{
		.case-content{
			width: 1018px;
			height: 580px;
			.case-info-body{
				overflow: hidden;
				height: 466px;
				.el-table{
					width: calc(100% - 20px);
					margin: 10px 10px 0;
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
</style>