<template>
  <div class="my-rooms">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <div class="order-menu-wrapper">
        <ul>
          <li :class="ListIndex==index?'select':''" v-for="(val,index) in menuList" @click="getOBType(index)">{{val.name}}</li>
        </ul>
      </div>
      <!--收藏列表模块-->

      <div class="save-list-wrapper mescroll" id="mescroll">
        <div>
          <div class="save-box clearfix" v-for="(val,index) in pageList" :key="val.house.id">
            <div class="save-left">
              <img :src="val.house.images?val.house.images.split(',')[0]:''" :onerror="defaultImg">
            </div>
            <div class="save-right">
              <h1>{{val.house.title}}</h1>
              <article>
                <p>
                  <span>{{val.house.housetype}}·{{val.average}}²·{{val.house.orientation}}</span>
                  <em v-if="val.house.type==3">{{val.house.cost}}元/天</em>
                  <em v-if="val.house.type==1">{{val.house.cost}}元/月</em>
                  <em v-if="val.house.type==2">{{val.house.cost}}万</em>
                </p>
                <p>
                  <span>发布时间:{{val.house.createtime}}</span>
                </p>
                <p>
                  <span>
                    <span @click="myRoomDetail(val)">点击查看房屋详情</span>
                    <i  v-if="val.house.type!=3" @click="editRoom(val)"></i>
                  </span>
                  <span  v-if="val.house.type!=3" @click="deleteRoom(val,index)">
                    <i class="delete"></i>
                  </span>
                </p>

              </article>
            </div>
          </div>
        </div>

      </div>

      <!--收藏列表模块 end -->
    </div>
    <!--弹框-->
    <!-- <Toast v-if="showSuccessToast"></Toast> -->
  </div>
</template>

<script type="text/ecmascript-6">
import WHeader from '../modules/wheader/wheader.vue'

export default {
  name: 'orderList',
  data() {
    return {
      defaultImg: 'this.src="' + require('../../../static/img/pic.png') + '"',
      headerTitle: "我的房源",
      menuList: [{ name: '日租', value: '3' }, { name: '出租', value: '1' }, { name: '出售', value: '2' }],
      ListIndex: '0',
      showSuccessToast: false,
      pageList: [],
      imagesList: [],
      message: {
        page: -1,
        pageSize: 5,
        type: "1",
        userid: ""
      },
      mescroll: null
    }
  },
  components: {
    WHeader
  },
  mounted() {
    //初始化参数设置
    var userInfo = this.getLocation("userInfo");
    this.message.userid = userInfo.id;
    var roomsIndex = this.getLocation('myRoomsTypeIndex');
    this.ListIndex = roomsIndex?roomsIndex:'0';
    this.message.type = this.menuList[this.ListIndex].value;

    //创建MeScroll对象
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
      this.message.page = 0;
      this.getMyRooms('pull');//获取房源信息
    },
    upCallback() {

      var API = this.$store.state.api;
      this.message.page++;

      this.$http.post(API.getMyRooms, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        if (result.state == 1) {
          var data = result.data;
          this.pageList = this.pageList.concat(data);
          this.mescroll.endSuccess(data.length);
        } else {
          this.showToast(result.message, 2, 1500);
          //联网失败的回调,隐藏下拉刷新的状态
          this.mescroll.endErr();
        }
      });

    },
    toOrderDetail() {
      this.$router.push('orderDetail');
    },
    myRoomDetail(val) {
      this.$router.push("/dayRentDetail");
      this.setLocation("houseId", val.house.id); //传房屋id
    }, //查看房源信息
    getOBType(index) {
      this.ListIndex = index;
      this.setLocation('myRoomsTypeIndex',index);
      this.message.type = this.menuList[index].value;
      this.message.page = 0;
      this.getMyRooms();
    }, //选择房屋出售类型的时候，重新获取该类型的房源
    getMyRooms(type) {
      var API = this.$store.state.api;
      var isPull = type ==='pull';

      //不是下拉刷新的弹出提示遮罩
      !isPull&&this.showLoading("正在查询房源信息...");
      this.$http.post(API.getMyRooms, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        // var result = JSON.parse(res.bodyText);
        var result = res.body;
        !isPull&&this.hideLoading();
        if (result.state == 1) {
          var data = result.data;
          this.pageList = data; //获取房源列表
          //联网成功的回调,隐藏下拉刷新的状态
          this.mescroll.endSuccess(data.length);
        } else {
          this.pageList = [];
          this.showToast(result.message, 2, 1500);
          //联网失败的回调,隐藏下拉刷新的状态
          this.mescroll.endErr();
        }
      });
    },//获取当前我的房源列表
    editRoom(val) {
      this.$router.push("/releaseRoom");
      this.setLocation("houseId", val.house.id);//传房屋id
    },//编辑房屋
    deleteRoom(val,index) {
      var that = this;
      var API = this.$store.state.api;
      var ID = val.house.id;

      if (ID) {
        this.showPop('删除房源信息', '是否确认删除？', '确认', function() {
          //关闭确认弹窗
          that.closePop();
          
          that.showLoading("正在删除房源信息...");
          that.$http.post(API.deleteHouse, { ids: ID }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            emulateJSON: true
          }).then((res) => {
            var result = res.body;
            if (result.state == 1) {
              that.showToast("删除成功", 1, 1500);
              that.pageList.splice(index,1);
              that.hideLoading();
              // this.getMyRooms(); //刷新房源
            } else {
              that.showToast(res.message, 2, 1500);
            }
          });
        });
      }

    },//删除房源
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.my-rooms {
  width: 100%;
  height: 100%;
  margin: 0;

  .middle-wrapper {
    height: 94%;
    overflow: hidden;

    .order-menu-wrapper {
      height: 2.2rem;
      line-height: 2.15rem;
      font-size: 0.7rem;
      background: #fff;

      ul {
        width: 100%;

        li {
          display: inline-block;
          width: 32%;
          text-align: center;
        }

        .select {
          color: #51ca94;
          border-bottom: 0.1rem solid #51ca94;
        }
      }
    }

    .save-list-wrapper {
      width: 100%;
      height: 93%;
      overflow: scroll;
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
                span+span{
                  border-left: 0.025rem solid #e6e6e6;
                }
                span {
                  display: inline-block;
                  color: #898989;
                  
                  &:first-child {
                    // border-right: 0.025rem solid #e6e6e6;
                    width: 75%;

                    span {
                      display: inline-block;
                      width: 65%;
                      border: none;
                    }

                    i {
                      width: 20%;
                      height: 0.7rem;
                      background: url("/static/img/fangyuan_bianji.png") no-repeat;
                      background-size: 0.625rem 0.7rem;
                      margin-left: 0.5rem;
                    }
                  }

                  &:last-child {
                    i {
                      width: 0.75rem;
                      height: 0.75rem;
                      background: url("/static/img/faangyuan_shangchu.png") no-repeat;
                      background-size: 100% 100%;
                      margin: 0 0.5rem;
                      vertical-align: middle;
                    }
                  }
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
