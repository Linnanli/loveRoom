<template>
    <div class="selectOne">
      <div class="select-out-wrapper clearfix" >
        <input readonly="" name="input_area" placeholder="城市选择"  ref="area" v-model="areas"/>
        <!--<input readonly="" name="input_area" placeholder="城市选择" id="area" ref="area" @input="getArea()"/>-->
        <input id="areaId"  hidden>

      </div>

    </div>

</template>

<script>

    export default {
        name: 'selectOne',
        data() {
            return {
              area: new LArea(),
              areas: "222"
            }
        },
      components:{

      },
//      mounted(){
//        this.area.init({
//          'trigger': '#area',//控件ID
//          'valueTo':'#areaId',//选择完毕后id属性输出到该位置
//          'keys':{id:'value',name:'text'},//绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
//          'type':2,//数据源类型
//          'data': [provs_data, citys_data, dists_data]
//        });
//      },
      method:{
        getArea(){
          alert(this.$refs.area.value);
        }
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  .selectOne{
    .select-out-wrapper{
      text-align: left;
      display: inline-block;
      float: left;

      input{
        min-width: 5.65rem;
        height: 1.4rem;
        line-height: 1.4rem;
        border-radius: 0.2rem;
        padding: 0 0.5rem;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
