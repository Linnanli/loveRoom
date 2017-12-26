<template>
  <div class="index">

    <div class="middle-wrapper">
      <!-- <div class="header-wrapper">
        <div class="title-box">爱民居</div>
      </div> -->
      <div class="index-top">
        <div class="index-top-select">
          <div class="select-out-wrapper clearfix">
            <input readonly="" name="input_area" placeholder="城市选择" v-model="area" @click="getArea()" />
          </div>
        </div>
      </div>
      <!--首页菜单栏-->
      <div class="index-menu-wrapper clearfloat">
        <div class="index-menu-box clearfloat">
          <div class="select1" @click="toHouseRent()">
            <i></i>
            <span>房屋出租</span>
          </div>
          <div class="select2" @click="toHouseSell()">
            <i></i>
            <span>房屋出售</span>
          </div>
          <div class="select3" @click="toDayRent()">
            <i></i>
            <span>日租民宿</span>
          </div>
        </div>
        <div class="index-menu-box">
          <div class="select4" @click="toAboutUS()">
            <i></i>
            <span>合作加盟</span>
          </div>
          <div class="select5" @click="toLandlord()">
            <i></i>
            <span>房东招募</span>
          </div>
        </div>
      </div>
      <!--首页菜单栏 end -->
      <!--房源推荐模块-->
      <div class="index-recommend">
        <div class="recommend-title">
          <h1>房屋推荐</h1>
          <p>
            <span>总有一款</span>
            <span>属于你的房源</span>
          </p>
        </div>
        <!--推荐房源列表-->
        <div class="recommendList" id="mescroll">
          <div class="recommend-box clearfix">
            <div class="recommend-good margin-rt" v-for="val in recommendHouse" @click="lookHouseDetail(val)">
              <div class="img-box">
                <img :src="val.house.images?val.house.images.split(',')[0]:''">
              </div>
              <div class="content-box">
                <span>{{val.house.title}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--推荐房源列表  end -->
      </div>
      <!--房源推荐模块 end-->
    </div>
    <!--底部-->
    <div class="footer-wrapper">
      <indexFooter></indexFooter>
    </div>
    <!--底部 end -->
    <!-- <Loading></Loading> -->
  </div>
</template>

<script type="text/ecmascript-6">
import selectOne from './modules/select/selectOne'
import indexFooter from './footer/index-footer'
// import Loading from './modules/loading/loading'
export default {
  name: 'index',
  data() {
    return {
      area: "",
      recommendHouse: [],//推荐房源数据
      message: {
        istop: '1',
        page: '-1',
        pageSize: '5',
        poi: ''
      }
    }
  },
  components: {
    selectOne,
    indexFooter
    // Loading
  },
  created() {
    this.$store.state.footerSelect = 1;
    this.getUserInfo(); //测试时候获取用户信息
    this.getFacilityList();
    //获取推荐房源数据
    this.getRecommendHouse();
  },
  mounted() {
    var cope = this.$store.state.threeArea; 
    var that = this;
    that.area = cope.countyName ? cope.countyName : (cope.cityName ? cope.cityName : (cope.provinceName ? cope.provinceName : ""));
    this.setLocation("userArea", that.area);//保存地址

    //判断用户是否有选择的地址 如果没有 获取当前地址
    if (!this.getLocation("userArea")) {
      this.showLoading("获取当前城市...");
      //获取当前地址信息
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point);
          // console.log('您的位置：'+r.point.lng+','+r.point.lat); //当前经纬度
          that.setLocation("addressInfo", r.point);

          var address = r.address; //当前地址
          //遍历省列表
          if (address.province) {
            for (var i = 0; i < provs_data.length; i++) {
              if (provs_data[i].text == address.province) {
                cope.provinceName = address.province;
                cope.provinceId = provs_data[i].value;
              }
            }
          }

          //遍历市列表
          if (address.city && cope.provinceId) {
            var provId = cope.provinceId;
            var city_data = citys_data[provId]; //市列表
            for (var i = 0; i < city_data.length; i++) {
              if (city_data[i].text == address.city) {
                cope.cityName = address.city;
                cope.cityId = city_data[i].value;
              }
            }
          }

        }
        else {
          console.log('failed' + this.getStatus());
        }

        that.$store.state.threeArea = cope;
        that.area = cope.countyName ? cope.countyName : (cope.cityName ? cope.cityName : (cope.provinceName ? cope.provinceName : ""));
        that.setLocation("userArea", that.area);// 保存地址
        that.hideLoading();
        //初始化参数
        that.message.poi = r.point.lat + ',' + r.point.lng;
        //初始化分页插件
        that.initScroll();
      }, { enableHighAccuracy: true })
      //获取当前地址信息 end
    }else{
      var addressInfo = this.getLocation("addressInfo");
      //如果有用户点位数据初始化分页和参数
      if(addressInfo){
        //初始化参数
        this.message.poi = addressInfo.lat + ',' + addressInfo.lng;
        //初始化分页插件
        this.initScroll();
      }
    }
    
    

  },
  methods: {
    //      交易类型 1： dayRent 2: houseRent 3: houseSell
    //初始化分页插件
    initScroll() {
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
    //下拉刷新房屋推荐列表
    downCallback() {
      var API = this.$store.state.api;
      this.message.page = '0';
      //获取推荐房源信息
      this.$http.post(API.getMyRooms, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        if (result.state == 1) {
          var data = result.data;
          this.recommendHouse = data;
          this.mescroll.endSuccess(data.length);
        } else {
          this.showToast(result.message, 2, 1500);
          this.recommendHouse = [];
          //联网失败的回调,隐藏下拉刷新的状态
          this.mescroll.endErr();
        }
      });
    },
    //下拉获取房屋推荐分页数据
    upCallback() {
      var API = this.$store.state.api;
      this.message.page++;
      //获取推荐房源信息
      this.$http.post(API.getMyRooms, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = res.body;
        if (result.state == 1) {
          var data = result.data;
          this.recommendHouse = this.recommendHouse.concat(data);
          this.mescroll.endSuccess(data.length);
        } else {
          this.showToast(result.message, 2, 1500);
          //联网失败的回调,隐藏下拉刷新的状态
          this.mescroll.endErr();
        }
      });
    },
    toDayRent() {
      this.$router.push('dayRent');
      this.$store.state.tradingType = "1";
    },
    toHouseRent() {
      this.$router.push('houseRent')
      this.$store.state.tradingType = "2";
    },
    toHouseSell() {
      this.$router.push('houseSell')
      this.$store.state.tradingType = "3";
    },
    toAboutUS() {
      this.$router.push('/aboutUs');
    },
    toLandlord() {
      this.$router.push('/doLandlord');
    },
    getArea() {
      this.$router.push('/province');
    },
    lookHouseDetail(val) {
      this.setLocation("houseId", val.house.id);
      this.$router.push('dayRentDetail');
    },
    //获取推荐房源数据
    getRecommendHouse() {


    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" type="text/scss" scoped>
.index {
  background: #e6e6e6;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  .middle-wrapper {
    position: fixed;
    top: 0;
    height: 91%;

    .header-wrapper {
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      padding: 0 3%;
      font-size: 0.85rem;
      color: #fff;
      background: url("/static/img/index-top.png") no-repeat;
      background-size: 100% 100%;

      div {
        display: inline-block;
      }

      .title-box {
        width: 100%;
        float: left;
      }
    }

    .index-top {
      height: 12.35rem;
      width: 100%;
      background: url("/static/img/home_bac.png") no-repeat;
      background-size: 100% 100%;
      position: relative;

      .index-top-select {
        padding: 0.6rem 3%;
        text-align: left;

        .select-out-wrapper {
          text-align: left;
          display: inline-block;
          float: left;

          input {
            width: 7rem;
            height: 1.4rem;
            line-height: 1.4rem;
            border-radius: 0.2rem;
            padding: 0 1.5rem 0 0.5rem;
            font-weight: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: url("/static/img/ico_02.png") no-repeat #fff 90%;
            background-size: 0.5rem;
          }
        }
      }
    }

    .index-menu-wrapper {
      width: 100%;
      background: #fff;
      padding-bottom: 0.75rem;
      .index-menu-box {
        width: 100%;

        div {
          width: 32.5%;
          display: inline-block;
          padding-top: 1.15rem;
          font-size: 0.6rem;
          float: left;

          i {
            display: inline-block;
            margin-bottom: 0.75rem;
            height: 1.6rem;
          }
          span {
            display: block;
          }
        }

        .select1 i {
          width: 1.925rem;
          background: url("/static/img/home_01.png") no-repeat;
          background-size: 100% 100%;
        }
        .select2 i {
          width: 1.75rem;
          background: url("/static/img/home_02.png") no-repeat;
          background-size: 100% 100%;
        }
        .select3 i {
          width: 1.6rem;
          background: url("/static/img/home_03.png") no-repeat;
          background-size: 100% 100%;
        }
        .select4 i {
          width: 1.85rem;
          background: url("/static/img/home_04.png") no-repeat;
          background-size: 100% 100%;
        }
        .select5 i {
          width: 1.5rem;
          background: url("/static/img/home_05.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }

    .index-recommend {
      width: 100%;
      background: #fff;
      margin-top: 0.5rem;

      .recommend-title {
        margin-bottom: 0.75rem;
        h1 {
          font-size: 0.65rem;
          padding: 0.75rem 0 0.5rem 0;
        }
        p {
          font-size: 0.55rem;
          color: #666;
        }
      }

      .recommendList {
        width: 100%;
        .recommend-box {
          width: 100%;
          padding: 0 3% 0.5rem 3%;

          .margin-rt {
            // margin-right: 3%;
            padding: 0 0.25rem;
          }

          .recommend-good {
            width: 46.5%;
            display: inline-block;
            float: left;
            box-sizing: content-box;
            .img-box {
              width: 100%;
              height: 5.5rem;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .content-box {
              span {
                display: inline-block;
                font-size: 0.6rem;
                line-height: 1rem;
                float: left;
              }
            }
          }
        }
      }
      /*recommendList end*/
    }
    /*index-recommend end*/
  }
}
</style>
