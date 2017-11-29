``<template>
  <div class="daily-breakfast-list">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <!--头部菜单-->
      <div class="daily-menu-wrapper">
        <ul class="OBmenu-ul">
          <li class="OBmenu" v-for="(val,index) in searchMenu" :class="selectType==index+1?'select':''" @click="getOBType(index)">{{val}}</li>
        </ul>
      </div>

      <!--头部菜单 end -->

      <!--民宿列表-->
      <div class="day-contain-warp">
        <!--条件选择-->
        <div class="ob-alert" v-if="showAlert">
          <div class="ob-bg"></div>
          <!--区域选框-->
          <div class="OBtype1" v-if="showAlert==1">
            <div class="ob-left">
              <ul>
                <li>区域</li>
              </ul>
            </div>
            <div class="ob-right">
              <ul>
                <li :class="{'action':message.address == val.text}" v-for="val in areaList" @click="getAreaId(val.text)">{{val.text}}</li>
              </ul>
            </div>
          </div>
          <!--区域选框 end -->

          <!--价格选框-->
          <div class="OBtype2" v-if="showAlert==2">
            <div class="ul-box">
              <ul>
                <li :class="{'action':message.cost == val.value}" v-for="val in priceList" @click="getPriceVal(val.value)">{{val.name}}</li>
              </ul>
            </div>
          </div>
          <!--价格选框 end -->

          <!--排序类型-->
          <div class="OBtype2" v-if="showAlert==3">
            <div class="ul-box">
              <ul>
                <li :class="{'action':message.sorts == val.value}" v-for="val in orderByType" @click="getOrderByTypeVal(val.value)">{{val.name}}</li>
              </ul>
            </div>
          </div>
          <!--排序类型 end -->

          <!--排序类型-->
          <div class="OBtype2" v-if="showAlert==4">
            <div class="more-box">
              <div class="title">户型</div>
              <!--选择户型-->
              <div class="box">
                <input class="houseType-item-input" type="text" v-model="message.housetype" placeholder="如:三室一厅">
              </div>
              <!--选择户型 end -->

              <!--选择特色-->
              <div class="box">
                <div class="title">特色</div>
                <checker v-model="message.keyword" default-item-class="houseType-item" selected-item-class="houseType-item-selected">
                  <checker-item value="">不限</checker-item>
                  <checker-item value="四室一厅">四室一厅</checker-item>
                  <checker-item value="水电齐全">水电齐全</checker-item>
                  <checker-item value="拎包入住">拎包入住</checker-item>
                </checker>
              </div>
              <!--选择特色 end -->
            </div>
          </div>
          <!--排序类型 end -->
        </div>
        <!--条件选择end-->
        <div class="daily-list-wrapper" id="mescroll">
          <!-- <div v-if="!houseInfoList[0]">没有数据</div> -->
          <div>
            <div class="daily-list-box clearfix" v-for="val in houseInfoList" @click="toDayRentDetail(val)">
              <div class="daily-list-left">
                <img :src="val.house.images?val.house.images.split(',')[0]:''" :onerror="defaultImg">
                <div v-if="val.house.state != 4" class="mask">已住满</div>
              </div>
              <div class="daily-list-right">
                <h1>{{val.house.title}}</h1>
                <article>
                  <p>{{val.house.housetype}}·{{val.house.acreage | m2}}</p>
                  <p class="clearfix">
                    <em>日租:￥{{val.house.cost}}</em>
                    <em>钟点:￥{{val.house.wage}}</em>
                  </p>
                  <p>
                    <i></i>
                    <span>距离当前位置{{val.distance || 0}}m</span>
                  </p>
                  <p>
                    <span v-if="val.house.keyword" v-for="arr in (val.house.keyword?val.house.keyword.split(','):'')">{{arr}}</span>
                  </p>
                </article>
              </div>
            </div>
          </div>

        </div>
      </div>
      <!--民宿列表 end -->
    </div>
    <!-- <Loading></Loading> -->
  </div>
  <!--底部 end -->
</template>

<script type="text/ecmascript-6">
import WHeader from '../modules/wheader/wheader.vue'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'

