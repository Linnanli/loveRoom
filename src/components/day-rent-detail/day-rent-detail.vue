<template>
  <div class="day-rent-Detail">
    <w-header :title="headerTitle"></w-header>

    <div class="middle-wrapper" v-if="isLoadComplete">
      <!--详情轮播图+地址价格信息-->
      <div class="middle-top-content">
        <div class="carousel-wrapper">
          <carousel v-if="imagesList[0]" :images="imagesList"></carousel>
        </div>
        <!--日租-->
        <div class="middle-top-detail"  v-if="houseInfo.type==3">
          <h1>{{houseInfo.title}} {{houseInfo.acreage}}㎡</h1>
          <p><em>日租：￥{{houseInfo.cost}}</em><em>押金：￥{{houseInfo.pledge}}</em></p>
        </div>
        <!--长租或者出售-->
        <div class="house-rent-detail" v-if="houseInfo.type==2|| houseInfo.type==1" >
          <h1>{{houseInfo.title}} {{houseInfo.acreage}}㎡</h1>
          <p><span>更新时间： {{houseInfo.createtime}}</span> <em v-if="houseInfo.type==1">{{houseInfo.cost}}元 /月</em></p>
        </div>
        <div class="house-sell-detail"  v-if="houseInfo.type==2" >
          <div>
            <span>售价</span>
            <em>¥{{houseInfo.cost}}</em>
          </div>
          <div>
            <span>户型</span>
            <em>{{houseInfo.housetype}}</em>
          </div>
          <div>
            <span>建筑面积</span>
            <em>{{houseInfo.acreage | m2}}</em>
          </div>
        </div>

      </div>
      <!--详情轮播图+地址价格信息 end -->

      <!--&lt;!&ndash;预订时间模块&ndash;&gt;-->
      <!--<div class="rent-date little-box" @click="toDayRentOrder()" v-if="houseInfo.type=='1'">-->
        <!--<p>-->
          <!--<i class="date-icon"></i>-->
          <!--<span>07月27日(今天) - 07月28日(明天) 1晚</span>-->
          <!--<i class="go-icon"></i>-->
        <!--</p>-->
      <!--</div>-->
      <!--&lt;!&ndash;预订时间模块 end &ndash;&gt;-->

      <!--评论-->
      <div class="evaluation-box" v-if="houseInfo.type==3">
        <p class="room-score little-box" >
          <span class="toEvaluationBox" @click="toEvaluation()">
            <span>房间评价</span>
            <span>
                <em>{{average}}</em>
                <span></span>
            </span>
            <span>{{evaluates.length}}条评论</span>
          </span>
          <span class="go-box" @click="toggleElist()">
            <i class="go-icon"></i>
          </span>
        </p>

        <!--评论列表-->
        <div class="room-evaluation-list" v-if="showElist">
          <div class="room-evaluation-box clearfix" v-for="val in evaluates">
            <h1>
              <span>{{val.createuser}}</span>
              <em>{{val.createtime}}</em>
            </h1>
            <p>{{val.evacontent}}</p>
          </div >
        </div>
        <!--评论列表 end -->
      </div>
      <!--评论 end -->

      <!--房间详情-->
      <div class="detail-box-wrapper">
        <div class="detail-top">
          <div class="detail-top-box clearfix">
            <div><span>方式：</span>
              <span>{{houseInfo.type | houseType}}</span>
            </div>
            <div><span>面积：</span>{{houseInfo.acreage}}</div>
          </div>
          <div class="detail-top-box clearfix">
            <div><span>户型：</span>{{houseInfo.housetype}}</div>
            <div><span>朝向：</span>{{houseInfo.orientation}}</div>
          </div>
          <div class="detail-top-box clearfix">
            <div><span>装修：</span>{{houseInfo.decoration}}</div>
            <div><span>楼层：</span>{{houseInfo.floor}}</div>
          </div>
        </div>

        <div class="detail-bottom">
          <h1>配套设置</h1>
          <p>
            <span v-for="val in facility"><i></i>{{val.name}}</span>
          </p>
        </div>
      </div>
      <!--房间详情 end -->

      <!--周边设置-->
      <div class="about-around">
        <article>
          <h1>周边设施</h1>
          <p class="article-container" :style="{'height':toggleAround?'auto':'20px'}" v-html="houseInfo.describes"></p>
        </article>

        <!--<div class="img-box" v-if="showAroundImg">-->
          <!--<img src="/static/img/pic.png">-->
        <!--</div>-->

        <p class="show-icon" @click="toggleAroundImg()"><i></i></p>
      </div>
      <!--周边设置 end -->

      <!--详细地址-->
      <roomMap v-if="addressInfo.coord" :addressInfo="addressInfo"></roomMap>

    </div>
    <!--底部-->
    <div class="footer-wrapper">
      <div @click="saveToggle()">
        <i :class="isSaved?'save':'unSave'"></i>
        <p>{{isSaved?'已收藏':'收藏'}}</p>
      </div>
      <button @click="showPop('拨打电话',houseInfo.phone,'呼叫',tel)"  v-if="houseInfo.type != 3">联系房东</button>
      <button @click="toDayRentOrder()"  v-if="houseInfo.type==3" :disabled="houseInfo.state!=4">{{houseInfo.state!=4?'已住满':'立即预订'}}</button>
    </div>
    <!--底部 end -->
  </div>
