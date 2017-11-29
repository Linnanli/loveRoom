<template>
  <div class="user-page">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <div class="user-menu-wrapper">
        <!--用户-->
        <ul>
          <li class="header-img-li">
            <span>我的头像</span>
            <span></span>
            <span class="img-box">
              <img :src="message.avatar" :onerror="defaultImg" ref="loadImg"/>
            </span>
            <span class="go-box">
              <i class="go-icon"></i>
            </span>
            <input type="file" @change="getNewPhoto()" ref="headerImg" accept="image/*">
          </li>
          <li>
            <span>用户名</span>
            <input class="user-name" v-model="message.nicename">
            <span class="go-box" @click="toggleElist()">
              <i class="go-icon"></i>
            </span>
          </li>
          <li>
            <span>姓名</span>
            <input class="user-name" v-model="message.name">
            <span class="go-box" @click="toggleElist()">
              <i class="go-icon"></i>
            </span>
          </li>
          <li>
            <span>手机号码</span>
            <input class="user-name" v-model="message.phone">
            <span class="go-box">
              <i class="go-icon"></i>
            </span>
          </li>
          <li>
            <span>身份证</span>
            <input class="user-name" v-model="message.card">
            <span class="go-box">
              <i class="go-icon"></i>
            </span>
          </li>
          <!--<li>-->
          <!--<span>性别</span>-->
          <!--<div class="box">-->
          <!--<checker v-model="sexType" default-item-class="payType-item" selected-item-class="payType-item-selected">-->
          <!--<checker-item value="1">男</checker-item>-->
          <!--<checker-item value="2">女</checker-item>-->
          <!--</checker>-->
          <!--</div>-->
          <!--<span class="go-box" @click="toggleElist()">-->
          <!--<i class="go-icon"></i>-->
          <!--</span>-->
          <!--</li>-->
          <!--<li>-->
          <!--<span>生日</span>-->
          <!--<input class="user-name" v-model="userName">-->
          <!--<span class="go-box" @click="toggleElist()">-->
          <!--<i class="go-icon"></i>-->
          <!--</span>-->
          <!--</li>-->
        </ul>

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

      </div>
    </div>
    <!--底部-->
    <div class="footer-wrapper">
      <button @click="saveUser()">保存</button>
    </div>
    <!--底部 end -->
  </div>
</template>

