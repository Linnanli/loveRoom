<template>
  <div class="about-us">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper" >

      <div class="page-content-top"></div>
      <div v-html="teamInfo.content"></div>

      <div class="contact-us-wrapper">
        <h1>联系我们</h1>
        <p class="mg-bt"><i class="call-img"></i>加盟电话：{{teamInfo.joinphone}}</p>
        <p><i class="address-img"></i>公司地址：{{teamInfo.address}}</p>
      </div>
    </div>
    <!--底部-->
    <div class="footer-wrapper">
      <div>{{teamInfo.joinphone}}</div>
      <button  @click="showPop('拨打电话',teamInfo.joinphone,'呼叫',tel)">联系我们</button>
    </div>
    <!--底部 end -->
    <!-- <pop-alert></pop-alert> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import WHeader from '../modules/wheader/wheader.vue'
  // import popAlert from '../modules/pop/pop-alert.vue'
    export default {
      name: 'aboutUs',
      data() {
          return {
            headerTitle: "合作加盟",
            teamInfo:{},
            datas: "<p style='color:red'>图文信息</p>"
          }
      },
      created(){
        this.getTeamInfo();
      },
      components: {
        WHeader
        // popAlert
      },
      methods: {
        tel(){
          window.location.href = 'tel:'+this.teamInfo.joinphone;
          this.closePop();
        },
        getTeamInfo(){
          var that = this;
          var API = this.$store.state.api;
          that.teamInfo = teamInfo.data[0];
          this.$http.get(API.getTeamInfo).then((res) => {
            var result = res.body;
            if(result.state == 1){ //获取成功
              var data = result.data;
              that.teamInfo = data[0]; //获取个人信息
            }else{
              that.showToast(result.message, 2,1500);
            }

          })
        }
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  .about-us{
    width: 100%;
    height: 100%;
    margin: 0;

    .middle-wrapper{

      .page-content-top{
        width: 100%;
        height: 10.75rem;
        background: url("/static/img/jiameng_bac.png") no-repeat;
        background-size: 100% 100%;
      }
      /*page-content-top  end */

      .detail-wrapper{
        background-color: #fff;
        padding: 0 0.8rem 1.5rem 0.8rem;

        .detail-box {
          padding-top: 0.9rem;

          article {
            text-align: left;

            h1 {
              font-size: 0.7rem;
              width: 100%;
              margin: 0;
              font-weight: normal;
            }

            p {
              font-size: 0.6rem;
              color: #8c8c8c;
            }
          }

          .article-us {
            text-align: left;

            h1 {
              font-size: 0.75rem;
              width: 100%;
              margin: 0;
              text-align: center;
              font-weight: normal;
            }

            p {
              font-size: 0.65rem;
              color: #666;
            }
          }

          .detail-img-box {
            width: 100%;
            margin-top: 0.9rem;

            img {
              width: 100%;
            }
          }
          /*detail-img-box end */
        }
        /*detail-box end */
      }
      /*detail-wrapper end*/

      .contact-us-wrapper{
        margin-top: 0.5rem;
        background-color: #fff;
        padding: 0.6rem 0.75rem 1rem 0.75rem ;
        text-align: left;

        h1{
          font-size: 0.75rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .mg-bt{
          margin-bottom: 0.5rem;
        }

        p{
          font-size: 0.6rem;
          line-height: 1.25rem;
          color: #686868;

          i{
            display: inline-block;
            width: 0.6rem;
            height: 0.65rem;
            vertical-align: middle;
            margin-right: 0.4rem;

            &.call-img{
              background: url("/static/img/jiameng_ico01.png") no-repeat;
              background-size: 100% 100%;
            }

            &.address-img{
              background: url("/static/img/jiameng_ico02.png") no-repeat;
              background-size: 100% 100%;
            }
          }//i
        }//p
      }
      /*contact-us-wrapper end */
    }
    /*middle-wrapper end */

    .footer-wrapper{
      position: fixed;
      bottom: 0;
      left: 0;
      height: 2.5rem;
      width: 100%;
      line-height: 2.5rem;
      bdaily-top:0.025rem solid #c0c0c3 ;
      font-size: 0.5rem;
      color: #a7a7a8;

      div,button{
        width: 50%;
        display: inline-block;
        float: left;
        text-align: center;
      }

      div{
        background-color: #fff;
        font-size: 0.6rem;
        color: #686868;
      }

      button{
        background-color: #3daf7b;
        font-size: 0.75rem;
        color: #fff;
        height: 100%;
        bdaily: 0;
      }
    }
    /*footer-wrapper end */
  }
</style>
