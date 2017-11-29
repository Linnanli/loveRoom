<template>
  <div class="my-saves">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <!--任务列表模块-->
      <div class="save-list-wrapper" id="mescroll">
        <div>
          <div class="save-wrapper" v-for="(val,index) in dataList" @click="updateState(index)">
            <div class="save-box clearfix">
              <h1>
                <i></i>
                <span class="title">{{val.task.housetitle}}</span>
                <span class="tip do">{{val.task.type==1?'未完成':'已完成'}}</span>
              </h1>
              <article>
                <p>
                  <i class="i1"></i>
                  <span>{{val.task.starttime}}之后开始</span>
                  <!-- <span>09:30之后开始</span> -->
                </p>
                <p>
                  <i class="i2"></i>
                  <span>{{val.address}}</span>
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
      <!--任务列表模块 end -->
    </div>
    <!-- <pop-alert></pop-alert> -->
  </div>
</template>

<script type="text/ecmascript-6">
import WHeader from '../modules/wheader/wheader.vue'
// import popAlert from '../modules/pop/pop-alert.vue'
export default {
  name: 'orderList',
  data() {
    return {
      defaultImg: 'this.src="' + require('../../../static/img/pic.png') + '"',
      headerTitle: "我的任务",
      // taskInfo: [{ taskType: 1 }],
      img: '',//头像图片
      mescroll: null,
      dataList: [],
      message: {
        userid: '',
        page: '-1',
        pageSize: '5'
      }
    }
  },
  components: {
    WHeader
    // popAlert
  },
  mounted() {
    var userinfo = this.getLocation("userInfo");
    console.log(userinfo);
    this.message.userid = userinfo.id;

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
    downCallback() {
      var API = this.$store.state.api;
      this.message.page = 0;

      this.$http.post(API.taskLoadPage, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      })
        .then(function(res) {
          var result = res.body;
          if (result.state == 1) {
            this.dataList = result.data;
            //联网成功的回调,隐藏下拉刷新的状态
            this.mescroll.endSuccess(result.data.length);
          } else {
            this.showToast(result.message, 2, 1500);
            //联网失败的回调,隐藏下拉刷新的状态
            this.mescroll.endErr();
          }
        });
    },
    upCallback() {
      var API = this.$store.state.api;
      this.message.page++;
      var self = this;

      this.$http.post(API.taskLoadPage, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      })
        .then(function(res) {
          var result = res.body;
          console.log(result);
          if (result.state == 1) {
            this.dataList = this.dataList.concat(result.data);
            //联网成功的回调,隐藏下拉刷新的状态
            this.mescroll.endSuccess(result.data.length);
          } else {
            this.showToast(result.message, 2, 1500);
            //联网失败的回调,隐藏下拉刷新的状态
            this.mescroll.endErr();
          }
        });
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
    updateState(index) {
      console.log(index);
      var self = this;
      var API = this.$store.state.api;
      var data = this.dataList[index];
      if(type == 2)return;
      this.showPop('任务', '确认打扫完成', '确认', function() {

        self.$http.post(API.updateTask, {
          id:data.task.id,
          userid:data.task.userid,
          houseid:data.task.houseid
        }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        })
          .then(function(res) {
            var result = res.body;
            self.closePop();
            if (result.state == 1) {
                // self.dataList.splice(index,1);
                self.showToast(result.message, 1, 1500);
            } else {
              self.showToast(result.message, 2, 1500);
            }
          });
      });
      

    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";
.my-saves {
  width: 100%;
  height: 100%;
  margin: 0;

  .middle-wrapper {
    // height: ;
    .save-list-wrapper {
      width: 100%;
      height: 100%;
      overflow-y: auto;

      .save-wrapper {
        padding-left: 0.75rem;
        background-color: #fff;

        .save-box {
          width: 100%;
          padding: 0 0 0.5rem 3%;
          text-align: left;

          i {
            margin-right: 3%;
            width: 0.875rem;
            height: 0.9rem;
          }

          h1 {
            border-bottom: 0.025rem solid #eee;
            padding-right: 3%;
            font-size: 0.75rem;
            line-height: 1.7rem;

            i {
              background: url("/static/img/clear_ico01.png") no-repeat;
              background-size: 100% 100%;
            }

            span {
              display: inline-block;

              &.title {
                width: 64%;
              }

              &.tip {
                line-height: 1.2rem;
                color: #fff;
                padding: 0 0.4rem;
                border-radius: 0.1rem;
              }

              &.do {
                background-color: $do-color;
              }

              &.did {
                background-color: $did-color;
              }
            }
          }

          p {
            font-size: 0.65rem;
            color: #999;
            margin-top: 0.8rem;

            .i1 {
              background: url("/static/img/clear_ico02.png") no-repeat;
              background-size: 0.725rem 0.725rem;
            }

            .i2 {
              background: url("/static/img/clear_ico03.png") no-repeat;
              background-size: 0.625rem 0.775rem;
            }
          }
        } //save-box
      }

      .save-wrapper+.save-wrapper {
        margin-top: 0.5rem;
      }
    }
    /*save-list-wrapper end */
  }
  /*middle-wrapper end */
}
</style>
