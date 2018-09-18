import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/source/layout/layout'
import notfound from '@/source/404'
import login from '@/source/home/login'


//  系统管理
import department from '@/source/system/department/index.vue'
import tenant from '@/source/system/tenant/index.vue'
import repaire from '@/source/system/repaire/index.vue'
import repaireMenu from '@/source/system/repaire/menuSet.vue'
import group from '@/source/system/group/index.vue'


Vue.use(Router)

export default new Router({
	routes: [
      	{
		    path: '/',
		    name: 'layout',
    		component: layout,
            redirect: {name: 'department'},
            children: [
                {path: 'system/department',component: department,name: "department",meta:{alias: "部门管理"}},
                {path: 'system/group',component: group,name: "group",meta:{alias: "组织管理"}},
                {path: 'system/tenant',component: tenant,name: "tenant",meta:{alias: "租户管理"}},
                {path: 'system/repaire',component: repaire,name: "repaire",meta:{alias: "维护管理"}},
                {
                  path: 'system/menuset',
                  component: repaireMenu,
                  name: "repaireMenu",
                  props: ({query: {id}}) => ({id}),
                  meta:{alias: "菜单配置"}
                }
           ]
      	},{
            name: 'notfound',
            path: '/notfound',
            component: notfound
        },{
            name: 'login',
            path: '/login',
            component: login
        }
  	]
})
