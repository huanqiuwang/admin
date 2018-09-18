<template>
	<div class="menu-wrapper">
		<div class="logo">
			<img src="../../assets/images/logo.png" alt="">
		</div>
        <el-menu
      		default-active="2"
      		class="el-menu-vertical-demo"
	        @open="handleOpen"
	      	@close="handleClose"
	      	background-color="#545c64"
	      	text-color="#fff"
	      	active-text-color="#ffd04b"
	      	:collapse="isCollapse">

			<div v-for="item in menuList" :key="item.id">
				<el-submenu v-if="!!item.children" :index="item.index">
					<template slot="title" >
			          	<i :class="item.icon"></i>
			          	<span>{{item.name}}</span>
			        </template>
					<el-menu-item-group v-if="!!item.children">
			          	<div v-for="item1 in item.children" :key="item.id" :index="item1.index">
							<el-submenu v-if="!!item1.children" :index="item1.index">
								<template slot="title" >
						          	<i :class="item1.icon"></i>
						          	<span>{{item1.name}}</span>
						        </template>
								<el-menu-item-group>
						          	<el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="item2.index" @click="gotoItem(item2.link,item2.name,item2.index)">
										{{item2.name}}
						          	</el-menu-item>
						        </el-menu-item-group>
							</el-submenu>
							<el-menu-item v-else :index="item1.index" @click="gotoItem(item1.link,item1.name,item1.index)">
								<i :class="item1.icon"></i>{{item1.name}}
							</el-menu-item>
			          	</div>
			        </el-menu-item-group>
				</el-submenu>

				<el-menu-item v-else :index="item.index" @click="gotoItem(item.link,item.name,item.index)">
					<i :class="item.icon"></i>
					<span>{{item.name}}</span>
				</el-menu-item>
			</div>
		</el-menu>
	</div>