</template>

<script type="text/ecmascript-6">
   import carousel from '@/components/modules/carousel/carousel' //轮播图
   import roomMap from '../modules/map/map'
   import WHeader from '../modules/wheader/wheader.vue'
//   import popAlert from '../modules/pop/pop-alert.vue'
//   import Loading from  '../modules/loading/loading'
//   import Toast from '../modules/w-toast/w-toast'

    export default {
      name: 'aboutUs',
      data() {
          return {
            tradingType: "1",
            showAroundImg: false,
            isSaved: false,
            showElist: false,
            isLoadComplete:false,//是否加载完成
            headerTitle: "商品详情",
            average:0,//房源评级
            evaluates:[],//房源评论
            userid:'',//用户id
            collectid:'',//收藏id
            houseInfo: '',
            facility: [],
            imagesList:[],
            toggleAround:false,
            showSuccessToast:false,
            addressInfo:{
              address: "",
              coord: ""
            }
          }
      },
      created(){
        this.tradingType = this.$store.state.tradingType
        var self = this;
        //获取房源信息接口
        var API = this.$store.state.api;
        //获取用户信息
        var userInfo = this.getLocation("userInfo");
        this.houseId = this.getLocation("houseId");
        this.userid = userInfo.id;

        this.showLoading('正在加载详情...');
        this.$http.post(API.getHouseDetail,{
          id:this.houseId,
          userid:this.userid
        },{
          headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          this.hideLoading();
          if(result.state == 1){
            var data = result.data;
            this.houseInfo = data[0].house; //获取房源列表
            this.setLocation("houseInfo", data[0].house);
            this.isLoadComplete = true;
            //日租房源设置评论参数
            if(this.houseInfo.type == 3){
                //评级
                this.average = data[0].average?data[0].average.toFixed(1):0;
                //评论数据
                if(data[0].evaluate){
                  this.evaluate = data[0].evaluate;
                  this.evaluates = this.evaluate.evaluates;
                }
                
            }
            //设置轮播图参数
            if(this.houseInfo.images){
              this.imagesList = this.houseInfo.images.split(',');
            }
            //设置配套设施数据
            this.facility = data[0].facility;
            //设置收藏状态和收藏ID
            this.isSaved = data[0].collect;
            this.collectid = data[0].collectid;
            //設置地圖信息
            if(this.houseInfo){
              this.addressInfo = {
                address: this.houseInfo.address?this.houseInfo.address:"",
                coord: this.houseInfo.coord?this.houseInfo.coord:""
              }

            }

            
          }else{
            this.showToast(result.message, 2,1500);
          }
        });

      },
      components: {
        carousel,
        roomMap,
        WHeader,
//        Loading,
//        Toast,
//        popAlert
      },
      methods: {
        //跳转评论页面
        toEvaluation: function () {
          if(this.evaluate){
            this.setLocation('houseEvaluate',{
              average:this.average,
              evaluate:this.evaluate
            });
            this.$router.push('evaluation');
          }
        },
        toDayRentOrder: function () {
          this.$router.push('dayRentOrder');
        },
        //展开周边设施
        toggleAroundImg: function(){
          this.toggleAround = !this.toggleAround;
        },
        toggleElist: function(){
          if(!this.evaluate)return;

          if(this.showElist){
            this.showElist = false;
          }else{
            this.showElist = true;
          }
        },
        //点击收藏房屋
        saveToggle: function () {
          var API = this.$store.state.api;
          //获取用户信息
          // var userInfo = this.getLocation("userInfo");

          if(this.isSaved == false){

            this.isSaved = true;
            //收藏房源信息
            this.$http.post(API.collectSave,{
              houseid:this.houseId,
              userid:this.userid
              // userid:'13'
            },{
              headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
              emulateJSON: true
            }).then((res) => {
              var result = res.body;
              if(result.state == 1){
                // var data = result.data;
                this.showToast("收藏成功", 1,1500);
              }else{
                this.showToast(result.message, 2,1500);
              }
            });

          }else{

              this.isSaved = false;
              //取消收藏
              this.$http.post(API.collectDelete,{
                ids:this.collectid
              },{
                headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                emulateJSON: true
              }).then((res) => {
                var result = res.body;
                if(result.state == 1){
                  // var data = result.data;
                  this.showToast("取消收藏", 1,1500);
                }else{
                  this.showToast(result.message, 2,1500);
                }
              });

          }

        },
        tel(){
          console.log("拨打成功");
          window.location.href = 'tel:'+ this.houseInfo.phone;
          this.closePop();
        }

      }
    }
