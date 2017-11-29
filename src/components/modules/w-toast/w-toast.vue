<template>
    <div class="w-toast-wrapper" v-if="$store.state.showSuccessToast">
      <div class="w-transparent"></div>
      <div class="w-toast toast-mid" v-if="$store.state.toastConfig.ToastType==1">
        <i class="w-icon-success-no-circle w-icon_toast success-icon" ></i>
        <p class="w-toast__content">{{$store.state.toastConfig.title}}</p>
      </div>

      <div class="w-toast min-toast" v-if="$store.state.toastConfig.ToastType==2">
        <p class="w-toast__content">{{$store.state.toastConfig.title}}</p>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'selectOne',
        props: {
        },
        data() {
            return {
            }
        },
      methods:{
          }
    }
</script>

<style lang="scss" type="text/scss" scoped>
.w-toast-wrapper{
  width: 100%;

  .w-transparent{
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .w-toast{
    position: fixed;
    z-index: 5001;
    margin: auto;
    background: rgba(17, 17, 17, 0.7);
    text-align: center;
    border-radius: 5px;
    color: #FFFFFF;

    i{
      &.w-icon_toast{
        margin: 22px 0 0;
        display: block;
      }

      &.success-icon{
        width: 2.475rem;
        height: 1.775rem;
        background: url("/static/img/success-icon.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 33%;
      }

      &.w-icon-success-no-circle{
        font-size: 23px;
        color: #09BB07;
      }
    }

    [class^="weui-icon-"], [class*=" weui-icon-"] {
      display: inline-block;
      vertical-align: middle;
      font: normal normal normal 14px/1 "weui";
      font-size: inherit;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
    }

    .w-toast__content{
      font-size: 16px;
    }
  }

  .toast-mid{
    width: 7.6em;
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
    left: 50%;
    padding-bottom: 1.8rem;

    .w-toast__content{
      margin-top: 1rem;
    }
  }

  .min-toast{
    transform: translateX(-50%);
    left: 50%;
    bottom: 3rem;
    padding: 0.5rem;
  }


}
</style>
