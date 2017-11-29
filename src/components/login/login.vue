<template>
  <div class="login">
    <w-header :title="headerTitle"></w-header>
    <div class="input-parent clearfix">
      <!--手机号-->
      <div class="input-wrapper">
        <div class="input-box">
          <input placeholder="请输入您的手机号" v-model="phone"/>
        </div>
      </div>
      <!--手机号 end-->

      <!--验证码-->
      <div class="input-wrapper">
        <div class="input-box min-input">
          <input placeholder="请输入验证码" v-model="code"/>
        </div>
        <div class="code-btn">
          <button @click="getCode()" :disabled="isDisabled">{{nodeText}}</button>
        </div>
      </div>
      <!--验证码 end -->
    </div>

    <div class="login-button">
      <button @click="goLogin()">登录</button>
    </div>

    <div class="tips">
      <span @click="weixinLogin()">转到微信登录</span>
    </div>

    <!--弹框-->
    <!-- <Toast v-if="showSuccessToast"></Toast> -->

  </div>

</template>

<script type="text/ecmascript-6">
  import selectOne from '../modules/select/selectOne'
  import indexFooter from '../footer/index-footer'
  // import Toast from '../modules/w-toast/w-toast'
  import WHeader from '../modules/wheader/wheader.vue'
  export default {
    name: 'Login',
    data(){
      return{
        nodeText:'获取验证码',
        second: 10,
        isDisabled: false,
        showSuccessToast: false,
        phone: '',
        code: '',
        headerTitle: "登录"
      }
    },
      components: {
        selectOne,
        indexFooter,
        // Toast,
        WHeader
      },
    methods:{
      getCode(){
        this.isDisabled = true;
        if (this.second === -1) {
          this.second = 10;
          this.startTime();
        }else{
          this.startTime();
        }
      },
      startTime(){
        this.isDisabled = true;
        //倒计时
        if (this.second > 0) {
          this.second--;
          this.nodeText = this.second + "秒";
          setTimeout(() => {
            this.startTime();
          }, 1000);
        }else {
          //计时结束
          this.isDisabled = false;
          this.second = -1;
          this.nodeText = "重新获取验证码";
        }
      },
      toLoginWei(){
        this.$router.push('loginWei');
      },
      goLogin(){
//        if(!this.phone){
//          this.showToast("用户名不能为空", 2,1500);
//        }else{
//          if(!this.code){
//            this.showToast("验证码不能为空", 2,1500);
//          }else{
//            //判断帐号密码是否正确
//
//            //获取用户信息
//            this.$store.state.userInfo.userType = "1";
//          }
//        }
        this.$store.state.userType = "1";
        this.$store.state.token = "1212jjj"
        this.$router.push("/");
      }//登录按钮

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" type="text/scss" scoped>
  @import '../../assets/config.scss';
  .login{
    background: #fff;
    width: 100%;
    height:100%;
    margin: 0;
    padding: 0;
    font-size: 0.6rem;

    .input-parent{
      width: 100%;
      margin: 4.7rem 0 2.2rem 0;
      padding: 0 8.5%;

      .input-wrapper{
        height: 1.5rem;
        line-height: 1.5rem;
        width: 100%;
        border-bottom: 0.025rem solid #eee ;

        .input-box{
          height: 100%;
          width: 100%;

          &.min-input{
            text-align: left;
            width: 60%;
            display: inline-block;

            input{
              width: 100%;
              border-right: 0.025rem solid #eee;
            }
          }

          input{
            width: 100%;
            height: 60%;
            padding: 0 5%;
          }
        }//input-box

        .code-btn{
          display: inline-block;
          width: 35%;
          height: 100%;

          button{
            background-color: #fff;
            color: $inline-color;
            margin:  0 auto;
            width: 100%;
            height: 90%;
          }//button
        }//code-btn
      }//input-wrapper
    }

    .login-button{
      width: 100%;
      height: 1.4rem;
      padding: 0 8.5%;

      button{
        width: 100%;
        height: 100%;
        background-color: $header-color;
        color: #fff;
        border-radius: 0.3rem;
      }
    }

    .tips{
      width: 100%;
      height: 2rem;
      margin-top: 1rem;
      color: $inline-color;

      span{
        display: inline-block;
        height: 100%;
      }
    }
  }

</style>
