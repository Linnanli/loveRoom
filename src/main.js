// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from  './vuex'
// import store from 'components/vuxc'
import  commonJs from  './common.js' //公用js
import VueResource from 'vue-resource';
import filter from './filter.js';//全局过滤器
import Toast from '@/components/modules/w-toast/index';
import popAlert from '@/components/modules/pop/index';
import loading from '@/components/modules/loading/index';

Vue.use(loading);
Vue.use(popAlert)
Vue.use(Toast);
Vue.use(VueResource);
Vue.use(commonJs);

//注册全局过滤器
for(var key in filter){
  Vue.filter(key,filter[key]);
}

// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth) {  // 判断该路由是否需要登录权限
//     if (store.state.token) {  // 通过vuex state获取当前的token是否存在
//       next();
//     }
//     else {
//       next({
//         path: '/loginWei',
//         query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//     }
//   }
//   else {
//     next();
//   }
// })

Vue.prototype.changeData = function (){
  alert('执行成功');
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App}
})





