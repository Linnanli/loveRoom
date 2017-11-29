<template>
  <div class="release-room">
    <w-header :title="headerTitle"></w-header>
    <div class="middle-wrapper">
      <!--输入框模块-->
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">房间名</div>
          <div class="input-box">
            <input type="text" placeholder="请输入房源名/小区/位置" v-model="message.title" />
          </div>
        </div>
      </div>
      <!--<div class="input-wrapper">-->
      <!--<div class="input-wrapper-box clearfix">-->
      <!--<div class="title-box">房东姓名</div>-->
      <!--<div class="input-box">-->
      <!--<input type="text" placeholder="请输入房东姓名" v-model="message.name" />-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">房东电话</div>
          <div class="input-box">
            <input type="number" placeholder="输入电话号码" v-model="message.phone" />
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">出售价格</div>
          <div class="input-box">
            <input type="number" placeholder="0.00" v-model="message.cost" />
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">出售面积</div>
          <div class="input-box">
            <input type="text" placeholder="0" v-model="message.acreage" />
          </div>
        </div>
      </div>
      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">出售户型</div>
          <div class="input-box">
            <input type="text" placeholder="比如三室一厅" v-model="message.housetype" />
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">朝向</div>
          <div class="input-box">
            <input type="text" placeholder="朝南" v-model="message.orientation" />
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">装修</div>
          <div class="input-box">
            <input type="text" placeholder="比如精装修" v-model="message.decoration" />
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">用途</div>
          <div class="input-box">
            <input type="text" placeholder="比如卧室" v-model="message.purpose" />
          </div>
        </div>
      </div>

      <div class="input-wrapper" v-if="message.type == 3">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">钟点房费</div>
          <div class="input-box">
            <input type="number" placeholder="0.00" v-model="message.wage" />
          </div>
        </div>
      </div>

      <div class="input-wrapper" v-if="message.type == 3">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">日租押金</div>
          <div class="input-box">
            <input type="number" placeholder="0.00" v-model="message.pledge" />
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">楼层</div>
          <div class="input-box">
            <input type="text" placeholder="比如五楼" v-model="message.floor" />
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <div class="input-wrapper-box clearfix">
          <div class="title-box">地址</div>
          <div class="input-box">
             <input type="text" placeholder="请输入具体地址"  v-model="message.address" @click="openMap()" readonly /> 
          </div>
        </div>
      </div>

      <!--输入框模块 end-->

      <!--radio 选择-->
      <div class="check-box-wrapper ">
        <div class="check-box clearfix">
          <div class="title-box">出售类型</div>
          <div class="checkbox-parent">
            <div class="box">
              <checker v-model="message.type" default-item-class="sellType-item" selected-item-class="sellType-item-selected">
                <!-- <checker-item value="3">日租民宿</checker-item> -->
                <checker-item value="1">房屋出租</checker-item>
                <checker-item value="2">房屋出售</checker-item>
              </checker>
            </div>
          </div>
        </div>
      </div>

      <div class="check-box-wrapper ">
        <div class="check-box clearfix">
          <div class="title-box">特色</div>
          <div class="checkbox-parent">
            <div class="box">
              <checker v-model="message.keyword" type="checkbox" default-item-class="sellType-item" selected-item-class="sellType-item-selected">
                <checker-item :value="val" v-for="(val,index) in keyword" :key="index">{{ val }}</checker-item>
              </checker>
              <br>
              <!--<span>{{message.keyword}}</span>-->
              <br>
            </div>
          </div>
        </div>
      </div>
      <!--radio 选择 end -->

      <!-- 配套设施 -->
      <div class="item-wrapper">
        <p class="item-title">配套设施</p>
        <div class="device-list">
          <div class="device-box" :class="commonList[index].isChoose==true?'select':''" @click="toggleCommon(val,index,val.id)" v-for="(val,index) in commonList">
            <i></i>{{val.name}}</div>
        </div>
      </div>
      <!-- 配套设施 end -->
      <!--周边设施-->
      <div class="item-wrapper">
        <!-- <p class="item-title">周边设施</p> -->
        <div class="device-list clearfix" @click="toEditorPage()">
          <span class="item-title">周边设施</span>
          <span class="go-box">
            <i class="go-icon"></i>
          </span>
        </div>
      </div>
      <!--周边设施end-->
      <!-- 图片上传 -->
      <div class="item-wrapper">
        <p class="item-title">图片上传</p>
        <div class="img-upload-wrapper clearfix">
          <div class="img-upload-box">
            <input type="file" @change="add_imgs()" ref="imgGet" accept="image/*">
          </div>
          <div class="img-box" v-for="(item,index) in imagesList" @click="showPop('删除','确定删除该图片？','确定',delete_img(index))">
            <img :src="item" ref="imgs" />
          </div>
        </div>
      </div>
      <!-- 图片上传end -->
      <!-- 确认添加按钮 -->
      <div class="submit-wrapper">
        <button type="button" @click="addRoom()">确认添加</button>
      </div>
      <!-- 确认添加按钮 end -->
    </div>
    <!--<pop-alert></pop-alert>-->
    <!--弹框-->
    <div class="editorPage" v-show="editorPageShow">
      <iframe id="iframeEditBox" class="iframe-editBox" src="/static/js/wangEditor-mobile/index.html" frameborder="0"></iframe>
      <div class="submit-wrapper">
        <button class="cancel" type="button" @click="closeEditor()">关闭</button>
        <button class="comfirm" type="button" @click="submitEditor()">点击确认</button>
      </div>
    </div>
    <!--地图选点-->
    <selectPoint v-if="isMapShow" :point="initPoint" :confirm="hideMap"></selectPoint>
  </div>
