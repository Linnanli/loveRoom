<template>
  <div class="user-page">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <div class="user-top" >
        <div class="head-photo-box" @click="toUserInfo()">
          <img :src="userInfo.avatar" :onerror="defaultImg"/>
        </div>
        <div class="head-name-box">
          <span>{{userInfo.nicename?userInfo.nicename:""}}</span>
        </div>
      </div>
      <div class="user-menu-wrapper">
        <!--用户 和清洁工 v-if="userInfo.type==1 || userInfo.type==3"-->
         <ul>
          <li><i class="menu4"></i><span>我的余额</span> <em>￥{{userInfo.money || '0.00'}}</em> 
           <button @click="toWithdraw()">提现</button> 
          </li>
        </ul> 

        <!--用户 v-if="userInfo.type=='1'"-->
        <!-- <ul v-if="userInfo.type==1">
          <li @click="toOrderList()" >
            <i class="menu1"></i>
            <span>全部订单</span>
            <span class="go-box" >
              <i class="go-icon"></i>
            </span>
          </li>
        </ul> -->
        <!-- 所有用户-->
        <ul>
          <li @click="toOrderList()" >
            <i class="menu1"></i>
            <span>全部订单</span>
            <span class="go-box" >
              <i class="go-icon"></i>
            </span>
          </li>
          <li @click="toMySaves()">
            <i class="menu2"></i>
            <span>我的收藏</span>
            <span class="go-box" >
              <i class="go-icon"></i>
            </span>
          </li>
          <li @click="callWe()"><i class="menu3"></i><span>联系我们</span></li>
        </ul>
        <!--房主  v-if="userInfo.type==2"-->
        <ul v-if="userInfo.type==2">
          <li  @click="toMyRooms()">
            <i class="menu5"></i><span>我的房源</span>
            <span class="go-box">
              <i class="go-icon"></i>
            </span>
          </li>
          <li @click="toReleaseRoom()">
            <i class="menu6"></i>
            <span>发布房源</span>
            <span class="go-box">
              <i class="go-icon"></i>
            </span>
          </li>
        </ul>
        <!-- 普通用户可申请入驻-->
        <ul v-if="userInfo.type==1">
          <li @click="applyEnter()"><i class="menu7"></i><span>申请入驻</span></li>
        </ul>

        <!--清洁工 v-if="userInfo.type=='3' || userInfo.type=='2'"-->
 
        <ul v-if="userInfo.type==3">
          <li @click="toMyTask()">
            <i class="menu1"></i>
            <span>我的任务</span>
            <span class="go-box">
              <i class="go-icon"></i>
            </span>
          </li>
        </ul> 

      </div>
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
  import WHeader from '../modules/wheader/wheader.vue'
    export default {
        name: 'user',
        data() {
            return {
              defaultImg: 'this.src="' + require('../../../static/img/me_bac_head.png') + '"',
              headerTitle:"个人信息",
              userInfo:{
                nicename: "",
                money:"",
                type: "1",//用户类型：1 普通用户 2 房东 3清洁员(后台分配，从属于房东)
                avatar:""
              }
            }
        },
      created(){
        this.$store.state.footerSelect = 3;
      },
      mounted(){
        this.$store.state.roomDetailInfo=[];
        //初始化用户基本信息
        var userInfo = this.getLocation("userInfo");
        if(userInfo){
         
          this.userType = userInfo.type;
          this.userInfo = {
            nicename: userInfo.nicename?userInfo.nicename:(userInfo.nickname?userInfo.nickname:""),
            money:userInfo.money?userInfo.money:"",
            type: userInfo.type?userInfo.type:"",
            avatar: userInfo.avatar?userInfo.avatar:(userInfo.headimgurl?userInfo.headimgurl:'')
          }
        }
      },
      components: {
        indexFooter,
        WHeader
      },
      methods:{
        toOrderList(){
          //初始化订单项索引值
          this.removeLocation('orderListItemIndex');
          this.$router.push('/orderList');
        },
        toMySaves(){
          this.$router.push('mySaves');
        },
        toMyRooms(){
          this.setLocation('myRoomsTypeIndex',0);
          this.$router.push('/myRooms');
        },
        toWithdraw(){
          this.setLocation('toWithdraw',{
            money:this.userInfo.money
          });
          this.$router.push('/withdraw');
        },
        toReleaseRoom(){//发布房源
          this.setLocation("houseId","");
          this.$router.push('/releaseRoom')
        },
        toMyTask(){
          this.$router.push('/myTasks')
        },
        toUserInfo(){
          this.$router.push('/userInfo')
        },
        //联系我们
        callWe(){
          this.$router.push('/aboutUs');
        },
        //申请入驻
        applyEnter(){
          this.$router.push('/doLandlord');
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

      .user-top{
        width: 100%;
        height: 8.75rem;
        background: url("/static/img/me_gr.png") no-repeat;
        background-size: 100% 100%;
        padding: 2rem;
        box-sizing: border-box;

        .head-photo-box{
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          background-color: #fff;
          margin: auto;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }

        .head-name-box{
          margin-top: 0.65rem;
          width: 100%;
          text-align: center;
          font-size: 0.5rem;
          color: #ffffff;
        }
      }

      .user-menu-wrapper{
        margin-top: 0.5rem;
        margin-bottom: 3rem;

        ul{
          background-color: #fff;
          font-size: 0.7rem;
          padding-left: 0.75rem;
          text-align: left;

          li{
            height: 2.15rem;
            line-height: 2.15rem;
            border-bottom:0.05rem solid #e5e5e5;

            .go-box{

              .go-icon{
                width: 0.4rem;
                float: right;
                position: relative;
                top: 50%; /*偏移*/
                transform: translateY(-50%);
                margin-right: 40%;
              }
            }

            em{
              color: $red;
              margin-left: 10%;
            }

            button{
              background-color: $header-color;
              color:#fff;
              padding: 0.3rem 0.7rem;
              border: none;
              border-radius: 0.3rem;
              float: right;
              margin: 0.3rem 3% 0 0;
            }

            i{
              display: inline-block;
              width: 1.1rem;
              height: 1rem;
              vertical-align: middle;
              margin-right: 1.5rem;
            }

            .menu1{
              background: url('/static/img/order.png') no-repeat;
              background-size: 100% 100%;
            }
            .menu2{
              background: url('/static/img/save-img.png') no-repeat;
              background-size: 100% 100%;
            }
            .menu3{
              background: url('/static/img/home_tab_06.png') no-repeat;
              background-size: 100% 100%;
            }
            .menu4{
              background: url('/static/img/me_ico01.png') no-repeat;
              background-size: 100% 100%;
            }
            .menu5{
              background: url('/static/img/me_ico02.png') no-repeat;
              background-size: 100% 100%;
            }
            .menu6{
              background: url('/static/img/me_ico03.png') no-repeat;
              background-size: 100% 100%;
            }
            .menu7{
              background: url('/static/img/me_ico04.png') no-repeat;
              background-size: 100% 100%;
            }

            span{
              vertical-align: middle;
            }
          }
          /*li*/
          &:last-child{
            border-bottom: none;
          }
        }
      }

    }
  }
</style>
