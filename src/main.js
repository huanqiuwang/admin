// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/global.css'
import Vue from 'vue'
import router from './router/'
import App from './App'

import filter from '@/assets/js/filter.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(filter)
Vue.use(ElementUI)

// import iView from 'iview'
// import 'iview/dist/styles/iview.css'

// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min'


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  	if(to.matched.length ===0) {                                        //如果未匹配到路由
  		next({name: 'notfound'});
	    // from.name ? next({ name:from.name }) : next('/');   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
  	} else {
	    next();                                                                            //如果匹配到正确跳转
  	}
});

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App />'
})
