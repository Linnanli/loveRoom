<template>
  <div class="day-rent-order">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <!--输入框模块-->
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">入住人数</div>
          <div class="pchoose-box">
            <span @click="pLess()">
              <i class="less"></i>
            </span>
            <input type="number" v-model="peopleNum" @change="inputPeopleNum(peopleNum)" />人
            <span @click="pAdd()">
              <i class="add"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">入住人</div>
          <div class="input-box">
            <input type="text" v-model="message.name" placeholder="姓名" />
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">手机号</div>
          <div class="input-box">
            <input type="text" v-model="message.phone" placeholder="手机号码" />
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">入住人身份证</div>
          <div class="input-box">
            <input type="text" v-model="message.card" placeholder="入住人身份证号码" />
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">入住人时段</div>
          <div class="date-choose">
            <span>
              <input type="text" readonly="" name="input_date" v-model="starttime" placeholder="开始日期" data-lcalendar="2000-01-01,2018-01-29" id="startDate" /> -
              <input type="text" readonly="" name="input_date" v-model="endtime" placeholder="结束日期" data-lcalendar="2000-01-01,2018-01-29" id="endDate" />
            </span>
            <i class="go-icon"></i>
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">手机验证码</div>
          <div class="input-box">
            <input type="text" v-model="userInputCode" style="width:50%;" placeholder="请输入验证码" />
            <button @click="getCode()" :disabled="isDisabled">{{nodeText}}</button>
          </div>
        </div>
      </div>
      <!--输入框模块-->

      <!-- 图片上传 -->
      <div class="item-wrapper">
        <p class="item-title">身份证照片</p>
        <div class="img-upload-wrapper clearfix">
          <div class="img-upload-box"> 
            <input type="file" @change="add_imgs()" ref="imgGet" accept="image/*">
          </div>
          <div class="img-box" v-for="(item,index) in imagesList" @click="delete_img(index)">
            <img :src="item" ref="imgs" />
          </div>
        </div>
      </div>
      <!-- 图片上传 end-->
      <!--协议勾选-->
      <div class="item-wrapper">
        <p class="item-title">租房协议</p>
        <div class="device-list" >
          <div class="device-box" :class="agreementSelect?'select':''" @click="clickAgreement()">
            <i></i>同意</div>
            <span class="text" @click="showAgreementBox()">《爱民居房屋出租协议》</span>
        </div>
      </div>

      <!--订单金额明细-->
      <div class="amount-box">
        <div class="amount-box-top">
          <span>代付金额: (预付全额)</span>
          <em>￥{{message.money}}</em>
        </div>
        <div class="amount-detail-list">
          <p class="amount-detail">
            <span>全额房费:</span>
            <em>￥{{message.charge}}</em>
          </p>
          <p class="amount-detail">
            <span>住房押金:</span>
            <em>￥{{message.pledge}}</em>
          </p>
        </div>
      </div>
      <!--订单金额明细 end -->
      <!--顾客须知-->
      <div class="tips-wrapper" v-if="notice">
        <h1>顾客须知</h1>
        <p>
          <i></i>{{notice}}
        </p>
      </div>
      <!--顾客须知 end -->
    </div>
    <!--底部-->
    <div class="footer-wrapper">
      <div>
        <span>￥{{message.money}}</span>
        <p>代付金额</p>
      </div>
      <button @click="submit()">立即预订</button>
    </div>
    <!--底部 end -->
    <!--协议-->
    <agreement :deal="deal" v-if="$store.state.showAgreement" :comfirm-method="hideAgreementBox" :isHTML="true"></agreement>
  </div>
</template>

<script type="text/ecmascript-6">
import WHeader from '../modules/wheader/wheader.vue'
import agreement from '../agreement/agreement.vue'
import agreementHTML from './agreement.js'