export default {
  name: 'orderList',
  data() {
    return {
      defaultImg: 'this.src="' + require('../../../static/img/pic.png') + '"',
      headerTitle: "日租民宿",
      selectType: "",
      // searchMenu: ["区域", "价格", "排序", "更多"],
      searchMenu:["区域","价格", "更多"],
      orderByType: [{ value: null, name: "推荐排序" }, { value: "evaluates,desc", name: "好评优先" }, { value: "cost,asc", name: "价格低到高" }, { value: "cost,desc", name: "价格高到低" }],
      areaList: [],
      areaType: 1, //搜索区域的等级
      message: {
        cost: null,//价格列表默认值
        address: '',//区域名称
        housetype: '',//户型默认值
        sorts: null,//排序
        keyword: '',
        page: '-1',
        pageSize: '5',
        type: '3',
        poi: ''
      },
      showAlert: false,
      priceList: [{ //价格列表
        name: '不限租金', value: null
      }, {
        name: '500元以下', value: '500,less'
      }, {
        name: '500-1000元', value: '500-1000,among'
      }, {
        name: '1000-1500元', value: '1000-1500,among'
      }, {
        name: '1500-2000元', value: '1500-2000,among'
      }, {
        name: '2000-3000元', value: '2000-3000,among'
      }, {
        name: '3000-4500元', value: '3000-4500,among'
      }, {
        name: '4500元以上', value: '4500,than'
      }],
      houseInfoList: [],//展示房源信息
      messageCopy: {//用来存储用户查询条件，判断参数是否发生改变
        isInit: true
      },
      mescroll: null
    }
  },
  components: {
    WHeader,
    Checker,
    // Loading,
    CheckerItem
  },
  mounted() {
    //初始化区域菜单
    var areaCope = this.$store.state.threeArea;
    //精确到县、区
    if (areaCope.countyId) {
      this.areaList = dists_data[areaCope.cityId];
      this.areaType = 3;
      //精确到市
    } else if (areaCope.cityId) {
      this.areaList = citys_data[areaCope.provinceId];
      this.areaType = 2;
      //精确到省
    } else {
      this.areaList = provs_data;
      this.areaType = 1;
    }
    //获取用户位置经纬度
    var addressPoint = this.getLocation("addressInfo");
    //初始化参数设置
    this.message.address = this.getLocation("userArea");
    this.message.poi = addressPoint.lat + ',' + addressPoint.lng;

    //初始化分页对象，挂载下拉和上拉方法
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
    //下拉刷新页面
    downCallback() {
      this.message.page = '0';
      this.messageCopy.isInit = true;
      this.requestHouseList('pull');//获取房源信息
    },
    //上拉获取新数据
    upCallback() {
      var API = this.$store.state.api;
      this.message.page++;

      // this._copyMessage();
      this.$http.post(API.getMyRooms, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      })
        .then(function(res) {
          var result = res.body;

          if (result.state == 1) {
            this.houseInfoList = this.houseInfoList.concat(result.data);
            //联网成功的回调,隐藏下拉刷新的状态
            this.mescroll.endSuccess(result.data.length);
          } else {
            this.showToast(result.message, 2, 1500);
            //联网失败的回调,隐藏下拉刷新的状态
            this.mescroll.endErr();
          }
        });

    },
    _copyMessage() {
      for (var key in this.message) {
        this.messageCopy[key] = this.message[key];
      }
    }, //初始化备份参数值，用来判断前后值是否发生变化
    toDayRentDetail(value) {
      this.setLocation("houseId", value.house.id);
      this.$router.push('dayRentDetail');
    },
    getOBType(index) {
      this.selectType = index + 1;
      //判断当前点击选择框是否显示
      if (index == this.showAlert - 1) {
        //关闭'更多'选项时触发,判断number输入框输入是否正确
        // if (index == 3) {
        //   //如果输入英文则提示输入错误
        //   if (/[a-zA-Z]/.test(this.message.housetype)) {
        //     alert('请输入正确的数字或者不输入');
        //     return;
        //   }
        // }
        //再次点击时候隐藏弹框
        this.showAlert = false;
        this.selectType = false;
        //发起请求
        this.requestHouseList();
      } else {
        //第一次点击
        this.showAlert = index + 1;
      }

    },
    getAreaId(name) {
      //区域选框事件,获取到要搜索的区域
      this.message.address = name;
      this.showAlert = false;
      //初始化时或者值发生变化时发起请求
      this.requestHouseList();
    },//获取用户选择的价格值
    getPriceVal(cost) {
      this.message.cost = cost;
      //隐藏头部选项
      this.showAlert = false;
      this.requestHouseList();
    },//获取排序选项的值
    getOrderByTypeVal(sorts) {
      this.message.sorts = sorts;
      this.showAlert = false;
      this.requestHouseList();
    },
    //判断数据是否相等
    _isEqual() {
      for (var key in this.message) {
        if (this.messageCopy[key] != this.message[key])
          return false;

      }
      return true;
    },//请求房屋列表数据
    requestHouseList(type) {
      var API = this.$store.state.api;
      //是否是下拉刷新
      var isShowPrompt = type === 'pull';

      if (this.messageCopy.isInit === true || !this._isEqual()) {

        this.messageCopy.isInit = false;
        this._copyMessage();

        !isShowPrompt && this.showLoading('数据正在加载中...');
        this.$http.post(API.getMyRooms, this.message, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        })
          .then(function(res) {
            var result = res.body;
            !isShowPrompt && this.hideLoading();
            if (result.state == 1) {
              this.houseInfoList = result.data;
              //联网成功的回调,隐藏下拉刷新的状态

              this.mescroll.endSuccess(result.data.length);
            } else {
              this.houseInfoList = [];
              this.showToast(result.message, 2, 1500);
              //联网失败的回调,隐藏下拉刷新的状态
              this.mescroll.endErr();
            }
          }, function(res) {
            alert(res.status);
            //联网失败的回调,隐藏下拉刷新的状态
            this.mescroll.endErr();
          });
      }


    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";
.daily-breakfast-list {
  width: 100%;
  height: 100%;
  margin: 0;

  .middle-wrapper {
    height: 94%;
    overflow: hidden;
    .daily-menu-wrapper {
      width: 100%;
      height: 2.2rem;
      line-height: 2.15rem;
      font-size: 0.7rem;
      background: #fff; // position: fixed;
      // z-index: 1001;
      .OBmenu-ul {
        width: 100%;
        border-bottom: 0.025rem solid #e6e6e6;

        .OBmenu {
          display: inline-block;
          // width: 24%;
          width: 30%;
          text-align: center;
          background: url("/static/img/ico_02.png") no-repeat 85% 0.9rem;
          background-size: 0.5rem;
        }

        .select {
          color: $header-color;
          background: url("/static/img/ico_01.png") no-repeat 85% 0.9rem;
          background-size: 0.5rem;
        }
      }
    }
    /*daily-menu-wrapper end*/
    .day-contain-warp{
      position: relative;
      height: 100%;
    }
    .ob-alert {
      font-size: 0.75rem;
      line-height: 2rem;
      text-align: left;

      .ob-bg {
        // position: fixed;
        position: absolute;
        background: rgba(17, 17, 17, 0.7);
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
      }

      .OBtype1 {
        position: absolute;
        width: 100%;
        background-color: #fff;
        z-index: 1001;
        // top: 2.2rem;
        top: 0;

        .ob-left {
          width: 40%;
          border-right: 0.025rem solid #f7f7f7;
          display: inline-block;
          float: left;

          ul {
            li {
              padding-left: 26%;
              background-color: #eee;
            }
          }
        }

        .ob-right {
          min-height: 8rem;
          display: inline-block;
          float: right;
          width: 60%;
          text-align: left;
          border-left: 0.025rem solid #f7f7f7;
          overflow: scroll;

          ul {
            padding-left: 5%;

            li {
              border-bottom: 0.025rem solid #f7f7f7;
              font-size: 0.75rem;
              line-height: 2rem;
            }
            li.action {
              color: #51ca94;
            }
          }
        }
      }

      .OBtype2 {
        position: absolute;
        width: 100%;
        background-color: #fff;
        z-index: 1001;
        // top: 2.2rem;

        .ul-box {
          min-height: 6rem;

          ul {
            li {
              padding-left: 10%;
              border-bottom: 0.025rem solid #f7f7f7;
            }
            li.action {
              color: #51ca94;
            }
          }
        }

        .more-box {
          padding: 0 10%;

          .box {
            display: inline-block;
            margin-bottom: 0.5rem;

            .houseType-item {
              border: 1px solid #ececec;
              padding: 0 0.5rem;
              line-height: 1.2rem;
              margin: 0.5rem 0.5rem 0 0;
            }
            .houseType-item-selected {
              border: 1px solid $inline-color;
            }
            .houseType-item-input {
              border: 1px solid $inline-color;
              width: 4.5rem;
              margin-right: 0.125rem;
            }
            .houseType-item-text {
              vertical-align: middle;
              display: inline-block;
            }
          }
        }
      }
    }

    .daily-list-wrapper {
      width: 100%;
      background: #fff; // margin-top: 2.1rem;
      padding-left: 3%; // top: 3.6rem;
      height: 93%;
      overflow: scroll;
      .daily-list-box {
        width: 100%;
        padding: 0.75rem 0;

        .daily-list-left {
          width: 37.5%;
          max-height: 5.95rem;
          overflow: hidden;
          float: left;
          position: relative;
          img {
            width: 100%;
          }
          .mask{
            width: 100%;
            height: 1.25rem;
            line-height: 1.25rem;
            position: absolute;
            bottom: 0;
            background-color: #000;
            opacity: 0.5;
            font-size: 0.6rem;
            color: #fff;
          }
        } //daily-list-left
        .daily-list-right {
          float: right;
          width: 62.5%;
          padding: 0 3%;
          text-align: left;

          h1 {
            font-size: 0.75rem;
          }

          article {
            width: 100%;

            p {
              width: 100%;
              font-size: 0.6rem;
              color: #666;
              display: inline-block;
              margin-top: 0.5rem;

              &:nth-child(2) {
                em {
                  color: $red;

                  &:first-child {
                    float: left;
                  }

                  &:last-child {
                    float: right;
                  }
                }
              } //p2
              &:nth-child(3) {
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
              } //p3
              &:nth-child(4) {

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
              }

            } //p
          } //article
        } //daily-list-right
      }
      /*daily-list-box end */
    }
    /*daily-list-wrapper end */
  }
  /*middle-wrapper end */
}
</style>
``