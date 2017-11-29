<template>
  <div id="app">
    <Toast></Toast>
    <pop-alert></pop-alert>
    <loading></loading>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    created(){
      this.init(); //微信
    },
    methods: {
      //判断是否微信登陆 是不是微信浏览器
      isWeiXin() {
        let ua = window.navigator.userAgent.toLowerCase();
        console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          return true;
        } else {
          return false;
        }
      },
      init() {
        var hrefs = window.location.href;
        console.log(this.GetQueryString('code'));
        // var CODE = hrefs.indexOf('?') !== -1?hrefs.split("?")[1].split("&")[0].split("=")[1]:'';
        var CODE = this.GetQueryString('code');
        var API = this.$store.state.api;
        var that = this;

        //获取用户信息
        // that.checkUser()
        if(!CODE) {
          // this.$router.replace('/userInfo');
          return;
        }

        this.$http.get(API.getWeiUserInfo + "?code=" + CODE, {
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
          emulateJSON: true
        }).then(function (res) {
          var result = res.body;
          if (result.state == 1) {
            var data = result.data;
            that.setLocation("userInfo",data); // 储存微信用户信息
            that.checkUser(); //获取用户信息
          } else {
            alert("微信用户信息获取失败");
          }
        });

      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import 'assets/common.css';
  @import "assets/config";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #f0eff5;

  }

  /*//点击goa按钮*/




</style>
