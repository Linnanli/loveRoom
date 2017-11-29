<template>
    <div class="province">
      <w-header :title="headerTitle"></w-header>
      <div class="middle-wrapper">
        <ul>
          <li v-for="val in provList" :prov-id="val.value" @click="getCity(val.value,val.text)">{{val.text}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
  import WHeader from '../wheader/wheader.vue'
    export default {
        name: 'selectOne',
        data() {
            return {
                provList: provs_data,
              headerTitle: "选择地区"
            }
        },
      components:{
        WHeader
      },
      methods:{
        getCity(id,name){
          //初始化城市信息
          var cope = {
            provinceName: "",
            provinceId: "",
            cityName:"",
            cityId: "",
            countyName:"",
            countyId: ""
          };
          cope.provinceName = name;
          cope.provinceId = id;
          this.$store.state.threeArea = cope;
//          console.log(cope);
          //判断该省是否有其他市，否则直接返回到首页
          if(citys_data[id]){
            this.$router.push("/city");
          }else{
            //接下来获取城市数据
            this.$router.push("/");
          }

        }
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
.province{
  .middle-wrapper{
    height: 93%;

    ul{
      background-color: #fff;
      font-size: 0.7rem;
      text-align: left;

      li{
        padding-left: 5%;
        height: 1.8rem;
        line-height: 1.8rem;
        border-bottom: 0.025rem solid #eee;
        background: url("/static/img/me_rt.png") no-repeat 95% 0.5rem;
        background-size: 0.4rem 0.625rem;
      }
    }

  }
}
</style>
