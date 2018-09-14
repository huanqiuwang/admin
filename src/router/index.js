import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/source/layout/layout'
import notfound from '@/source/404'
import login from '@/source/home/login'


//  系统管理
import department from '@/source/system/department/index.vue'


Vue.use(Router)

export default new Router({
	routes: [
      	{
		    path: '/',
		    name: 'layout',
    		component: layout,
            redirect: {name: 'department'},
            children: [
                {path: 'system/department',component: department,name: "department",meta:{alias: "系统管理"}},

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
