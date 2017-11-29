<template>
    <div class="WHeader">
      <div class="header-wrapper">
        <div class="icon-box" @click="back()"><i class="back-icon"></i></div>
        <div class="title-box">{{title}}</div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'WHeader',
        props:{
          title: String
        },
        data() {
            return {

            }
        },
      methods: {
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../assets/config.scss";
  .WHeader{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1001;

    .header-wrapper{
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      padding: 0 3%;
      font-size: 0.85rem;
      color: #fff;
      background-color: $header-color;

      div{
        display: block;
      }

      .icon-box{
        float: left;
        width: 10%;
        position: fixed;
        z-index: 111;
        text-align: center;

        .back-icon{
          width: 0.5rem;
          height: 0.875rem;
          background: url("/static/img/back-icon.png") no-repeat;
          background-size: 100% 100%;
        }

        .go-index{
          width: 0.5rem;
          height: 0.875rem;
          background: url("/static/img/back-icon.png") no-repeat;
        }
      }

      .title-box{
        width: 100%;
        margin: 0 auto;
        position: relative;
        text-align: center;
        z-index: 11;
      }
    }
  }

</style>
