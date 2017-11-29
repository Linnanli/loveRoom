<template>
  <div class="order-address-wrapper clearfix">
    <h1>地址: <em>{{addressInfo.address}}</em></h1>
    <div class="map-wrapper">
      <div id="allmap"></div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'selectOne',
      props:{
        addressInfo: Object
      },
      data() {
        return {

        }
      },
      mounted () {
        var TandG = this.addressInfo.coord.split(",");
        var lng = TandG[0];
        var lat = TandG[1];
        var point = new BMap.Point(lng,lat);

        //初始化地图对象
        var map = new BMap.Map("allmap");
        map.centerAndZoom(point, 15);
        var myIcon = new BMap.Icon("/static/img/map-icon.png", new BMap.Size(50,55));

        var convertor = new BMap.Convertor();
        convertor.translate([point], 1, 5, function(data){
          if(data.status === 0) {
            var marker = new BMap.Marker(data.points[0],{icon:myIcon});
            map.setCenter(data.points[0]);
            map.addOverlay(marker);
          }
        });

      },
    }
</script>

<style lang="scss" type="text/scss" scoped>
  .order-address-wrapper{
    width:100%;
    background: #fff;
    padding: 0.5rem 3%;
    margin-top: 0.5rem;

    h1{
      text-align: left;
      font-size: 0.65rem;
      color: #666;
      margin-bottom: 0.6rem;

      em{
        color: #333;
      }
    }
    .map-wrapper{
      width: 100%;
      height: 10rem;

      #allmap {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin:0;
        font-family:"微软雅黑";
      }
    }
    /*map-wrapper  end*/
  }
  /*order-address-wrapper  end*/
</style>
