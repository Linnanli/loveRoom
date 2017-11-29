<template>
  <div class="withdraw">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <div class="withdraw-box">
        <h1>提现金额 （免收服务费）</h1>
        <div class="input-box">
          ￥<input type="number" v-model="message.money" placeholder="0" />
        </div>
        <p>
          <span>可用余额￥{{money}}</span>
          <span @click="allWithdraw()">全部提现</span>
        </p>
      </div>

      <div class="button-box">
        <button @click="withdraw()">确认提现</button>
      </div>
    </div>
  </div>
</template>

<script>
import WHeader from "../modules/wheader/wheader.vue";

export default {
  components: { WHeader },
  name: 'selectOne',
  data() {
    return {
      headerTitle: '提现',
      money: '0.00',
      message: {
        money:'',
        createuserid:'',
        createuser:''
      }
    }
  },
  created() {
    var userInfo = this.getLocation('userInfo');
    this.money = this.getLocation('toWithdraw').money;
    this.message.createuserid = userInfo.id;
    this.message.createuser = userInfo.name;
  },
  methods: {
    allWithdraw(){
      this.message.money = this.money;
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
    withdraw() {
      var API = this.$store.state.api;
      if(!window.parseFloat(this.message.money)){
        this.showToast('请输入金额', 2, 1500);
        return;
      }else if(this.message.money>this.money){
        this.showToast('输入金额有误', 2, 1500);
        return;
      }
      this.showLoading('正在提交数据');
      this.$http.post(API.withdraw, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      })
        .then((res) => {
          var result = res.body;
          this.hideLoading();
          if (result.state == 1) {
            var userInfo = this.getLocation('userInfo');
            userInfo.money = result.data.money;
            this.setLocation('userInfo',userInfo);
            this.showToast('等待审核', 1, 1500); 
            this.back(function(){
              this.$router.back();
            },1500);
            
          } else {
            this.showToast(result.message, 2, 1500); //提交远程提交图片失败
          }
        },(res)=>{
          alert(window.JSON.stringify(res));
        });
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";

.withdraw {

  .middle-wrapper {

    .withdraw-box {
      width: 100%;
      background-color: #fff;
      padding: 0.75rem 3%;
      text-align: left;

      h1 {
        line-height: 1.35rem;
        font-size: 0.65rem;
        color: #8a8a8a;
      }

      .input-box {
        font-size: 1.1rem;
        line-height: 2.55rem;
        border-bottom: 0.025rem solid #eee;

        input {
          font-size: 1.1rem;
        }
      }

      p {
        font-size: 0.6rem;
        line-height: 1.2rem;

        span {
          display: inline-block;

          &:first-child {
            color: #999
          }

          &:last-child {
            float: right;
            color: $red;
          }
        }
      }
    }

    .button-box {
      margin-top: 2.15rem;
      width: 100%;

      button {
        width: 94%;
        font-size: 0.75rem;
        line-height: 2.25rem;
        color: #fff;
        background-color: $header-color;
        margin: 0 3% 0 3%;
        border-radius: 0.3rem;
      }
    }
  }
}
</style>