</template>

<script>
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import Checklist from 'vux/src/components/checklist/index'
import WHeader from "../modules/wheader/wheader.vue";
import selectPoint from '../modules/map/selectPointsMap'

export default {
  name: 'selectOne',
  data() {
    return {
      houseInfo: [],
      headerTitle: "发布房源",
      commonList: [],
      editorPageShow: false,//是否显示富文本编辑器
      iframeEditBox:null,//编辑器容器
      showSuccessToast: false,
      picValue: "",
      imgs: [],
      houseId: "",
      keyword: ['四室一厅', '拎包入住', '水电齐全'],
      imagesList: [],
      //地图选点初始化点位
      initPoint:{
        lng:0,
        lat:0,
        address:''
      },
      isMapShow:false,
      message: {
        title: "",
        phone: "",
        name: "",
        cost: "",
        acreage: "",
        type: "1",
        housetype: "",
        facility: [], //点击选中的配置
        images: [],
        id: "",
        keyword: [], //关键词
        userid: '',
        describes: '',//周边设施
        orientation: '',
        decoration: '',
        purpose: '',
        wage: '',
        pledge: '',
        floor: '',
        address: '',
        coord: ''
      }
    }
  },
  components: {
    WHeader,
    Checker,
    CheckerItem,
    Checklist,
    selectPoint
  },
  mounted(){
    this.iframeEditBox = document.getElementById('iframeEditBox');
  },
  created() {
    var that = this;
    var API = this.$store.state.api;
    var userInfo = this.getLocation("userInfo");//用户信息
    var commonList = this.commonList = this.getLocation("facilityList");//所有配套设施
    //初始化所有所有配套设施
    for (var key in this.commonList) {
      this.$set(this.commonList[key], 'isChoose', false);
    }

    var houseId = this.houseId = this.getLocation("houseId");
    var point = this.getLocation('addressInfo');
    var address = this.getLocation("userArea");
    this.initPoint.lng = point.lng;
    this.initPoint.lat = point.lat;
    this.message.address = this.initPoint.address = address;

    if (houseId) {
      this.showLoading('正在加载房源信息...');
      this.$http.post(API.getHouseDetail, {
        id: houseId,
        userid: userInfo.id
      }, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          if (result.state == 1) {
            var data = result.data;
            var houseInfo = this.houseInfo = data[0].house; //获取房源数据

            this.message.title = houseInfo.title;
            this.message.phone = houseInfo.phone;
            this.message.cost = houseInfo.cost;
            this.message.acreage = houseInfo.acreage;
            this.message.type = houseInfo.type;
            this.message.housetype = houseInfo.housetype;
            this.message.id = houseId;
            this.message.userid = userInfo.id;
            this.message.orientation = houseInfo.orientation;
            this.message.decoration = houseInfo.decoration;
            this.message.purpose = houseInfo.purpose;
            this.message.wage = houseInfo.wage;
            this.message.pledge = houseInfo.pledge;
            this.message.floor = houseInfo.floor;
            this.message.address = houseInfo.address;
            this.message.describes = houseInfo.describes;
            this.message.coord = houseInfo.coord;

            this.imagesList = houseInfo.images.split(",");
            //设置配套设施数据
            var facility = this.facility = data[0].facility;

            // 初始化房间配置
            for (var i = 0; i < facility.length; i++) {
              for (var j = 0; j < commonList.length; j++) {
                if (facility[i].id == commonList[j].id) {
                  this.$set(that.commonList[j], 'isChoose', true);
                  this.message.facility.push(facility[i].id); //初始化要提交的房间配置
                }
              }
            }

            //设置keyword数据
            if (houseInfo.keyword) {
              this.message.keyword = (houseInfo.keyword).split(",");
            } else {
              this.message.keyword = [];
            }

            this.hideLoading();

          } else {
            this.showToast(result.message, 2, 1500);
          }
        });
    } else {
      this.message.userid = userInfo.id;
      this.message.coord = this.initPoint.lng  + ',' + this.initPoint.lat;
    }
  },
  methods: {
    openMap(){
      this.isMapShow = true;
    },
    hideMap(point){
      this.message.coord = point.lng + ',' + point.lat;
      this.message.address = point.address;
      this.isMapShow = false;
    },
    //打开富文本编辑器
    toEditorPage() {
      var self = this;
      this.editorPageShow = true;
      //设置编辑器文本
      this.iframeEditBox.contentWindow.setEditorContent(this.message.describes);
      // this.$router.push('editorPage');
    },
    //提交富文本编辑完成数据
    submitEditor() {
      var self = this;
      this.showPop('提示', '是否提交信息', '确定', function() {
        self.message.describes = self.iframeEditBox.contentWindow.getContent();
        self.closePop();
        self.editorPageShow = false;
      });

    },
    //关闭富文本编辑器
    closeEditor(){
      this.editorPageShow = false;
    },
    toggleCommon(val, index, id) { //配套设置选择事件
      this.message.facility = [];

      //点击配置的样式修改
      if (this.commonList[index].isChoose == true) {
        this.$set(this.commonList[index], 'isChoose', false);
      } else {
        this.$set(this.commonList[index], 'isChoose', true);
      }

      //循环选中的配置，赋值给要提交的类
      for (var key in this.commonList) {
        if (this.commonList[key].isChoose === true)
          this.message.facility.push(this.commonList[key].id);
      }

    },
    add_img() {
      var that = this;
      var API = this.$store.state.api;
      // 通过DOM取文件数据
      var inputDOM = this.$refs.imgGet;
      // 通过DOM取文件数据
      var file = inputDOM.files[0];
      let size = Math.floor(file.size / 1024);
      // 这里就可以获取到文件的名字了
      var fileName = file.name;

      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        var reader = new FileReader();
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          //上传图片信息
          that.$http.post(API.userToImg, { 'base64': this.result }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            emulateJSON: true
          })
            .then((res) => {
              var result = res.body;
              if (result.state == 1) {
                that.imagesList.push(result.message);
              } else {
                that.showToast(res.message, 2, 1500); //提交远程提交图片失败
              }
            });


        }
      }

    },
    //添加图片
    add_imgs() {
      var that = this;
      var API = this.$store.state.api;
      // 通过DOM取文件数据
      var inputDOM = this.$refs.imgGet;
      var file = inputDOM.files[0];
      var form = new FormData();
      form.append('file',file);

      if (/^image/.test(file.type)) {

          that.$http.post(API.houseNewToImg,form, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            emulateJSON: true
          })
            .then((res) => {
              var result = res.body;
              if (result.state == 1) {
                that.imagesList.push(result.message);
              } else {
                that.showToast(result.message, 2, 1500); //提交远程提交图片失败
              }
            });
      }

    },
    delete_img(index) {
      var self = this;
      return function() {
        self.imagesList.splice(index, 1);
        self.closePop();
      }

    },
    addRoom() {

      var that = this;
      var API = this.$store.state.api;
      /***提交要上传的图片到服务器，获取绝对url**/
      var imgs = that.$refs.imgs;
      var loadImages = ""; // 初始化IMAGES
      var regex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;

      if (!this.message.title) {
        this.showToast("请输入房间名", 2, 1500);
        return;
      } else if (!this.message.phone) {
        this.showToast("请输入房东电话", 2, 1500);
        return;
      } else if (!/^1[34578]\d{9}$/.test(this.message.phone)) {
        this.showToast("电话号码有误", 2, 1500);
        return;
      } else if (!this.message.cost) {
        this.showToast("请输入出售价格", 2, 1500);
        return;
      } else if (!this.message.acreage) {
        this.showToast("请输入出售面积", 2, 1500);
        return;
      } else if (!this.message.housetype) {
        this.showToast("请输入出售户型", 2, 1500);
        return;
      } else if (!this.message.orientation) {
        this.showToast("请输入房屋朝向", 2, 1500);
        return;
      } else if (!this.message.decoration) {
        this.showToast("请输入装修类型", 2, 1500);
        return;
      } else if (!this.message.purpose) {
        this.showToast("请输入房屋用途", 2, 1500);
        return;
      } else if (this.message.type == 3 && !this.message.wage) {
        this.showToast("请输入钟点房费", 2, 1500);
        return;
      } else if (this.message.type == 3 && !this.message.pledge) {
        this.showToast("请输入日租押金", 2, 1500);
        return;
      } else if (!this.message.floor) {
        this.showToast("请输入楼层", 2, 1500);
        return;
      } else if (!this.message.address) {
        this.showToast("请输入房屋地址", 2, 1500);
        return;
      } else if (!this.imagesList[0]) {
        this.showToast("至少上传一张房间图片", 2, 1500);
        return;
      }
      this.showLoading("正在提交房源信息...");
      this.submit();
    },
    submit(loadImages) {
      // console.log(loadImages);
      var API = this.$store.state.api;
      var that = this;

      var URL = this.houseId ? API.roomUpdate : API.roomSave;

      this.message.facility = this.message.facility.join(",");
      this.message.keyword = this.message.keyword.join(",");
      this.message.images = this.imagesList.join(',');

      this.$http.post(URL, this.message, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        this.hideLoading();
        var result = res.body;
        if (result.state == 1) { //添加成功
          this.showToast(result.message, 1, 1500);
          setTimeout(() => {
            that.$router.back();
          }, 1500);

        } else {
          that.showToast(result.message, 2, 1500);
        }

      });
    }



  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../assets/config";
