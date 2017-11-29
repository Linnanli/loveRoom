<template>
  <div class="evaluation">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <!--评价分数-->
      <div class="room-score-wrapper">
        <div class="room-score">
          <span>房间评价</span>
          <span>
              <em>{{average}}分</em>
               <rater v-model="average" slot="value" active-color="#cc0000" :font-size="20" disabled></rater>
          </span>
          <span>{{evaluate.length}}条评论</span>
        </div>
      </div>
      <!--评价分数 end -->

      <!--评论列表-->
      <div class="room-evaluation-list">
        <div class="room-evaluation-box" v-for="val in evaluate">
          <div class="evaluation-username">{{val.nicename || '未知用户'}}：</div>
          <p class="evacontent">{{val.evacontent}}</p>
          <h1>
            <!-- <span>{{val.createuser}}</span> -->
            <em>{{val.createtime}}</em>
          </h1>
          <div class="reply-box" v-for="val in reply">
              <div class="reply-user">{{val.createuser}}:</div>
              <div class="reply-content">{{val.replycontent}}</div>
              <div class="reply-time">{{val.createtime}}</div>
          </div>
        </div>
        
      </div>
      <!--评论列表 end -->
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import WHeader from '../modules/wheader/wheader.vue'
  import Rater from 'vux/src/components/rater/index.vue'
    export default {
      name: 'evaluation',
      data() {
          return {
            headerTitle: "房间评价",
            average:0,//评级
            evaluate:[]//评论
          }
      },
      created(){
        var houseEvaluate = this.getLocation('houseEvaluate');
        this.average = Number(houseEvaluate.average);
        this.evaluate = houseEvaluate.evaluate.evaluates;
        this.reply = houseEvaluate.evaluate.reply;
      },
      components: {
        WHeader,
        Rater
      },
      methods: {

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";
  .evaluation{
    width: 100%;
    height: 100%;
    margin: 0;
    background-color: #fff;

    .middle-wrapper{

      .room-score-wrapper{
        height: 2.275rem;
        width: 100%;
        font-size: 0.65rem;
        line-height: 2.25rem;
        padding: 0 3%;
        color: #676767;
        background-color: #fff;
        text-align: left;

        .room-score{
          border-bottom: 0.02rem solid #f4f4f4;

          span{
            margin-right: 3%;

            &:nth-child(2){
              color: $red !important;
            }

            &:nth-child(3){
              margin-left: 5%;
            }
          }
        }

      }
      /*room-score-wrapper end */

      .room-evaluation-list{
        padding: 0 3%;
        font-size: 0.6rem;

        .reply-box{
          
          padding: 0.5rem;
          background-color: #fff;
          .reply-user{
            border-top:1px solid #f4f4f4;
            padding: 0.5rem 0;
          }
          .reply-content{
            text-indent: 1.5rem;
            color: #656565;
          }
          .reply-time{
            color: #666;
            text-align: right;
            margin: 0.25rem 0 0.65rem 0;
          }
        }

        .room-evaluation-box{
          text-align: left;
          margin-bottom: 2.15rem;
          padding: .5rem;
          background-color:#eee;
          // border-bottom: 1px solid #ccc;
          .evaluation-username{
            margin: 0.5rem 0;
          }
          .evacontent{
            text-indent: 1.5rem;
          }
          h1{
            margin-top: 1.25rem;
            margin-bottom: 0.65rem;

            em{
              float: right;
              color: #666;
            }
          }//h1

          p{
            font-size: 0.5rem;
            color: #656565;
            line-height: 0.9rem;
          }

        }//room-evaluation-box
      }
      /*room-evaluation-list end */
    }
    /*middle-wrapper end */

    /*middle-wrapper end */

  }
</style>
