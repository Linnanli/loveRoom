<template>
    <div class="index-footer">
      <ul>
        <li @click="toIndex()" :class="selected==1?'menu1-selected':'menu1'"><i></i><p>首页</p></li>
        <li @click="toOrderList()"  :class="selected==2?'menu2-selected':'menu2'"><i></i><p>订单</p></li>
        <li @click="toUser()" :class="selected==3?'menu3-selected':'menu3'"><i></i><p>我的</p></li>
      </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'indexFooter',
        data() {
            return {
               selected: this.$store.state.footerSelect
            }
        },
      methods:{
          toUser(){
            this.$router.push('user');
          },
          toOrderList(){
            //初始化订单项索引值
            this.removeLocation('orderListItemIndex');
            this.$router.push('orderList');
          },
          toIndex(){
            this.$router.push('/')
          }
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";
  .index-footer{
    height: 9%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    border-top:0.025rem solid #c0c0c3 ;
    padding-top: 0.325rem;
    box-sizing: border-box;
    font-size: 0.5rem;
    color: #a7a7a8;

    ul{
      width: 100%;

      li{
        width: 32.2%;
        display: inline-block;
        text-align: center;

        i{
          display: block;
          height: 1.05rem;
          margin: auto;
        }

        p{
          margin-top: 0.425rem;
          margin-bottom: 0.2rem;
        }
      }

      .menu1{
        i{
          width: 1.1rem;
          background:url("/static/img/home_tab_04.png") no-repeat;
          background-size: 100% 100%;
        }
      }

      .menu1-selected{
        i{
          width: 1.1rem;
          background:url("/static/img/home_tab_01.png") no-repeat;
          background-size: 100% 100%;
        }

        p{
          color: $header-color;
        }
      }

      .menu2{
        i{
          width: 0.825rem;
          background:url("/static/img/home_tab_02.png") no-repeat;
          background-size: 100% 100%;
        }
      }

      .menu2-selected{
        i{
          width: 0.825rem;
          background:url("/static/img/home_tab_05.png") no-repeat;
          background-size: 100% 100%;
        }

        p{
          color: $header-color;
        }
      }

      .menu3{
        i{
          width: 0.925rem;
          background:url("/static/img/home_tab_03.png") no-repeat;
          background-size: 100% 100%;
        }
      }

      .menu3-selected{
        i{
          width: 0.925rem;
          background:url("/static/img/home_tab_06.png") no-repeat;
          background-size: 100% 100%;
        }

        p{
          color: $header-color;
        }
      }
    }
  }
</style>
