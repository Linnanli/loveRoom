import toastComponent from './w-toast.vue'

const Toast={
  install:function(Vue){
    Vue.component('Toast',toastComponent)
  }  //'Loading'这就是后面可以使用的组件的名字，install是默认的一个方法
};
export default Toast;
