var config = {};
// var root = "http://120.77.243.73";
// var root = 'http://www.luoqy.com';
var root = 'http://www.aiminju.cn';
// var root = '18a013e736.51mypc.cn';
config.API = {
  checkUser: root + '/stay/user/wxLogin.do',//检测用户是否登录过
  getWeiUserInfo: root+'/stay/user/accessToken.do',//获取微信用户信息
  getUserInfo: root+'/stay/user/findById.do?html',//获取用户信息，个人信息页
  userToImg: root+ '/stay/user/toImg.do?html', //用户头像图片上传
  houseToImg: root+ '/stay/house/toImg.do?html', //房源图片上传
  userSave: root+ '/stay/user/save.do?html', //用户个人信息提交
  userUpdate: root+'/stay/user/update.do?html',//用户更新个人信息/房东申请
  getMyRooms: root+ '/stay/house/loadPage.do?html',//获取房源列表
  getallRooms: root+ '/stay/house/load.do?html',//获取房源列表
  postOrder: root+ '/stay/order/save.do?html',//订单填写
  roomSave: root+'/stay/house/save.do?html',//房源发布
  roomUpdate: root+'/stay/house/update.do?html',//房源更新
  loadFacility: root+'/stay/house/loadFacility.do?html',//房子周围配套设施字典表
  deleteHouse: root+ '/stay/house/delete.do?html',//删除房源
  getTeamInfo: root+'/stay/corporate/load.do?html',//获取团队信息
  getHouseDetail:root+'/stay/house/findById.do?html',//获取房源详情
  collectSave:root+'/stay/collect/save.do?html',//收藏房源信息
  collectDelete:root+'/stay/collect/delete.do?html',//删除收藏房源信息
  sendMsg:root+'/stay/phone/sendMsg.do?html',//发送短信验证码
  ordersLoadPage:root+'/stay/orders/loadPage.do?html',//订单查询
  ordersFindById:root+'/stay/orders/findById.do?html',//查询订单详情
  closeOrder:root+'/stay/wxpay/closeOrder.do?html',//关闭订单
  myCollects: root +'/stay/collect/load.do?html',//我的收藏
  collectLoadPage:root +'/stay/collect/loadPage.do?html',//我的收藏
  ordersPlace:root +'/stay/wxpay/place.do?html',
  evaluateSave:root +'/stay/evaluate/save.do?html',
  wxpayFindwx:root +'/stay/wxpay/findwx.do?html',
  refundMoney:root +'/stay/wxpay/refund.do?html',//申请退款
  taskLoadPage:root +'/stay/task/loadPage.do?html',
  updateTask:root + '/stay/task/updateTask.do?html',
  ordersNewToImg:root+'/stay/orders/newToImg.do?html',//订单照片上传
  userNewToImg:root+'/stay/user/newToImg.do?html',//用户头像上传
  houseNewToImg:root+'/stay/house/newToImg.do?html',//房源照片上传
  ordersUpdate:root+'/stay/orders/update.do?html',//订单照片上传
  withdraw:root+'/stay/withdraw/save.do?html'
};

module.exports = config;
