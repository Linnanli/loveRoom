import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'//首页
import login from '@/components/login/login'//登录
import loginWei from '@/components/login/login-weixin'//登录
import  user from  '@/components/user/user' //我的
import  orderList from '@/components/order-list/order-list' //订单列表
import  orderDetail from '@/components/order-detail/order-detail' //订单详情
import  aboutUs from '@/components/about-us/about-us' //关于我们
import  dayRent from '@/components/day-rent/day-rent' //日租列表
import  mySaves from '@/components/my-saves/my-saves' //我的收藏
import dayRentDetail from '@/components/day-rent-detail/day-rent-detail' //日租详情
import  evaluation from '@/components/evaluation/evaluation' //评价
import  dayRentOrder from '@/components/day-rent-order/day-rent-order' //评价
import  houseRent from '@/components/house-rent/house-rent' //房屋出租
import  houseSell from '@/components/house-sell/house-sell' //房屋出租
import  doLandlord from '@/components/do-landlord/do-landlord'//房东招募
import province from  '@/components/modules/area/province' //省选择
import city from '@/components/modules/area/city'  //城市选择
import county from  '@/components/modules/area/county'  //区县选择
import myRooms from '@/components/my-rooms/my-rooms' //我的房源
import withdraw from '@/components/withdraw/withdraw' //提现
import releaseRoom from '@/components/release-room/release-room' //发布房源
import myTasks from '@/components/my-tasks/my-tasks' //我的任务
import userInfo from '@/components/user-info/user-info' //个人资料
import orderEvaluate from '@/components/order-evaluate/order-evaluate'//订单评价


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component:index
    }, {
      path: '/login',
      name: 'login',
      component: login
    }, {
      path: '/loginWei',
      name: 'loginWei',
      component: loginWei
    },{
      path: '/user',
      name: 'user',
      component: user,
      meta: { requiresAuth: true }
    }, {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail
    },
    {
      path:'/aboutUs',
      name: 'aboutUs',
      component: aboutUs
    },
    {
      path:'/dayRent',
      name: 'dayRent',
      component: dayRent
    },
    {
      path:'/mySaves',
      name: 'mySaves',
      component: mySaves
    },
    {
      path:'/dayRentDetail',
      name: 'dayRentDetail',
      component: dayRentDetail
    },{
      path:'/evaluation',
      name:'evaluation',
      component:evaluation
    },{
      path:'/dayRentOrder',
      name:'dayRentOrder',
      component:dayRentOrder
    },{
      path:'/houseRent',
      name:'houseRent',
      component:houseRent
    },{
      path:'/houseSell',
      name:'houseSell',
      component:houseSell
    },
    {
      path:'/doLandlord',
      name:'doLandlord',
      component:doLandlord
    },
    {
      path:'/province',
      name:'province',
      component:province
    },
    {
      path:'/city',
      name:'city',
      component:city
    },
    {
      path:'/county',
      name:'county',
      component:county
    },
    {
      path:'/myRooms',
      name:'myRooms',
      component:myRooms
    },
    {
      path:'/withdraw',
      name:'withdraw',
      component:withdraw
    },
    {
      path:'/releaseRoom',
      name:'releaseRoom',
      component:releaseRoom
    },
    {
      path:'/myTasks',
      name:'myTasks',
      component:myTasks
    },
    {
      path:'/userInfo',
      name:'userInfo',
      component:userInfo
    },
    {
      path:'/orderEvaluate',
      name:'orderEvaluate',
      component:orderEvaluate
    }
  ]

})




