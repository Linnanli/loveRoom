<template>
    <div class="loading" v-if="$store.state.loadConfig.loadShow">
      <div class="loading-bg"></div>
      <div class="loading-gif">
        <div class="gif-box">
          <img src="/static/img/loading.gif"/>
        </div>

        <div class="loading-text">{{$store.state.loadConfig.loadText}}</div>

      </div>

    </div>
</template>

<script>
    export default {
        name: 'selectOne',
        props:{
        },
        data() {
            return {
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
.loading{
    width: 100%;

  .loading-bg{
    position: fixed;
    background: rgba(17, 17, 17, 0.7);
    z-index: 1002;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .loading-gif{
    position: fixed;
    z-index: 1003;
    width: 100%;
    height: auto;
    top: 30%;
    text-align: center;

    .gif-box{
      width: 15%;
      margin: auto;

      img{
        width: 100%;
      }
    }

    .loading-text{
      color: #fff;
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }




  }
}
</style>