</template>
<script>
	import '@/assets/css/iconfont.css'
    export default {
        data () {
           return {
           		isCollapse: false,
           		menuList: [
           			// {
           			// 	name: "首页",
           			// 	link: "/",
           			// 	index: '1',
           			// 	icon: "iconfont icon-shouye"
           			// },
           			{
           				name: "系统管理",
           				link: "department",
           				index: 'system/department',
           				icon: "iconfont icon-sousuo",
           				children: [{
           					name: "部门管理",
	           				link: "department",
	           				index: 'system/department',
           				},{
           					name: "组织管理",
	           				link: "group",
	           				index: 'system/group',
           				},{
           					name: "租户管理",
	           				link: "tenant",
	           				index: 'system/tenant',
           				},{
           					name: "系统维护",
	           				link: "repaire",
	           				index: 'system/repaire',
           				}]
           			},{
           				name: "首页",
           				link: "search",
           				index: '/search/default',
           				icon: "iconfont icon-sousuo"
           			},{
           				name: "数据查询",
           				link: "search",
           				icon: "iconfont icon-shujuchaxun",
           				index: '3',
           				children: [
	           				{
	           					name: "IMSI/IMEI",
           						link: "searchImei",
           						index: '/search/imei/list'
	           				},{
	           					name: "MAC查询",
           						link: "searchMac",
           						index: '/search/mac/list'
	           				},{
	           					name: "车牌查询",
           						link: "searchCar",
           						index: '/search/car/list'
	           				},{
	           					name: "人像查询",
           						link: "searchFace",
           						index: '/search/face/list'
	           				},{
	           					name: "区域数据",
           						link: "areaData",
           						index: '/search/areadata/list'
	           				}
           				]
           			},{
           				name: "研判工具",
           				link: "/",
           				icon: "iconfont icon-TYxiaoicon_yanpangongju",
           				index: '4',
           				children: [
	           				{
	           					name: "同行分析",
           						link: "/",
           						index: '4-1',
           						icon: "iconfont icon-tonghangfenxi",
           						children: [
           							{
           								name: "IMSI/IMEI同行",
           								link: 'togetherImei',
           								index: '/determine/together/imei'
           							},{
           								name: "MAC同行",
           								link: 'togetherMac',
           								index: '/determine/together/mac'
           							}
           						]
	           				},{
	           					name: "碰撞分析",
           						link: "/",
           						index: '4-2',
           						icon: "iconfont icon-pengzhuangfenxi",
           						children: [
           							{
           								name: "IMEI/IMSI碰撞",
           								link: "imsiImpact",
           								index: "/determine/impact/imsi"
           							},{
           								name: "MAC碰撞",
           								link: "macImpact",
           								index: "/determine/impact/mac"
           							}
           						]
	           				},{
	           					name: "关联分析",
           						link: "/",
           						index: '4-3',
           						icon: "iconfont icon-guanlianfenxi",
           						children: [
           							{
           								name: "IMSI/IMEI关联MAC",
           								link: 'IjoinM',
           								index: '/determine/imei/join/mac'
           							},{
           								name: "IMSI/IMEI关联车牌",
           								link: 'IjoinC',
           								index: '/determine/imei/join/car'
           							},{
           								name: "MAC关联IMEI/IMSI",
           								link: 'MjoinI',
           								index: '/determine/mac/join/imei'
           							},{
           								name: "MAC关联车牌",
           								link: 'MjoinC',
           								index: '/determine/mac/join/car'
           							},{
           								name: "车牌关联IMSI/IMEI",
           								link: 'CjoinI',
           								index: '/determine/car/join/imei'
           							},{
           								name: "车牌关联MAC",
           								link: 'CjoinM',
           								index: '/determine/car/join/mac'
           							}
           						]
	           				},{
	           					name: "集合运算",
           						link: "/",
           						index: '4-4',
           						icon: "iconfont icon-jiheyunsuan",
           						children: [
           							{
           								name: "IMSI集合运算",
           								link: 'AnalyzeToolIMSICalculation',
           								index: 'map/analyze/imsi/calculation'
           							},{
           								name: "MAC集合运算",
           								link: 'AnalyzeToolMACCalculation',
           								index: 'map/analyze/mac/calculation'
           							},{
           								name: "车牌集合运算",
           								link: 'AnalyzeToolCarCalculation',
           								index: 'map/analyze/car/calculation'
           							}
           						]
	           				}
           				]
           			}
           			// ,{
           			// 	name: "布控管理",
           			// 	link: "search",
           			// 	icon: "iconfont icon-shujuchaxun",
           			// 	index: '5',
           			// 	children: [
	           		// 		{
	           		// 			name: "案件布控",
           			// 			link: "CaseInfo",
           			// 			index: "casecontrol/list"
	           		// 		},{
	           		// 			name: "临时布控",
           			// 			link: "TempraryInfo",
           			// 			index: "temprary/list"
	           		// 		},{
	           		// 			name: "归属地布控",
           			// 			link: "OwnershipInfo",
           			// 			index: "ownership/list"
	           		// 		},{
	           		// 			name: "底库管理",
           			// 			link: "BaseLib",
           			// 			index: "baselib/list"
	           		// 		}
           			// 	]
           			// }
           		]
           }
        },
        methods: {
	      	handleOpen(key, keyPath) {
		        this.$emit("menuhandle",'1');
	      	},
	      	handleClose(key, keyPath) {
	      		this.$emit("menuhandle",'1');
	      	},
	      	gotoItem: function(link,name,ind){
	      		if(link == 'search'){
	      			this.handleOpen();
	      		}
	      		this.$emit("newTab",{
	      			url: ind,
	      			text: name,
	      			name: link
	      		});
	      	}
	    },
	    watch: {

	    }
    }
</script>

<style lang="scss">
	.menu-wrapper {
		width: 240px;
		height: 100%;
		background: #001529;
		transition: width .3s ease;
		float: left;
		overflow-y: auto;
    	overflow-x: hidden;
		li a{
			color: white;
			text-decoration: none;
		    width: calc(100% - 20px);
	    	display: inline-block;
		}
		.logo{
			padding: 10px 25px;
		}
		.el-menu{
			border: none;
		}
		.el-menu-item, .el-submenu__title{
			height: 42px!important;
			line-height: 42px!important;
		}
		ul li {
			&.is-active{
				background: transparent;
			    color: #fff!important;
			}
			background: #000c17!important;
			div.el-submenu__title{
				background: #001529!important;
			}
			.el-menu-item-group__title{
				padding: 0;
			}
			i.iconfont {
				font-size: 18px;
				position: relative;
			}
			&:hover{
				background: #1890ff!important;
			}
		}
	}
	.mini-mode .menu-wrapper {
		width: 60px;
		a>span:nth-child(2){
			display: none;
		}
		.logo{
		    width: 50px;
		    height: 50px;
		    padding: 10px 0;
		    overflow: hidden;
		}
		&>ul>div>li{
			span{
				display: none;
			}
			div{
				&>i:nth-child(3){
					display: none;
				}
			}
			&>a:nth-child(2){
				color: transparent;
			}
			&>ul{
				display: none;
			}
		}
	}
</style>
