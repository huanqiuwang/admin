import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/source/layout/layout'
import notfound from '@/source/404'
import login from '@/source/home/login'


//  系统管理
import department from '@/source/system/department/index.vue'
import role from '@/source/system/role/index.vue'
import log from '@/source/system/log/index.vue'

//  个人中心
import userinfo from '@/source/user/userinfo/index.vue'
import task from '@/source/user/task/index.vue'

//  超管管理中心
import tenant from '@/source/superManager/tenant/index.vue'
import repaire from '@/source/superManager/repaire/index.vue'
import repaireMenu from '@/source/superManager/repaire/menuSet.vue'
import group from '@/source/superManager/group/index.vue'


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
                {path: 'system/role',component: role,name: "role",meta:{alias: "角色管理"}},
                {path: 'system/log',component: log,name: "log",meta:{alias: "日志管理"}},

                {path: 'user/userinfo',component: userinfo,name: "userinfo",meta:{alias: "个人信息"}},
                {path: 'user/task',component: task,name: "task",meta:{alias: "我的任务"}},

                {path: 'super/group',component: group,name: "group",meta:{alias: "组织管理"}},
                {path: 'super/tenant',component: tenant,name: "tenant",meta:{alias: "租户管理"}},
                {path: 'super/repaire',component: repaire,name: "repaire",meta:{alias: "维护管理"}},
                {
                  path: 'super/menuset',
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
