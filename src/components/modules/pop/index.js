import popComponent from './pop-alert.vue'

const popAlert={
  install:function(Vue){
    Vue.component('popAlert',popComponent)
  }  //'Loading'这就是后面可以使用的组件的名字，install是默认的一个方法
};
export default popAlert;
