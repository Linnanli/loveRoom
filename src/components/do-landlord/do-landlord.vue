<template>
  <div class="about-us">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <div class="landLord-info">
        <div class="input-wrapper">
          <div class="input-wrapper-box clearfix">
            <div class="title-box">申请人</div>
            <div class="input-box">
              <input v-model="message.name" type="text" placeholder="姓名" />
            </div>
          </div>
        </div>
        <!--选择主营业范围-->
        <div class="check-box-wrapper">
          <div class="check-box clearfix">
            <div class="title-box">主营范围</div>
            <div class="checkbox-parent">
              <div class="box">
                <checker v-model="message.ppa" default-item-class="payType-item" selected-item-class="payType-item-selected">
                  <checker-item value="3">日租民宿</checker-item>
                  <checker-item value="1">房屋出租</checker-item>
                  <checker-item value="2">房屋出售</checker-item>
                </checker>
              </div>
            </div>
          </div>
        </div>
        <!--选择主营业范围 end -->
      </div>

      <!--手机号码验证-->
      <div class="checkPhone">
        <div class="input-wrapper mg-top">
          <div class="input-wrapper-box clearfix">
            <div class="title-box">手机号</div>
            <div class="input-box min-input">
              <input v-model="message.phone" type="text" placeholder="手机号码" />
            </div>
            <button @click="getCode()" :disabled="isDisabled">{{nodeText}}</button>
          </div>
        </div>
        <div class="input-wrapper">
          <div class="input-wrapper-box clearfix">
            <div class="title-box">验证码</div>
            <div class="input-box">
              <input v-model="message.checkCode" type="text" placeholder="输入验证码" />
            </div>
          </div>
        </div>
      </div>
      <!--手机号码验证-->

      <div class="agreement">
        <h1>申请协议:</h1>
        <p>
          <i></i>同意
          <span @click="lookAgreement()">《爱民居房东申请协议》</span>
        </p>
      </div>

    </div>
    <!--底部-->
    <div class="footer-wrapper">
      <button @click="submit()">提交申请</button>
    </div>
    <!--底部 end -->
    <!--弹框-->
    <!-- <Toast></Toast> -->
    <!--协议-->
    <agreement :deal="deal" v-if="$store.state.showAgreement" :comfirm-method="hideAgreement"></agreement>
  </div>
</template>

<script type="text/ecmascript-6">
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
// import Toast from '../modules/w-toast/w-toast'
import WHeader from '../modules/wheader/wheader.vue'
import agreement from '../agreement/agreement.vue'

export default {
  name: 'aboutUs',
  data() {
    return {
      payType: "1",
      nodeText: '获取验证码',
      second: 30,
      isDisabled: false,nodeText: '获取验证码',
      second: 30,
      isDisabled: false,
      headerTitle: "房东招募",
      showAgreement: false,
      deal: '',
      message: {
        id: '',
        name: '',
        ppa: '1',
        phone: '',
        type: '2',
        checkCode: ''
      }
    }
  },
  created() {
    var userInfo = this.getLocation('userInfo');
    this.deal = userInfo.deal;
    //设置用户id
    this.message.id = userInfo.id;
  },
  components: {
    Checker,
    CheckerItem,
    // Toast,
    WHeader,
    agreement
  },
  methods: {
    test() {
      alert('111');
    },
    //获取验证码
    getCode() {
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
            if (result.state == 1) {
              this.showToast("发送成功", 1, 1500);
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
          self.nodeText = "重新获取";
          clearInterval(timer);
        }
      }, 1000);
    },
    //提交房东申请数据
    submit() {
      if (!this.message.name) {
        this.showToast("请输入申请人姓名", 1, 1500);
        return;
      } else if (!this.message.phone) {
        this.showToast("请输入申请人电话", 1, 1500);
        return;
      } else if (!this.message.checkCode) {
        this.showToast("请输入验证码", 1, 1500);
        return;
      }
      var API = this.$store.state.api;
      var self = this;
      this.$http.post(API.userUpdate, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        if (result.state == 1) {
          this.showToast("提交成功", 1, 1500);
          //提示成功后跳回首页
          var timer = setTimeout(function() {
            self.$router.push('/');
            clearTimeout(timer);
          }, 1500);
        } else {
          this.showToast(result.message, 2, 1500);
        }
      });

    },
    //查看协议
    lookAgreement() {
      this.$store.state.showAgreement = true;
    },
    //隐藏协议
    hideAgreement() {
      this.$store.state.showAgreement = false;
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";
.about-us {
  width: 100%;
  height: 100%;
  margin: 0;

  .middle-wrapper {
    margin: 0;

    .mg-top {
      margin-top: 0.5rem;
    }

    .check-box-wrapper {
      height: auto;
      text-align: left;
      font-size: 0.65rem;
      background-color: #fff;
      padding: 0 3%;

      .title-box {
        display: inline-block;
        width: 30%;
        line-height: 2.25rem;
        float: left;
      }

      .checkbox-parent {
        display: inline-block;
        width: 68%;

        .box {
          display: inline-block;
          margin-bottom: 0.5rem;

          .payType-item {
            border: 1px solid #ececec;
            padding: 0 0.5rem;
            line-height: 1.2rem;
            margin: 0.5rem 0.5rem 0 0;
          }
          .payType-item-selected {
            border: 1px solid $inline-color;
          }
        }
      } //checkbox-parent
    } //check-box-wrapper
    .agreement {
      background-color: #fff;
      margin-top: 0.5rem;
      padding: 0.8rem 3% 4rem 3%;
      text-align: left;
      font-size: 0.65rem;

      h1 {
        margin-bottom: 0.8rem;
      }

      p {
        color: #999;

        span {
          color: $red;
        }
      }
    }

    .checkPhone {

      .min-input {
        width: 43%;
      }

      button {
        width: 29%;
        padding: 0.3rem 0.5rem;
        border-radius: 0.2rem;
        color: #fff;
        background-color: $header-color;

        &:disabled {
          background-color: #ccc;
        }
      }
    }
  }
  /*middle-wrapper end */
  .footer-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 2.5rem;
    width: 100%;
    line-height: 2.5rem;
    bdaily-top: 0.025rem solid #c0c0c3;
    font-size: 0.5rem;
    color: #a7a7a8;

    button {
      width: 100%;
      background-color: $header-color;
      font-size: 0.75rem;
      color: #fff;
      height: 100%;
      border: 0;
    }
  }
  /*footer-wrapper end */
}
</style>
