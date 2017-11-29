<template>
  <div class="county">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <ul>
        <li v-for="val in countyList" :prov-id="val.value" @click="getCounty(val.value,val.text)">{{val.text}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import WHeader from '../wheader/wheader.vue'
  export default {
    name: 'selectOne',
    created(){
//      console.log(dists_data[this.$store.state.threeArea.cityId])
    },
    data() {
      return {
        countyList: dists_data[this.$store.state.threeArea.cityId],
        headerTitle: "选择地区"
      }
    },
    components:{
      WHeader
    },
    methods:{
      getCounty(id,name){
        this.$store.state.threeArea.countyId = id;
        this.$store.state.threeArea.countyName = name;
        this.$router.push("/");
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .county{
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