.release-room {
  .editorPage {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    top: 2rem;
    z-index: 99;
    .iframe-editBox {
      width: 100%;
      height: 500px;
      // margin-top: 50px;
    }
    .submit-wrapper {
      width: 100%;
      height: 2.5rem;
      position: fixed;
      bottom: 0;
      border-top:0.025rem solid #c0c0c3;

      button {
        width: 48%;
        height: 2.5rem;
        border: 0;
        font-size: 0.7rem;
      }
      .comfirm{
        background-color: $header-color;
        color: #fff;
      }
      .cancel{
        background-color: #fff;
        color: #686868;
      }

    }
  }
  .middle-wrapper {
    .input-wrapper {
      width: 100%;
      height: 2.25rem;
      text-align: left;
      font-size: 0.65rem;
      line-height: 2.25rem;
      background-color: #fff;
      padding: 0 3%;
      display: block;

      .input-wrapper-box {
        border-bottom: 0.025rem solid #eee;
        height: 100%;
        width: 100%;

        div {
          float: left;
        }

        .title-box {
          float: left;
          display: inline-block;
          width: 28%;
        }

        .input-box {
          width: 72%;
          height: 80%;

          input {
            height: 100%;
            width: 100%;

            &:disabled {
              background-color: #fff;
              color: #999;
            }
          }
        }
      }
    }

    .check-box-wrapper {
      height: auto;
      text-align: left;
      font-size: 0.65rem;
      background-color: #fff;
      padding: 0 3%;

      .check-box {
        border-bottom: 0.025rem solid #eee;

        .title-box {
          display: inline-block;
          width: 30%;
          line-height: 2.25rem;
          float: left;
        }

        .checkbox-parent {
          display: inline-block;
          width: 68%;

          .box {
            display: inline-block;
            margin-bottom: 0.5rem;

            div {
              display: inline-block;
            }

            .apartmentType-item,
            .sellType-item {
              border: 1px solid #ececec;
              padding: 0 0.5rem;
              line-height: 1.2rem;
              margin: 0.5rem 0.5rem 0 0;
            }
            .apartmentType-item-selected,
            .sellType-item-selected {
              border: 1px solid $inline-color;
            }
          }
        } //checkbox-parent
      }
    } //check-box-wrapper
    .item-wrapper {
      background-color: #fff;
      margin-top: 0.5rem;
      padding: 0.2rem 0.6rem 0.45rem 0.6rem;
      text-align: left;

      .item-title {
        line-height: 2rem;
        height: 2rem;
        font-size: 0.64rem;
        color: #666;
      }

      .device-list {
        width: 100%;
        text-align: left;
        .item-name {}
        .device-box {
          display: inline-block;
          font-size: 0.65rem;
          width: 20%;

          i {
            width: 0.6rem;
            height: 0.6rem;
            display: inline-block;
            vertical-align: middle;
            background-image: url('/static/img/unAction.png');
            background-size: 0.6rem 0.6rem;
            margin-right: 0.5rem;
          }
        }

        .select {
          i {
            width: 0.6rem;
            height: 0.6rem;
            display: inline-block;
            vertical-align: middle;
            background-image: url('/static/img/action.png');
            background-size: 0.6rem 0.6rem;
            margin-right: 0.5rem;
          }
        }
      }

      .img-upload-wrapper {
        width: 100%;

        .img-upload-box {
          margin-top: 0.5rem;
          width: 21.8%;
          display: inline-block;
          background: url('/static/img/tianjiatupian.png') no-repeat;
          background-size: 100% 100%;
          border: 0.025rem solid #eee;

          input[type=file] {
            opacity: 0;
            width: 3.625rem;
            height: 3.625rem;
            border: 0.025rem solid #eee;
          }
        }
        .img-box {
          display: inline-block;
          width: 20%;
          margin-top: 0.5rem;

          img {
            width: 100%;
          }
        }

        .img-upload-box+.img-box,
        .img-box+.img-box {
          margin-left: 2%;
        }
      }
    }

    .submit-wrapper {
      width: 100%;
      height: 2.5rem;
      position: fixed;
      bottom: 0;

      button {
        width: 100%;
        height: 2.5rem;
        background-color: $header-color;
        border: 0;
        font-size: 0.7rem;
        color: #fff;
      }
    }
  }
}
</style>
