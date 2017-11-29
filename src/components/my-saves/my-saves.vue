<template>
  <div class="my-saves">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <!--收藏列表模块-->
      <div class="save-list-wrapper mescroll"  id="mescroll">
        <div>
          <div v-for="val in pageList">
            <!-- 长租 -->
            <div class="save-box clearfix" v-if="val.type == 1" @click="toDayRentDetail(val)">
              <div class="save-left">
                <img :src="val.images?val.images.split(',')[0]:''" :onerror="defaultImg">
              </div>
              <div class="save-right">
                <h1>{{val.title}}</h1>
                <article>
                  <p>
                    <span>{{val.housetype}}·{{val.acreage | m2}}</span>
                    <em>{{val.cost}}/月</em>
                  </p>
                  <p>
                    <i></i>
                    <span>距离当前位置{{val.distance || 0}}m</span>
                  </p>
                  <p>
                    <span v-if="val.keyword" v-for="arr in (val.keyword?val.keyword.split(','):'')">{{arr}}</span>
                  </p>
                </article>
              </div>
            </div>
            <!-- 出售 -->
            <div class="save-box clearfix" v-if="val.type == 2" @click="toDayRentDetail(val)">
              <div class="save-left">
                <img :src="val.images?val.images.split(',')[0]:''" :onerror="defaultImg">
              </div>
              <div class="save-right">
                <h1>{{val.title}}</h1>
                <article>
                  <p>
                    <span>{{val.housetype}}·{{val.acreage | m2}}</span>
                    <em>面议</em>
                  </p>
                  <p>
                    <i></i>
                    <span>距离当前位置{{val.distance || 0}}m</span>
                  </p>
                  <p>
                    <span v-if="val.keyword" v-for="arr in (val.keyword?val.keyword.split(','):'')">{{arr}}</span>
                  </p>
                </article>
              </div>
            </div>
            <!-- 日租 -->
            <div class="save-box clearfix" v-if="val.type == 3" @click="toDayRentDetail(val)">
              <div class="save-left">
                <img :src="val.images?val.images.split(',')[0]:''" :onerror="defaultImg">
              </div>
              <div class="save-right">
                <h1>{{val.title}}</h1>
                <article>
                  <p>
                    <span>{{val.housetype}}·{{val.acreage | m2}}</span>
                  </p>
                  <p>
                    <em>日租:￥{{val.cost}}</em>
                    <em>钟点:￥{{val.wage}}</em>
                  </p>
                  <p>
                    <i></i>
                    <span>距离当前位置{{val.distance || 0}}m</span>
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--收藏列表模块 end -->
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
  name: 'orderList',
  data() {
    return {
      defaultImg: 'this.src="' + require('../../../static/img/pic.png') + '"',
      headerTitle: "我的收藏",
      pageList: [],
      message: {
        page: -1,
        pageSize: 5,
        userid: ""
      }
    }
  },
  components: {
    indexFooter,
    WHeader
  },
  created() {

  },
  mounted(){
    var userInfo = this.getLocation("userInfo");
    this.message.userid = userInfo.id;
    this.mescroll = new MeScroll("mescroll", {
      down: {
        auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
        callback: this.downCallback //下拉刷新的回调
      },
      up: {
        auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
        callback: this.upCallback //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
      }
    });
  },
  methods: {
    downCallback(){
      this.getMySaves();//获取房源信息
    },
  upCallback(){

    var API = this.$store.state.api;
    var that = this;
    this.message.page++;
    this.$http.post(API.collectLoadPage,this.message,{
      headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      emulateJSON: true
    }).then((res) => {
      var result =res.body;
      if(result.state == 1){
        var data = result.data;
        that.mescroll.endSuccess(data.length);
        that.pageList =that.pageList.concat(data);
      }else{
        that.showToast(result.message, 2,1500);
        //联网失败的回调,隐藏下拉刷新的状态
        that.mescroll.endErr();
      }
    });

  },
    toDayRentDetail(value) {
      this.setLocation("houseId", value.id);
      this.$router.push('dayRentDetail');
    },
    getMySaves(){
      var API = this.$store.state.api;
      var self = this;

      this.showLoading('正在获取收藏房源数据...');
      this.$http.post(API.collectLoadPage, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        this.hideLoading();
        if (result.state == 1) {
          var data = result.data;
          this.pageList = data; //获取房源列表
          //联网成功的回调,隐藏下拉刷新的状态
          self.mescroll.endSuccess(data.length);
        } else {
          this.showToast(result.message, 2, 1500);
          //联网失败的回调,隐藏下拉刷新的状态
          self.mescroll.endErr();
        }
      });
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.my-saves {
  width: 100%;
  height: 100%;
  margin: 0;

  .middle-wrapper {

    .save-list-wrapper {
      width: 100%;
      background-color: #fff;
      padding-left: 0.75rem;

      .save-box {
        width: 100%;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;

        .save-left {
          width: 37.5%;
          float: left;

          img {
            width: 100%;
          }
        }

        .save-right {
          float: right;
          width: 62.5%;
          padding: 0 3%;
          text-align: left;

          h1 {
            font-size: 0.75rem;
          } //h1
          article {
            p {
              font-size: 0.6rem;
              margin-top: 0.5rem;

              &:first-child {
                span {
                  color: #666;
                }

                em {
                  color: #f00602;
                  float: right;
                }
              } //p1
              &:nth-child(2) {
                i {
                  width: 0.5rem;
                  height: 0.6rem;
                  background: url("/static/img/ad_ico.png") no-repeat;
                  background-size: 100% 100%;
                  margin-right: 0.6rem;
                }

                span {
                  vertical-align: middle;
                  color: #808080;
                }
              } //p2
              &:nth-child(3) {
                span {
                  display: inline-block;
                  color: #84d9b2;
                  height: 0.95rem;
                  line-height: 0.95rem;
                  padding: 0 0.4rem;
                  border-radius: 0.2rem;
                  border: 0.05rem solid #84d9b2;
                  margin-right: 0.325rem;
                }
              } //p3
            } //p
          } //article
        } //save-right
      } //save-box
    }
    /*save-list-wrapper end */
  }
  /*middle-wrapper end */
}
</style>
