<template>
  <div class="order-list">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper" v-if="isLoadComplete">
      <!--支付状态-->
      <div class="order-detail-top">
        <p>{{orderDetail.state | orderState}}</p>
        <p>{{orderStateInfo[orderDetail.state]}}</p>
        <button class="call-but" @click="call(houseInfo.phone)">联系房东</button>
      </div>
      <!--订单商品信息-->
      <div class="goods-detail-wrapper">
        <div class="goods-detail-box clearfix" @click="jumpHouseDetailPage(houseInfo.id)">
          <div class="goods-detail-left">
            <img :src="houseImages" :onerror="defaultImg">
          </div>
          <div class="goods-detail-right">
            <h1>{{houseInfo.title}}</h1>
            <article>
              <p class="house-address">{{houseInfo.address}}</p>
              <p>
                <em>{{orderDetail.starttime}}</em>-
                <em>{{orderDetail.endtime}}</em>
                <span>共{{dayNum}}晚</span>
              </p>
              
              <p>
                <em>¥{{orderDetail.amount}}</em>
              </p>
              <p>
                入住人: <span>{{orderDetail.name}}</span>
                <em>{{orderDetail.phone}}</em>
              </p>
            </article>
          </div>
        </div>
      </div>
      <!--订单信息-->
      <div class="order-info-wrapper">
        <div class="order-info-content">
          <h1>订单信息</h1>
          <article>
            <p>订单号码：
              <em>{{orderDetail.ordernumber}}</em>
            </p>
            <p>下单时间：
              <em>{{orderDetail.createtime}}</em>
            </p>
          </article>
        </div>
        <div class="order-btn-wrapper clearfix">
          <div class="order-btn-box">
            <button class="button-min btn-white" v-if="orderDetail.state == 1" @click="showPop('提示','是否关闭订单','确定',closeOrder(orderDetail.ordernumber))">取消订单</button>
            <button class="button-min btn-red" v-if="orderDetail.state == 1" @click="showPop('提示','是否确定支付订单','确定',payOrder(orderDetail.ordernumber))">确认支付</button>
            <button class="button-min btn-red" v-if="orderDetail.state == 2&&orderDetail.isevaluate == 1" @click="evaluate()">发表评论</button>
            <button class="button-min btn-red" v-if="orderDetail.state == 2||orderDetail.state ==5" @click="applyRefundMoney(orderDetail.id)">申请退款</button>
          </div>
        </div>
      </div>
      <!--详细地址-->
      <roomMap v-if="addressInfo.coord" :addressInfo="addressInfo"></roomMap>
    </div>
    <!--底部-->
    <div class="footer-wrapper">
      <indexFooter></indexFooter>
    </div>
    <!--底部 end -->
  </div>
</template>

