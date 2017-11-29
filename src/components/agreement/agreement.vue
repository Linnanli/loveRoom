<template>
    <div class="agreement">
      <div class="w-transparent"></div>
      <div class="agreement-box">
        <h1>协议</h1>
        <div class="agreement-content">
          <p v-if="isHTML === true" v-html="deal"></p>
          <p v-else v-text="deal"></p>
        </div>
        <div class="agreement-bottom">
           <button @click="comfirm()">确  定</button> 
          <!-- <button @click="test()">确  定</button> -->
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'selectOne',
        props:{
          deal: String,
          comfirmMethod:Function,
          isHTML:Boolean
        },
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
      methods:{
        //点击确定按钮
        comfirm(){
          this.comfirmMethod && this.comfirmMethod();
        }
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/config";
.agreement{
  width: 100%;
  height: 100%;

  .w-transparent{
    position: fixed;
    z-index: 1000;
    background: rgba(17, 17, 17, 0.7);
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .agreement-box{
    background-color: #fff;
    width: 80%;
    height: 80%;
    position: fixed;
    z-index: 1000;
    top: 50%;
    left: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%) translateX(-50%);
    position: relative;

    h1{
      font-size: 0.75rem;
      line-height: 2rem;
      border-bottom: 0.025rem solid #e6e6e6;
      padding-left: 3%;
      text-align: left;
    }

    .agreement-content{
      height: 82%;
      width: 100%;
      padding: 3%;
      text-align: left;
      overflow: scroll;

      p{
        width: 100%;
        word-break:break-all;
        font-size: 0.65rem;
        line-height: 1rem;
      }
    }


    .agreement-bottom{
      width: 100%;
      height: 2rem;

      button{
        background-color: $header-color;
        color:#fff;
        font-size: 0.8rem;
        width: 100%;
        height: 2rem;
        position: fixed;
        bottom:0;
        left: 0;
      }
    }
  }
}
</style>
