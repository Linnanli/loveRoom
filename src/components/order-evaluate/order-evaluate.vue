<template>
    <div class="order-evaluate">
        <w-header :title="headerTitle"></w-header>
        <div class="middle-wrapper">
            <div class="evaluate-body">
                <div class="evaluate-top">
                    <i><img src=""></i>
                    <span class="evaluate-level">评论星级</span>
                    <span> <rater v-model="grade" slot="value" active-color="#cc0000" :font-size="20"></rater></span>
                    <span>{{gradeText}}</span>
                </div>
                <div class="evaluate-main">
                    <textarea class="user-input" contenteditable="true" placeholder="说说您的感受，分享给他人吧." maxlength="200" v-model="message.evacontent"></textarea>
                    <div>

                    </div>
                </div>
            </div>
        </div>
        <div class="submit-warp">
            <button @click="submit()">提交评论</button>
        </div>
    </div>
</template>
<script>
import WHeader from "../modules/wheader/wheader.vue";
 import Rater from 'vux/src/components/rater/index.vue'
export default {
    name: 'order-evaluate',
    data() {
        return {
            headerTitle: "发表评论",
            grade:1,
            gradeText:'一般',
            message: {
                houseid: '',
                createid:'',//用户id
                evacontent: '',
                housetitle: '',
                createuser:'',//用户姓名
                nicename:'',
                grade: 1
            }
        }
    },
    created() {
        var orderEvaluate = this.getLocation("orderEvaluate");
        var userInfo = this.getLocation("userInfo");
        console.log(userInfo);
        //初始化参数信息
        this.message.houseid = orderEvaluate.houseid;
        this.message.housetitle = orderEvaluate.housetitle;
        this.message.createid = userInfo.id;
        this.message.createuser = userInfo.name;
        this.message.nicename = userInfo.nicename;
    },
    watch:{
        grade:function(newValue){
            this.message.grade = newValue;

            switch(newValue){
                case 1:
                case 2:
                    this.gradeText = '一般';
                    break;
                case 3:
                case 4:
                    this.gradeText = '较好';
                    break;
                case 5:
                    this.gradeText = '非常好';
                    break;
            }

        }
    },
    methods: {
        back(time) {
            var self = this;
            var timer = setTimeout(function() {
                self.$router.back();
                clearTimeout(timer);
            }, time || 0);
        },
        submit() {
            var API = this.$store.state.api;
            if(this.message.grade == 0){
                this.showToast("请勾选星级", 2, 1500);
                return;
            }else if (!this.message.evacontent) {
                this.showToast("请填写评论信息", 2, 1500);
                return;
            }else if (this.message.evacontent.length<5) {
                this.showToast("评论不得少于5个字", 2, 1500);
                return;
            }

            this.showLoading('正在发表评论...');
            this.$http.post(API.evaluateSave, this.message, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                emulateJSON: true
            }).then((res) => {
                var result = res.body;
                this.hideLoading();
                if (result.state == 1) {
                    this.showToast(result.message, 1, 1500);
                    this.back(1500);
                } else {
                    this.showToast(result.message, 2, 1500);
                }
            });
        }
    },
    components: {
        WHeader,
        Rater
    }
}
</script>
<style lang="scss" type="text/scss" scoped>
.order-evaluate {
    width: 100%;
    height: 100%;
    margin: 0;
}

.evaluate-body {
    width: 100%;
    height: 100%;
    background-color: #fff; // padding: 0 3%;
    .evaluate-top {
        border-bottom: 1px solid #eee;
        line-height: 2.5rem;
        .evaluate-level {
            font-size: 0.8rem;
        }
    }
    .evaluate-main {
        border-bottom: 1px solid #eee;
        .user-input {
            width: 100%;
            resize: none;
            min-height: 4.5rem;
            text-align: left;
            padding: 0.5rem 3%;
        }
    }
}

.submit-warp {
    width: 100%;
    height: 2.5rem;
    position: fixed;
    bottom: 0;
    button {
        width: 100%;
        height: 2.5rem;
        background-color: #51ca94;
        border: 0;
        font-size: 0.7rem;
        color: #fff;
    }
}
</style>