<script type="text/ecmascript-6">
import indexFooter from '../footer/index-footer'
import roomMap from '../modules/map/map'
import WHeader from "../modules/wheader/wheader.vue";
export default {
  name: 'orderList',
  data() {
    return {
      defaultImg: 'this.src="' + require('../../../static/img/pic.png') + '"',
      headerTitle: '订单详情',
      isLoadComplete: false,//是否加载完成
      orderDetail: {},//订单数据
      houseInfo: {},//房源信息
      dayNum: 0,//日数
      houseImages: '',//房源图片
      orderStateInfo: {
        '1': '订单成功，等待支付',
        '2': '交易成功',
        '3': '退款成功',
        '4': '已关闭订单',
        '5': '支付成功,等待审核',
        '6': '退款中,等待审核'
      },
      addressInfo: {
        address: "",
        coord: ""
      }
    }
  },
  components: {
    WHeader,
    indexFooter,
    roomMap
  },
  created() {
    var API = this.$store.state.api;
    var ordernumber = this.getLocation('orderDetail');
    var userInfo = this.getLocation("userInfo");

    //获取订单详情
    this.showLoading('正在加载详情...');
    this.$http.post(API.ordersFindById, {
      id: ordernumber
    }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        if (result.state == 1) {
          this.orderDetail = result.data[0];
          //格式化日期,计算入住天数
          var startTime = new Date(this.constructor.filter('formatDate')(new Date(this.orderDetail.starttime || 0),'yyyy-MM-dd 12:mm:ss')).getTime(),
            endTime = new Date(this.constructor.filter('formatDate')(new Date(this.orderDetail.endtime || 0),'yyyy-MM-dd 12:mm:ss')).getTime();
          //实际付款金额 = 入住时间*金额
          this.dayNum = (endTime - startTime) / (24 * 60 * 60 * 1000);
          //获取房源信息
          this._getHouseInfo(userInfo.id);

        } else {
          this.hideLoading();
          this.showToast(result.message, 2, 1500);
          //后退回订单列表
          this.back(1500);
        }
      });
  },
  methods: {
    //获取订单信息后获取房源信息
    _getHouseInfo(userid) {
      //获取房源信息
      var API = this.$store.state.api;
      this.$http.post(API.getHouseDetail, {
        id: this.orderDetail.houseid,
        userid: userid
      }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          this.hideLoading();
          if (result.state == 1) {
            var data = result.data;
            this.houseInfo = data[0].house; //获取房源列表
            this.isLoadComplete = true;//加载完成
            //初始化封面图片
            if (this.houseInfo.images) {
              this.houseImages = this.houseInfo.images.split(',')[0];
            }
            //設置地圖信息
            if (this.houseInfo) {
              this.addressInfo = {
                address: this.houseInfo.address ? this.houseInfo.address : "",
                coord: this.houseInfo.coord ? this.houseInfo.coord : ""
              }
            }
          } else {
            this.showToast(result.message, 2, 1500);
            //后退回订单列表
            this.back(1500);
          }
        });
    },
    call(phone){
      // var self = this;
      // this.showPop('提示','是否呼叫房东','确定',function(){
        window.location.href = 'tel:'+phone;
        this.closePop();
      // });
    },
    //跳转房源详情页面
    jumpHouseDetailPage(id) {
      this.setLocation("houseId", id);
      this.$router.push('dayRentDetail');
    },
    back(callback, time) {
      var self = this;
      if (typeof callback === 'number') {
        time = callback;
        callback = undefined;
      }
      var timer = setTimeout(function() {
        if (callback) {
          callback.apply(self);
        } else {
          self.$router.back();
        }
        clearTimeout(timer);
      }, time || 0);
    },
    //发表评论
    evaluate() {
      this.setLocation("orderEvaluate", {
        houseid: this.houseInfo.id,
        housetitle: this.houseInfo.title,
      });
      this.$router.push('orderEvaluate');
    },
    //关闭订单
    closeOrder(ordernumber) {
      var self = this;
      return function() {
        self.closePop();
        var API = self.$store.state.api;
        self.showLoading('正在取消订单...');
        self.$http.post(API.closeOrder, {
          out_trade_no: ordernumber
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            emulateJSON: true
          }).then((res) => {
            var result = res.body;
            self.hideLoading();
            if (result.return_code === 'SUCCESS') {
              //后退回订单列表
              self.back();
            } else {
              self.showToast(result.message, 2, 1500);
            }
          });
      }

    },
    //支付订单
    payOrder(ordernumber) {
      var self = this;
      return function() {
        //关闭弹框
        self.closePop();
        //兼容safari日期对象处理字符串格式
        var orderTime = new Date(self.orderDetail.createtime.replace(/\-/g, '/')).getTime();
        var nowTime = new Date().getTime();
        //如果订单时间超过24小时那么禁止重新支付
        if (self.orderDetail.createtime && (24 * 60 * 60 * 1000 <= nowTime - orderTime)) {
          self.showToast('该订单超过24小时已失效请重新下单', 2, 2000);
          return;
        }
        var noPayOrderVal = self.getLongStorage('noPayOrderVal') || {};
        //判断是否有保存订单参数
        if (noPayOrderVal[ordernumber]) {
          //开始支付
          self.onBridgeReady(noPayOrderVal[ordernumber]);
        } else {
          self.showToast('该订单已失效请重新下单', 2, 1500);
        }

      }
    },
    //开始调用微信支付接口
    onBridgeReady(result) {
      if (typeof window.WeixinJSBridge === 'undefined') {
        alert('请在微信端调用支付');
        return;
      }
      var self = this;
      //调用温馨内容参数	u802345jgfjsdfgsdg888
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": result.appid,     //公众号名称，由商户传入
          "timeStamp": result.timeStamp,         //时间戳，自1970年以来的秒数
          "nonceStr": result.nonce_str, //随机串
          "package": "prepay_id=" + result.prepay_id,   //订单ID还是啥
          "signType": "MD5",         //微信签名方式：
          "paySign": result.truesign //微信签名
        },
        function(res) {
          // alert(window.JSON.stringify(res));
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            //验证是否成功
            self.checkPayIsSuccess();
          } else {
            self.showToast("付款失败", 1, 1500);
            self.back(1500)
          }

        }
      );

    },
    //验证支付是否成功
    checkPayIsSuccess() {
      var API = this.$store.state.api;

      this.showLoading('正在验证...');
      this.$http.post(API.wxpayFindwx, {
        out_trade_no: this.orderDetail.ordernumber,
        money: this.orderDetail.amount
      }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          // alert(window.JSON.stringify(result));
          this.hideLoading();
          if (result.state == 1) {
            this.showToast('支付成功,等待房东确认订单中', 1, 2500);
            //设置订单状态为等待审核，隐藏支付按钮
            this.back(function() {
              this.orderDetail.state = 5;
            }, 2500);
          } else {
            this.showToast(result.message, 2, 1500);
          }
        }, function(err) {
          alert(window.JSON.stringify(err));
        });

    },
    //申请退款
    applyRefundMoney(id) {
      var self = this;
      var API = self.$store.state.api;

      this.showPop('提示', '是否确定申请退款？', '确定', function() {
        self.closePop();
        startRequest();
      });

      //开始请求
      function startRequest() {
        self.showLoading('正在申请退款...');

        self.$http.post(API.ordersUpdate, {
          id: id,
          // money:self.orderDetail.amount
          state:6
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            emulateJSON: true
          }).then((res) => {
            var result = res.body;
            self.hideLoading();
            if (result.state === 1) {
              self.showToast('正在等待房东确认款', 1, 2500);
              //设置订单状态为等待审核，隐藏支付按钮
              self.back(function() {
                self.orderDetail.state = 6;
              }, 2500);
            } else {
              self.showToast(result.return_msg, 2, 1500);
            }
          });
      }


    }

  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.order-list {
  width: 100%;
  height: 100%;
  margin: 0;
  text-align: left;

  .middle-wrapper {

    .order-detail-top {
      background: #fff;
      width: 100%;
      padding: 0.6rem 3%;

      .call-but{
        height: 1.25rem;
        line-height: 1.25rem;
        font-size: 0.6rem;
        background: #51ca94;
        padding: 0 0.55rem;
        border-radius: 0.6rem;
        color: #fff;
      }
      p:first-child {
        font-size: 0.8rem;
        color: #e00000;
        margin-bottom: 0.6rem;
      }

      p:last-child {
        font-size: 0.65rem;
        color: #5a5a5a;
      }
    }
    /*order-detail-top*/
    .goods-detail-wrapper {
      width: 100%;
      background: #fff;
      margin-top: 0.5rem;
      padding-left: 3%;

      .goods-detail-box {
        width: 100%;
        padding: 0.75rem 0;

        .goods-detail-left {
          width: 37.5%;
          float: left;

          img {
            width: 100%;
          }
        }

        .goods-detail-right {
          float: right;
          width: 62.5%;
          padding: 0 3%;

          h1 {
            font-size: 0.75rem;
          }
          article {

            p {
              font-size: 0.6rem;
              margin-top: 0.5rem;
              color: #666;
            }
            .house-address {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p:nth-child(3) span,
            em {
              display: inline-block;
            }

            p:nth-child(3) span {
              border-right: 0.02rem solid #dbdbdb;
              padding: 0 0.3rem;
              margin-right: 0.3rem;
            }

            article p:nth-child(4) {
              text-align: right;
              color: #d80100;
            }
          }
        }
      }
      /*goods-detail-box end*/
    }
    /*goods-detail-wrapper end*/
    .order-info-wrapper {
      width: 100%;
      background: #fff;
      padding-top: 0.5rem;
      margin-top: 0.5rem;

      .order-info-content {
        width: 100%;
        padding: 0 0 0.85rem 3%;
        border-bottom: 0.02rem solid #f0f0f1;

        h1 {
          font-size: 0.75rem;
        }

        article {
          p {
            font-size: 0.6rem;
            color: #656565;
            margin-top: 0.5rem;
          }
        }
      }
      /*order-info-content end*/
      .order-btn-wrapper {
        width: 100%;
        padding: 0.7rem 3% 0 0;

        .order-btn-box {
          display: inline-block;
          float: right;

          div {
            display: inline-block;
            .btn-white {
              margin-right: 0.65rem;
            }
          }
        }
      }
      /*order-btn-wrapper end*/
    }
    /*order-info-wrapper end*/
  }
  /*middle-wrapper end*/
}
</style>
