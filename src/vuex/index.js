import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'
import config from '../config'

Vue.use(config);
Vue.use(Vuex);

//vux 翻译
let store = new Vuex.Store({
  modules: {
    i18n: vuexI18n.store
  }
});

Vue.use(vuexI18n.plugin, store);

export default new Vuex.Store({
  state: {
    tradingType: "1", //交易类型
    userType: '1', //用户类型
    userInfo:{}, //储存用户信息
    token: '',//授权凭证
    openid: '',//用户唯一标识
    toastConfig: {
      title:"",
      type: 2
    },//弹框配置
    footerSelect: 1,
    threeArea:{
      provinceName: "",
      provinceId: "",
      cityName:"",
      cityId: "",
      countyName:"",
      countyId: ""
    },
    showPop: false,
    popConfig: {
      title:"",
      content: '',
      buttonName: ''
    },
    imgIndex: '', //要删除的图片的序号
    loadConfig:{
      loadShow: false,
      loadText: ""
    },
    roomDetailInfo:{},//储存房间信息
    api: config.API,
    facilityList: [], //房屋配套信息字典表
    showSuccessToast: false,
    showAgreement: false

  },
  mutations: {


  }
})