export default {
  name: 'dayRentOrder',
  props: {

  },
  data() {
    return {
      calendarStart: new LCalendar(),
      calendarEnd: new LCalendar(),
      headerTitle: "订单填写",
      peopleNum: 1,
      notice: [],
      dayNum:1,//默认入住天数
      imagesList:[],//图片地址列表数组
      deal:'',//订单协议详情
      agreementSelect:false,
      nodeText: '获取验证码',
      second: 30,
      isDisabled: false,
      userInputCode:'',//用户输入验证码
      getCheckCode:'',//后台获取验证码
      starttime:'',
      endtime:'',
      message: {
        openid: '',
        userid:'',
        body: '',//商品描述
        money: '',//商品价格
        houseid: '',//房源id
        housetitle: '',//房源标题
        people: 1,//入住人数
        name: "",//入住人姓名
        phone: "",//入住人电话号码
        card: "",//入住人身份证
        starttime: "", //入住时间
        endtime: "", //离开时间
        amount: '0.00',//押金+房费
        pledge: '0.00',//押金
        // cost: '0.00', //房费
        charge:'0.00',
        cardphoto:''//身份证照片
      }
    }
  },
  components: {
    WHeader,
    agreement
  },
  created() {
    var userInfo = this.getLocation("userInfo");
    var houseInfo = this.houseInfo = this.getLocation("houseInfo");

    if (houseInfo && userInfo) {
      this.message.openid = userInfo.openid;
      this.message.body = '爱民居日租订单-' + userInfo.openid;
      this.message.houseid = houseInfo.id;
      this.message.housetitle = houseInfo.title;
      this.message.name = userInfo.name;
      this.message.phone = userInfo.phone;
      this.message.card = userInfo.card;
      this.message.userid = userInfo.id;
      this.message.pledge = houseInfo.pledge || '0.00';
      this.message.charge = houseInfo.cost || '0.00';
      //设置协议详情内容
      //A房东
      //B租客
      this.deal = this.replaceStr(agreementHTML.html.slice(0),{
        AName:houseInfo.name,//房东姓名
        BName:userInfo.name,//租客姓名
        ACardId:houseInfo.card,
        BCardId:userInfo.card,
        APhone:houseInfo.phone,
        BPhone:userInfo.phone,
        cost:houseInfo.cost,
        pledge:houseInfo.pledge
      });
      //计算金额
      this.message.money = this.message.amount = this.computeMoney();
      //用户须知（后台暂无数据）
      this.notice = houseInfo.notice;
    }

  },
  mounted() {
    var self = this;
    var data = new Date();
    var time = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
    this.calendarStart.init({
      'trigger': '#startDate', //标签id
      'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
      'minDate': time //最小日期
    }),

      this.calendarEnd.init({
        'trigger': '#endDate', //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': time //最小日期
      })

    //绑定日期选择事件
    var startDateEle = document.getElementById('startDate');
    var endDateEle = document.getElementById('endDate');
    startDateEle.oninput = dateChange;
    endDateEle.oninput = dateChange;
    //日期选择事件
    function dateChange() {
      
      if(!self.starttime || !self.endtime){
        self.dayNum = 1;
      }else{
        var startTime = new Date(self.starttime).getTime();
        var endTime = new Date(self.endtime).getTime();

        self.message.starttime = self.starttime;
        //设置结束时间为中午12时
        self.message.endtime = self.constructor.filter('formatDate')(new Date(self.endtime),'yyyy-MM-dd 12:mm:ss');
        //计算入住天数
        self.dayNum = (endTime - startTime) / (24 * 60 * 60 * 1000);
      }
      //计算金额
      self.message.money = self.message.amount = self.computeMoney();
    }
    
  },
  methods: {
    replaceStr(string,obj){ 
      return string.replace(/\{{([\w\d]+)\}}/g,function(str,g,index){
        return obj[g];
      });
    },
    //计算应付金额
    computeMoney(){
      
      //需支付总额 = 押金 + 房费*天数
      var money = (Number(this.houseInfo.pledge) + (Number(this.houseInfo.cost) * this.dayNum) ).toFixed(2);
      return String(money).indexOf('.') !== -1 ? money : (money + '.00');
    },
    //增加人数
    pAdd() {
      if (this.peopleNum < 10) {
        this.message.people = ++this.peopleNum;
      }
    },
    //减少人数
    pLess() {
      if (this.peopleNum > 1) {
        this.message.people = --this.peopleNum;
      }
    },
    //获取验证码
    getCode() {
      this.getCheckCode = '';
      if (!this.message.phone) {
        this.showToast("请输入申请人电话", 1, 1500);
        return;
      }
      var API = this.$store.state.api;
      if (this.isDisabled === false) {

        this.$http.post(API.sendMsg, {
          phone: this.message.phone,
          TemplateCode: 'SMS_91130050'
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            emulateJSON: true
          }).then((res) => {
            var result = res.body;
            if (result.data == null) {
              this.showToast("发送成功", 1, 1500);
              this.getCheckCode = result.state;
            } else {
              this.showToast(result.message, 2, 1500);
            }
          });
        this.startTime();
      }
    },
    //验证间隔时间倒计时
    startTime() {
      var self = this;
      //如果按钮还在禁用状态则不进行倒计时
      if (this.isDisabled === true) return;
      this.isDisabled = true;
      var s = self.second;
      self.nodeText = s + "秒";
      var timer = setInterval(() => {
        s--;
        //倒计时未结束时显示倒计时时间
        if (s > 0) {
          self.nodeText = s + "秒";
        } else {//重置
          self.isDisabled = false;
          // self.second = 60;
          self.nodeText = "获取验证码";
          clearInterval(timer);
        }
      }, 1000);
    },
    //手输入人数时
    inputPeopleNum(peopleNum) {
      if (peopleNum > 1 && peopleNum < 10) {
        this.message.people = peopleNum;
      } else {
        //超出限制，将人数重置为1人
        this.peopleNum = this.message.people = 1;
        this.showToast('人数不得小于0人或者大于10人', 2, 1500);
      }
    },
    //添加图片
    add_imgs() {
      var that = this;
      var API = this.$store.state.api;
      // 通过DOM取文件数据
      var inputDOM = this.$refs.imgGet;
      var file = inputDOM.files[0];
      var form = new FormData();
      form.append('file',file);

      if (/^image/.test(file.type)) {

          that.$http.post(API.ordersNewToImg,form, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            emulateJSON: true
          })
            .then((res) => {
              var result = res.body;
              if (result.state == 1) {
                that.imagesList.push(result.message);
              } else {
                that.showToast(result.message, 2, 1500); //提交远程提交图片失败
              }
            });
      }

    },
    //删除图片
    delete_img(index) {
      var self = this;
      this.showPop('删除','确定删除该图片？','确定',function(){
        self.imagesList.splice(index, 1);
        self.closePop();
      });
    },
    //显示协议框
    showAgreementBox(){
      this.$store.state.showAgreement = true;
    },
    //隐藏协议框
    hideAgreementBox(){
      this.$store.state.showAgreement = false;
    },
    //勾选协议
    clickAgreement(){
      this.agreementSelect = !this.agreementSelect;
    },
    //提交数据
    submit() {
      var API = this.$store.state.api;

      //对姓名/手机号码/身份证号码进行非空验证
      if (!this.message.name) {
        this.showToast('请填写姓名', 1, 1500);
        return;
      } else if (!this.message.phone) {
        this.showToast('请填写手机号码', 1, 1500);
        return;
      } else if (!this.message.card) {
        this.showToast('请填写身份证号码', 1, 1500);
        return;
      } else if (!this.message.starttime || !this.message.endtime) {
        this.showToast('请填写入住时段', 1, 1500);
        return;
      } else if (this.message.starttime >= this.message.endtime) {
        this.showToast('开始时间不得大于或者小于结束时间', 1, 1500);
        return;
      } else if(!this.userInputCode){
        this.showToast("请输入验证码", 1, 1500);
        return;
      } else if(this.userInputCode!=this.getCheckCode){
        this.showToast("验证码错误", 1, 1500);
        return;
      }else if (!this.imagesList[0]) {
        this.showToast("请上传或拍摄身份证照片", 1, 1500);
        return;
      } else if(this.agreementSelect === false){
        this.showToast("请勾选房屋出租协议", 1, 1500);
        return;
      }
      //设置图片地址字符串,英文逗号间隔
      // 'http://www.luoqy.com:80/stay/image/upload/xxx.jpeg,http://www.luoqy.com:80/stay/image/upload/xxx.jpeg'
      this.message.cardphoto = this.imagesList.join(',');

      this.showLoading('订单正在提交中...');

      this.$http.post(API.ordersPlace, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        this.hideLoading();
        if (result.return_code === 'SUCCESS') {
          //存储订单信息时效24h
          var noPayOrderVal = this.getLongStorage('noPayOrderVal') || {};
          noPayOrderVal[result.out_trade_no] = result;
          this.setLongStorage('noPayOrderVal',noPayOrderVal);
          //获取订单信息后开始支付
          this.onBridgeReady(result);
        } else {
          this.showToast(result.return_msg, 2, 1500);
        }
      });

    },
    back(callback,time) {
      var self = this;
      if(typeof callback === 'number'){
        time = callback;
        callback = undefined;
      }
      var timer = setTimeout(function() {
        if(callback){
          callback.apply(self);
        }else{
          self.$router.back();
        }
        clearTimeout(timer);
      }, time || 0);
    },
    //开始调用微信支付接口
    onBridgeReady(result) {
      if(typeof window.WeixinJSBridge === 'undefined'){
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
            //验证支付结果
            self.checkPayIsSuccess(result.out_trade_no);
          } else {
            self.showToast("付款失败", 1,1500);
            self.back(1500)
          }

        }
      );

    },
    //验证支付是否成功
    checkPayIsSuccess(ordernumber){
      var API = this.$store.state.api;

      this.showLoading('正在验证支付结果...');
      this.$http.post(API.wxpayFindwx, {
        out_trade_no:ordernumber,
        money:this.message.money
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        // alert(window.JSON.stringify(result));
        this.hideLoading();
        if (result.state == 1) {
          this.showToast('支付成功,等待房东确认订单中', 1, 2500);
          //提示后跳转订单详情页
          this.back(function(){
            this.setLocation('orderDetail',ordernumber);
            this.$router.push('orderDetail');
          },2500);
        } else {
          this.showToast(result.message, 2, 1500);
        }
      },function(err){
        alert(window.JSON.stringify(err));
      });

    }


  }

}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";
.day-rent-order {
  width: 100%;
  height: 100%;
  margin: 0;

  .middle-wrapper {

    .input-wrapper {
      width: 100%;
      height: 2.25rem;
      text-align: left;
      font-size: 0.65rem;
      line-height: 2.25rem;
      background-color: #fff;
      padding: 0 3%;
      display: block;

      .input-wrapper-box {
        border-bottom: 0.025rem solid #eee;
        height: 100%;
        width: 100%;

        div {
          float: left;
        }

        .title-box {
          float: left;
          display: inline-block;
          width: 28%;
        } //title-box
        .pchoose-box {
          display: inline-block;
          float: right;
          width: 30%;

          input {
            width: 20%;
          }

          span {
            display: inline-block;
            height: 100%;
            width: 1.1rem;

            .less {
              width: 0.5rem;
              height: 0.075rem;
              background: url("/static/img/jianhao.png") no-repeat;
              background-size: 100% 100%;
              margin-left: 0.2rem;
            }

            .add {
              width: 0.45rem;
              height: 0.45rem;
              background: url("/static/img/jiahao.png") no-repeat;
              background-size: 100% 100%;
              margin-left: 0.2rem;
            }
          }
        } //pchoose-box
        .input-box {
          width: 72%;
          height: 80%;

          input {
            height: 100%;
            width: 100%;
          }
          button {
            width: 35%;
            // width: 4rem;
            padding: 0.3rem 0;
            border-radius: 0.2rem;
            color: #fff;
            background-color: $header-color;

            &:disabled {
              background-color: #ccc;
            }
          }

        } //input-box
        .date-choose {
          display: inline-block;
          height: 100%;
          width: 72%;

          input {
            display: inline-block;
            width: 30%;
          }

          i {
            float: right;
            position: relative;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
          }
        } //date-choose
      } //input-wrapper-box
    }
    /*input-wrapper*/
    .amount-box {
      background-color: #fff;
      margin-top: 0.5rem;
      font-size: 0.65rem;
      text-align: left;
      padding: 0 3%;

      .amount-box-top {
        height: 2.25rem;
        line-height: 2.25rem;
        border-bottom: 0.025rem solid #eee;

        em {
          color: $red;
          float: right;
        }
      } //amount-box-top
      .amount-detail-list {
        width: 100%;
        padding: 0.425rem 0;
        line-height: 1.1rem;
        color: #878787;

        em {
          color: $red;
          float: right;
        }
      } //amount-detail-list
    } //amount-box
    .tips-wrapper {
      text-align: left;
      padding: 0 3%;
      font-size: 0.65rem;

      h1 {
        margin: 0.5rem 0;
      }

      p {
        margin-bottom: 0.4rem;

        i {
          width: 0.525rem;
          height: 0.525rem;
          background: url("/static/img/gukexuzhi.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
          margin-right: 3%;
          position: relative;
          bottom: 0.1rem;
        }
      }
    }
  }
  /*middle-wrapper end */
  /*middle-wrapper end */
  .footer-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 2.5rem;
    width: 100%;
    line-height: 2.5rem;
    border-top: 0.025rem solid #c0c0c3;
    font-size: 0.5rem;
    color: #a7a7a8;

    div,
    button {
      width: 50%;
      display: inline-block;
      float: left;
      text-align: center;
    }

    div {
      background-color: #fff;
      font-size: 0.6rem;
      color: #686868;

      span {
        display: block;
        height: 1.25rem;
        line-height: 1.5rem;
        background-size: 100% 100%;
        margin: 0 auto;
        color: $red;
      }

      p {
        display: block;
        height: 1.25rem;
        line-height: 1.25rem;
        text-align: center;
      }
    }

    button {
      background-color: $header-color;
      font-size: 0.75rem;
      color: #fff;
      height: 100%;
      bdaily: 0;
    }
  }
  /*footer-wrapper end */

  .item-wrapper {
      background-color: #fff;
      margin-top: 0.5rem;
      padding: 0.2rem 0.6rem 0.45rem 0.6rem;
      text-align: left;

      .item-title {
        line-height: 2rem;
        height: 2rem;
        font-size: 0.64rem;
        color: #666;
      }

      .device-list {
        width: 100%;
        text-align: left;
        .item-name {}
        .text{
          color: red;
          font-size: 0.65rem;
        }
        .device-box {
          display: inline-block;
          font-size: 0.65rem;
          i {
            width: 0.6rem;
            height: 0.6rem;
            display: inline-block;
            vertical-align: middle;
            background-image: url('/static/img/unAction.png');
            background-size: 0.6rem 0.6rem;
            margin-right: 0.5rem;
          }
        }

        .select {
          i {
            width: 0.6rem;
            height: 0.6rem;
            display: inline-block;
            vertical-align: middle;
            background-image: url('/static/img/action.png');
            background-size: 0.6rem 0.6rem;
            margin-right: 0.5rem;
          }
        }
      }

      .img-upload-wrapper {
        width: 100%;

        .img-upload-box {
          margin-top: 0.5rem;
          width: 21.8%;
          display: inline-block;
          background: url('/static/img/tianjiatupian.png') no-repeat;
          background-size: 100% 100%;
          border: 0.025rem solid #eee;

          input[type=file] {
            opacity: 0;
            width: 3.625rem;
            height: 3.625rem;
            border: 0.025rem solid #eee;
          }
        }
        .img-box {
          display: inline-block;
          width: 20%;
          margin-top: 0.5rem;

          img {
            width: 100%;
          }
        }

        .img-upload-box+.img-box,
        .img-box+.img-box {
          margin-left: 2%;
        }
      }
    }

}
</style>