</script>

<style lang="scss" type="text/scss">
  @import "../../assets/config";
  .day-rent-Detail{
    width: 100%;
    height: 100%;
    margin: 0;

    .middle-wrapper{

      .go-icon{
        float: right;
        position: relative;
        top: 50%; /*偏移*/
        transform: translateY(-50%);
      }

      h1{
        width: 100%;
        color:#676767;
        text-align: left;
        font-size: 0.65rem;
      }

      .middle-top-content{
          background-color: #fff;

        .carousel-wrapper{
          height: 10.95rem;
          width: 100%;
          background-color: #fff;
        }//middle-top-detail

        .middle-top-detail{
          text-align: left;
          font-size: 0.75rem;
          padding: 0.875rem 3% 0.625rem 3%;

          h1{
            margin-bottom: 0.7rem;
            color: #333;
          }

          p{
            color: $red;

            em{
              &:last-child{
                float: right;
                margin-right: 10.66%;
              }
            }
          }
        }//middle-top-detail

        .house-rent-detail{
          text-align: left;
          font-size: 0.75rem;
          padding: 0.875rem 3% 0.625rem 3%;

          h1{
            margin-bottom: 0.7rem;
            color: #333;
          }
          span{
            font-size: 0.6rem;
            color: #676767;
          }

          em{
            float: right;
            color: $red;
            margin-right: 10.66%;
          }
        }//house-rent-detail


        .house-sell-detail{
          font-size: 0.65rem;
          padding: 1rem 0;
          border-top: 0.025rem solid #f4f4f4;

          div{
            display: inline-block;
            width: 30%;
            border-right: 0.025rem solid #eee;

            &:last-child{
              border: none;
            }

            span{
              display: block;
            }

            em{
              color: $red;
            }
          }
        }
      }
      /*middle-top-content end */

      .little-box{
        background-color: #fff;
        height: 2.5rem;
        line-height: 2.5rem;
        margin-top: 0.5rem;
        font-size: 0.6rem;
        text-align: left;
        padding: 0 3%;
      }

      .rent-date{

        p{
          width: 100%;
          height: 100%;

          i{
            display: inline-block;
            vertical-align: middle;

            &.date-icon{
              height: 0.925rem;
              width: 0.925rem;
              background: url("/static/img/rizu_day.png") no-repeat;
              background-size: 100% 100%;
              margin-right: 3%;
            }
          }//p
        }//rent-date


      }//rent-date

      .evaluation-box{
        color: #676767;

        p{
          width: 100%;
          height: 2.5rem;
          border-bottom: 0.02rem solid #f4f4f4;

          .toEvaluationBox{
            display: inline-block;
            height: 100%;
            width: 90%;

            span{

              &:nth-child(2){
                color: $red;
              }

              &:nth-child(3){
                margin-left: 5%;
              }
            }//span
          }//toEvaluationBox

          .go-box{
            display: inline-block;
            width: 10%;
            height: 100%;
            float: right;
          }
        }//p

        .room-evaluation-list{
          padding: 0 3%;
          font-size: 0.6rem;
          background-color: #fff;

          .room-evaluation-box{
            text-align: left;
            margin-bottom: 2.15rem;
            width: 100%;
            h1{
              margin-top: 1.25rem;
              margin-bottom: 0.65rem;

              em{
                float: right;
                color: #666;
              }
            }//h1

            p{
              font-size: 0.5rem;
              color: #656565;
              line-height: 0.9rem;
            }

          }//room-evaluation-box
        }
        /*room-evaluation-list end */
      }//evaluation-box

      .detail-box-wrapper{
        background-color: #fff;
        margin-top: 0.5rem;
        padding: 0 3%;
        font-size: 0.65rem;

        .detail-top{
          padding-bottom: 0.875rem;
          border-bottom: 0.025rem solid #f3f3f3;

          .detail-top-box{
            width: 100%;

            div{
              display: inline-block;
              float: left;
              width: 50%;
              text-align: left;
              margin-top: 0.8rem ;

              span{
                color: #676767;
              }
            }
          }
        }//detail-top

        .detail-bottom{
          margin-top: 0.55rem;
          padding-bottom: 1.5rem;

          p{
            text-align: left;
            font-size: 0.6rem;

            span{
              display: inline-block;
              width: 24%;
              margin-top: 0.875rem;
              vertical-align: middle;
            }

            i{
              display: inline-block;
              width: 0.625rem;
              height: 0.625rem;
              background: url("/static/img/action.png") no-repeat;
              background-size: 100% 100%;
              vertical-align: middle;
              margin-right: 0.5rem;
            }
          }
        }//detail-bottom

      }
      /*detail-box-wrapper end*/

      .about-around{
        width: 100%;
        margin-top: 0.5rem;
        background-color: #fff;
        padding: 0.8rem 3% 0 3%;

        article{
          .article-container{
            // width: 100%;
            margin: 0.5rem 0;
            text-align: left;
            font-size: 0.65rem;
            line-height: 0.9rem;
            overflow: hidden;
            img{
              width: 100%;
            }

            // p{
              // width: 100%;
            //   word-wrap:break-word ;
            //   img{
            //     width: 100%;
            //   }
            // }
            

          }
        }

        .img-box{
          width: 100%;

          img{
            width: 100%;
            margin-top: 0.5rem;
          }

        }//img-box

        .show-icon{
          width: 100%;
          height: 1.5rem;
          margin: 0;
          padding-top: 0.5rem;

          i{
            display: block;
            height: 0.35rem;
            width: 0.7rem;
            background: url("/static/img/ico_02.png") no-repeat;
            background-size: 100% 100%;
            margin: 0 auto;
          }
        }//p
      }//about-around
    }
    /*middle-wrapper end */

    .footer-wrapper{
      position: fixed;
      bottom: 0;
      left: 0;
      height: 2.5rem;
      width: 100%;
      line-height: 2.5rem;
      border-top:0.025rem solid #c0c0c3 ;
      font-size: 0.5rem;
      color: #a7a7a8;

      div,button{
        width: 50%;
        display: inline-block;
        float: left;
        text-align: center;
      }
      button[disabled]{
        background-color: #ccc;
      }

      div{
        background-color: #fff;
        font-size: 0.6rem;
        color: #686868;
        padding-top: 0.4rem;

        i{
          display: block;
          width: 0.925rem;
          height: 0.825rem;
          margin: 0 auto;

          &.save{
            background: url("/static/img/chuzhu_shoucang.png") no-repeat;
            background-size: 100% 100% ;
          }

          &.unSave{
            background: url("/static/img/chuzhu_shoucang01.png") no-repeat;
            background-size: 100% 100% ;
          }
        }

        p{
         display: block;
          height: 1.25rem;
          line-height: 1.25rem;
          text-align: center;
        }
      }

      button{
        background-color: $header-color;
        font-size: 0.75rem;
        color: #fff;
        height: 100%;
        bdaily: 0;
      }
    }
    /*footer-wrapper end */
  }
</style>
