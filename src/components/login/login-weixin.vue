<template>
  <div class="login">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <div class="logo-wrapper clearfix">
        <div class="logo-box">
          <img src="/static/img/logo.png"/>
        </div>
        <strong class="title">爱民居</strong>
      </div>

      <div class="notice">
        <h1>网页由该公众号开发，请确认授权一下信息</h1>
        <p><i>·</i><span>获得你的公开信息（昵称、头像）</span></p>
      </div>

      <div class="login-button">
        <button type="button" @click="loginWeiXin()">确认登录</button>
      </div>

      <!--<div class="tips" >-->
        <!--<span @click="toLogin()">转到帐号密码登录</span>-->
      <!--</div>-->
    </div>
    </div>


</template>

<script type="text/ecmascript-6">
  import selectOne from '../modules/select/selectOne'
  import indexFooter from '../footer/index-footer'
  import WHeader from '../modules/wheader/wheader.vue'
  export default {
    name: 'index',
    data(){
      return{
        nodeText:'获取验证码',
        second: 10,
        isDisabled: false,
        headerTitle: "微信登录"
      }
    },
      components: {
        selectOne,
        indexFooter,
        WHeader
      },
    methods:{
      toLogin(){
        this.$router.push('login');
      },
      loginWeiXin(){
        this.weixinLogin();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" type="text/scss" scoped>
@import "../../assets/config";
  .login{
    background: #fff;
    width: 100%;
    height:100%;
    margin: 0;
    font-size: 0.6rem;

    .middle-wrapper{
      padding: 0 8.5%;

      .logo-wrapper{
        width: 100%;
        margin-top: 2.9rem;
        padding: 0 8.5%;
        border-bottom: 0.025rem solid #eee;

        .logo-box{
          width: 2.05rem;
          height: 2.05rem;
          margin: 0 auto;

          img{
            width: 100%;
          }
        }

        .title{
          display: inline-block;
          width: 100%;
          margin: 0.6rem 0;
          color: $logo-color;
          font-size: 0.7rem;
          font-weight: bold;
        }
      }

      .notice{
        margin: 0.8rem 0 2rem 0;
        text-align: left;
        line-height: 1.5rem;

        p{
          i{
            font-size: 1.5rem;
            margin-right: 0.4rem;
          }

          span{
            color: #999;
          }
        }
      }

      .login-button{
        width: 100%;
        height: 1.4rem;

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


  }

</style>
