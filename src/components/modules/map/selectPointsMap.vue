<template>
  <div class="map-container">
      <div id="mapEle" class="map">地图选点</div>
      <button class="but" @click="confirmPoint()">确定</button>
  </div>
</template>
<script>
export default {
  name:'selectPoints',
  props:{
    point:Object,
    confirm:Function
  },
  data(){
      return{
        lng:0,
        lat:0,
        address:''
      }
  },
  mounted(){
    var self = this;
    this.lng = this.point.lng!==undefined?this.point.lng:0;
    this.lat = this.point.lat!==undefined?this.point.lat:0;
    this.address = this.point.address!==undefined?this.point.address:'';

    //初始化地图对象
    var map = new BMap.Map("mapEle");
    var point = new BMap.Point(this.lng,this.lat);
    map.centerAndZoom(point, 15);
    map.enableScrollWheelZoom(true); 
    var marker = new BMap.Marker(point);
    map.setCenter(point);
    map.addOverlay(marker);

    var geoc = new BMap.Geocoder();
    //获取地图点位
    map.addEventListener("click", function (e) {
        map.clearOverlays();
        var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
        map.addOverlay(marker);

        geoc.getLocation(e.point, function(rs){
          var addComp = rs.addressComponents;
          self.lng = e.point.lng;
          self.lat = e.point.lat;
          self.address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
        });

    });
  },
  methods:{
    confirmPoint(){
      //设置点位
      this.point.lng = this.lng;
      this.point.lat = this.lat;
      this.point.address = this.address;
      this.confirm &&this.confirm(this.point);
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
.map-container{
  width: 100%;
  height: 100%;
  position: absolute;
  .map{
    width: 100%;
    height: 100%;
  }
  .but{
    width: 100%;
    height: 2.5rem;
    background-color: #51ca94;
    border: 0;
    font-size: 0.7rem;
    color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    letter-spacing: 0.8rem;
    text-indent: 0.8rem;
  }
}

</style>


