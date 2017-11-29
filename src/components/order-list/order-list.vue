<template>
  <div class="order-list">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <div class="order-menu-wrapper">
        <ul>
          <li :class="orderItemAction == index?'select':''" v-for="(val,index) in orderItem" @click="orderItemToggle(index)">{{val.name}}</li>
        </ul>
      </div>
      <div class="order-list-wrapper" id="mescroll">
        <div>
          <div class="order-list-box" v-for="val in orderList">
            <div class="order-top">
              <div>
                <i></i>
                <span>{{val.ordernumber}}</span>
              </div>
              <em>{{val.state | orderState}}</em>
            </div>
            <div class="order-detail" @click="toOrderDetail(val)">
              <h1>
                <span>{{val.housetitle}}</span>
                <em>￥{{val.amount}}</em>
              </h1>
              <p>
                <span>{{val.starttime}} </span>至
                <span>{{val.endtime}}</span>
              </p>
              <!-- <p>三室两厅一卫 （网上支付）</p> -->
            </div>
          </div>
        </div>
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
  name: 'orderList',
  data() {
    return {
      headerTitle: "我的订单",
      orderItem: [{name:'全部',value:''},{name:'待审核',value:'5,6'},{name:'有效订单',value:'2'}, {name:'待支付',value:'1'}, {name:'退款单',value:'3'}],
      orderItemAction: 0,//当前订单选项索引
      orderList:[],//d订单列表数据
      message:{
        state: '',
        page: '-1',
        userid:'',
        pageSize: '5'
      }
    }
  },
  created() {
    var userInfo = this.getLocation("userInfo");
    this.$store.state.footerSelect = 2;
    this.message.userid = userInfo.id;
  },
  mounted(){
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
  components: {
    indexFooter,
    WHeader
  },
  methods: {
    downCallback() {
      this.message.page = 0;
      //每次下拉刷新需要重置数据
      this.orderList = [];
      //获取存储的订单选项索引
      var orderIndex = this.getLocation('orderListItemIndex');
      //下拉刷新
      this.orderItemToggle(orderIndex?orderIndex:this.orderItemAction,true);
    },
    //上拉请求分页
    upCallback() {

      var API = this.$store.state.api;
      this.message.page++;

      this.$http.post(API.ordersLoadPage, this.message, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          if (result.state == 1) {
            var data = result.data;
            this.mescroll.endSuccess(data.length);
            this.orderList = this.orderList.concat(data);
          } else {
            if(result.data == null){
              this.mescroll.endSuccess(0);
            }else{
              this.showToast(result.message, 2, 1500);
            }
            //联网失败的回调,隐藏下拉刷新的状态
            this.mescroll.endErr();
          }
        });

    },
    //跳转订单详情页
    toOrderDetail(value) {
      this.setLocation('orderDetail',value.ordernumber);
      this.$router.push('orderDetail');
    },
    orderItemToggle(index,isPull) {
      var API = this.$store.state.api;
      this.message.page = '0';
      //点击顶部订单类型时,如果重复点击同一项阻止请求
      if(!isPull&&this.orderItemAction == index) return;
      //设置当前订单项,并存储,在模块初始化时选中订单项
      this.orderItemAction = index;
      this.setLocation('orderListItemIndex',index);
      //设置当前查询订单类型
      this.message.state = this.orderItem[index].value;

      !isPull&&this.showLoading('数据正在加载中...');
      this.$http.post(API.ordersLoadPage, this.message, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          !isPull&&this.hideLoading();
          if (result.state == 1) {
            var data = result.data;
            this.mescroll.endSuccess(data.length);
            this.orderList = data;
          } else {
            this.orderList = [];
            this.showToast(result.message, 2, 1500);
            //联网失败的回调,隐藏下拉刷新的状态
            this.mescroll.endErr();
          }
        });

    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.order-list {
  width: 100%;
  height: 100%;
  margin: 0;

  .middle-wrapper {
    overflow: hidden;
    .order-menu-wrapper {
      width: 100%;
      height: 2.2rem;
      line-height: 2.15rem;
      font-size: 0.7rem;
      background: #fff;
      // position: fixed;
      ul {
        width: 100%;

        li {
          display: inline-block;
          // width: 24%;
          width: 20%;
          text-align: center;
        }

        .select {
          color: #51ca94;
          border-bottom: 0.1rem solid #51ca94;
        }
      }
    }

    .order-list-wrapper {
      width: 100%;
      height: 92%;
      text-align: left;
      // margin-top: 2.6rem;
      overflow-y: scroll;
      .order-list-box {
        width: 100%;
        margin-top: 0.5rem;
        background: #fff;

        .order-top {
          width: 100%;
          height: 1.975rem;
          line-height: 1.95rem;
          border-bottom: 0.025rem solid #dadada;
          padding: 0 3%;

          div {
            font-size: 0.7rem;
            display: inline-block;
          }

          em {
            font-size: 0.55rem;
            display: inline-block;
            float: right;
            color: #fd3944;
          }
        }

        .order-detail {
          padding: 0.75rem 3%;

          h1 {
            font-size: 0.75rem;
          }

          em {
            float: right;
          }

          p {
            font-size: 0.5rem;
            color: #686868;
            margin-top: 0.5rem;
          }
        }
        /*order-detail end*/
      }
      /*order-list-box end*/
    }
    /*order-list-wrapper end*/
  }
  /*middle-wrapper end*/
}
</style>
