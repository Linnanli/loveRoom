<template>
  <div class="city">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <ul>
        <li v-for="val in cityList" :prov-id="val.value" @click="getCounty(val.value,val.text)">{{val.text}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import WHeader from '../wheader/wheader.vue'
  export default {
    name: 'selectOne',
    created(){

    },
    data() {
      return {
        cityList: citys_data[this.$store.state.threeArea.provinceId],
        headerTitle: "选择地区"
      }
    },
    components:{
      WHeader
    },
    methods:{
      getCounty(id,name){
        var areaCope = this.$store.state.threeArea;
        areaCope.cityName = name;
        areaCope.cityId = id;
        areaCope.countyName = "";
        areaCope.countyId = "";
        this.$store.state.threeArea = areaCope;

        //判断该城市是否有区，否则直接返回到首页
        if(dists_data[id]){
          this.$router.push("/county");
        }else{
          this.$router.push("/");
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .city{
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
