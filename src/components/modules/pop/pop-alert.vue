<template>
  <div class="pop-alert" v-if="$store.state.showPop">
    <div class="w-transparent" ></div>
    <div class="w-toast">
     <div class="w-pop-content">
       <h1>{{$store.state.popConfig.title}}</h1>
       <p>{{$store.state.popConfig.content}}</p>
     </div>
      <div class="pop-button">
        <button @click="showPop">取消</button>
        <button @click="submit()">{{$store.state.popConfig.buttonName}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'selectOne',
    mounted() {

    },
    data() {
      return {
        popConfig: this.$store.state.popConfig
      }
    },
    methods:{
      showPop(){
        this.$store.state.showPop= false;
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .pop-alert {
    width: 100%;

    .w-transparent {
      position: fixed;
      background: rgba(17, 17, 17, 0.7);
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }

    .w-toast {
      position: fixed;
      z-index: 5001;
      width: 74.8%;
      margin: auto;
      background-color: #fff;
      text-align: center;
      border-radius: 5px;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      padding: 1.45rem 3% 0.7rem 3%;
      font-size: 0.8rem;


      .w-pop-content {
        padding-bottom: 1.5rem;
        border-bottom: 0.025rem solid #eee;
        font-size: 0.8rem;

        p{
          margin-top: 1.25rem;
        }
      }

      .pop-button{
        height: 2.4rem;
        margin-top: 0.5rem;

        button{
          display: inline-block;
          background-color: #fff;
          line-height: 2.4rem;
          width: 48%;
          font-size: 0.75rem;

          &:first-child{
            border-right: 0.025rem solid #eee;
          }
        }
      }
    }




  }
</style>