<script type="text/ecmascript-6">
  import Checker from 'vux/src/components/checker/checker.vue'
  import CheckerItem from 'vux/src/components/checker/checker-item.vue'
  import WHeader from '../modules/wheader/wheader.vue'
  export default {
    name: 'user',
    data() {
      return {
        defaultImg: 'this.src="' + require('../../../static/img/me_bac_head.png') + '"',
        headerTitle:"个人资料",
        imagesList:[],
        userInfo:{},
        message:{
          phone:"",
          openid:"",
          card:"",
          name:"",
          nicename:"",
          avatar:"",
          cardphoto:'',//身份证照片
        }
      }
    },
    created(){
      this.$store.state.footerSelect = 3;
      var userInfo = this.userInfo = this.getLocation("userInfo")||{};
// userInfo.openid = 'obJDz0oGOVhCrVQTUmeh9-T2D2Pk';
      //当用户没有注册时
      if(!userInfo.id){
        this.message.phone = userInfo.phone?userInfo.phone:""
        this.message.openid = userInfo.openid,
        this.message.card = userInfo.card?userInfo.card:"",
        this.message.name = userInfo.name?userInfo.name:"",
        this.message.nicename = userInfo.nickname,
        this.message.avatar = userInfo.headimgurl?userInfo.headimgurl:""
      }
      //当编辑用户信息时
      if(userInfo.id){
        this.message.phone = userInfo.phone;
        this.message.openid = userInfo.openid;
        this.message.card = userInfo.card;
        this.message.name = userInfo.name;
        this.message.nicename = userInfo.nicename;
        this.message.avatar = userInfo.avatar?userInfo.avatar:"";
        this.imagesList = userInfo.cardphoto?userInfo.cardphoto.split(','):[];
      }
    },
    mounted(){

    },
    components: {
      WHeader,
      Checker,
      CheckerItem
    },
    methods:{
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

          that.$http.post(API.userNewToImg,form, {
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
      getNewPhoto(){
        var that = this;
        var API = this.$store.state.api;
        // 通过DOM取文件数据
        var inputDOM = this.$refs.headerImg;
        var file = inputDOM.files[0];
        var form = new FormData();
        form.append('file',file);

        if (/^image/.test(file.type)) {

            that.$http.post(API.userNewToImg,form, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
              emulateJSON: true
            })
              .then((res) => {
                var result = res.body;
                if (result.state == 1) {
                  that.message.avatar = result.message; //获取到图片链接
                } else {
                  that.showToast(result.message, 2, 1500); //提交远程提交图片失败
                }
              });
        }

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
      saveUser(){
        //提交个人资料信息
        if (!this.message.nicename) {
          this.showToast('请输入用户名', 2, 1500);
          return;
        }else if (!this.message.name) {
          this.showToast('请输入姓名', 2, 1500);
          return;
        }else if (!this.message.phone) {
          this.showToast('请输入手机号码', 2, 1500);
          return;
        }else if (!this.message.card) {
          this.showToast('请输入身份证号码', 2, 1500);
          return;
        }else if (!this.imagesList[0]) {
          this.showToast('请传入身份证照片', 2, 1500);
          return;
        }

        var that=this;
        var API = this.$store.state.api;
        // var userInfo = this.getLocation("userInfo")||{};
        var THISURL = "";// 访问的URL
        this.message.cardphoto = this.imagesList.join(',');

        if(this.userInfo.id){ // 如果已经有id了
          THISURL = API.userUpdate;
        }else{
          THISURL = API.userSave;
        }
        this.message.openid = this.userInfo.openid;

        this.showLoading('正在提交数据');
        this.$http.post(THISURL,this.message,{
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          this.hideLoading();
          if(result.state==1){
            //alert(result.message);
            this.getUserInfo();
            this.showToast('保存成功', 1, 1500); 
            this.back(function(){
              this.$router.replace('/');
            },1500);
          }else{
            that.showToast(res.message, 2,1500);
          }
        },(error)=>{
            alert(window.JSON.stringify(error));
        });
      },
      toUserPage(){
        this.$router.push("/user");
      }

    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/config";
  .user-page{
    width: 100%;
    height: 100%;
    margin: 0;

    .middle-wrapper{
      margin-bottom: 0;


      .user-menu-wrapper{
        margin-bottom: 3rem;

        ul{
          background-color: #fff;
          font-size: 0.7rem;
          padding-left: 0.75rem;
          text-align: left;

          .header-img-li{
            height: 3rem;
            line-height: 3rem;
            position: relative;

            .img-box{
              display: inline-block;
              width: 2.5rem;
              height: 2.5rem;
              position: absolute;
              right: 15%;

              img{
                width: 100%;
                height: 100%;
              }
            }

            input[type=file]{
              opacity: 0;
              width: 100%;
              height: 100%;
              border: 0.025rem solid #eee;
              position: absolute;
              top: 0;
            }

          }

          li{
            height: 2.15rem;
            line-height: 2.15rem;
            position: relative;

            .user-name,.box{
              display: inline-block;
              position: absolute;
              right: 16%;
              height: 2.15rem;
              text-align: right;
              width: 60%;
              top: 0;
            }

            .box {
              display: inline-block;
              margin-bottom: 0.5rem;
              font-size: 0.6rem ;

              .payType-item {
                border: 1px solid #ececec;
                padding: 0 0.5rem;
                line-height: 1.2rem;
                margin: 0.5rem 0.5rem 0 0 ;
              }
              .payType-item-selected {
                border: 1px solid $inline-color;
              }
            }

            .sex-box{
              float: right;
              line-height: 2rem;
              margin-right: 3rem;
              width: 20%;
              text-align: right;
            }


          }

          li+li{
            border-top:0.05rem solid #e5e5e5;
          }

        }
      }
    }

    .footer-wrapper{
      position: fixed;
      bottom: 0;
      width: 100%;

      button{
        height: 2.25rem;
        width: 100%;
        background-color: $header-color;
        color: #fff;
        font-size: 0.8rem;
      }
    }
    //.item-wrapper 
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
