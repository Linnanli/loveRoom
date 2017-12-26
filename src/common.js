
module.exports = {

  install: function (Vue, options) {
    /**用openid
     * 判断是否登录过
     * 获取用户信息
     * */
    Vue.prototype.checkUser = function () {
      var that = this;
      var API = this.$store.state.api;
      var userInfo = this.getLocation("userInfo") || {};
      // userInfo.openid = 'obJDz0oGOVhCrVQTUmeh9-T2D2Pk';
      if (userInfo.openid) {//当获取到openid时候 refresh_token 时候 data.data.openid

        this.$http.get(API.checkUser + "?openid=" + userInfo.openid, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          if (result.state == 0) {
            this.$router.replace('/userInfo'); //未登录过跳转到信息完善列表
          } else {
            var data = result.data[0];
            that.setLocation("userInfo", data);//保存用户信息
            var state = this.GetQueryString('state');
            if(!state){
              this.$router.replace('/');//登陆过跳转到首页
            }else{
              if(state=='money'){
                this.$router.replace('/user');
              }else if(state=='house'){
                if(data.type == 2){
                  this.$router.replace('/releaseRoom');
                }else{
                  this.$router.replace('/');
                }
                
              }else if(state=='orders'){
                this.$router.replace('/orderList');
              }else if(state=='index'){
                this.$router.replace('/');
              }
            }
            
          }
        });

      } else {
        alert("获取OPENID失败");
      }
    }

    //返回上一页
    Vue.prototype.back = function () {
      this.$store.state.showPop = false;//显示弹框
      this.$store.state.showSuccessToast = false;
      this.$router.back();

    };

    //成功弹框
    Vue.prototype.showToast = function (title, type, time, func) {
      this.$store.state.toastConfig = {
        title: title ? title : "",
        ToastType: type ? type : 2,//弹框类型
      }

      console.log(this.$store.state.toastConfig);
      this.$store.state.showSuccessToast = true;

      setTimeout(() => {
        this.$store.state.showSuccessToast = false;
        func && func();
      }, time);
    };

    //pop 弹框的方法
    Vue.prototype.submit = function () { }

    Vue.prototype.GetQueryString = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    }
    //成功弹框
    Vue.prototype.showPop = function (title, content, buttonName, func, index) {
      this.$store.state.showPop = true;//显示弹框
      //弹框中配置
      this.$store.state.popConfig = {
        title: title ? title : null,
        content: content ? content : null,
        buttonName: buttonName ? buttonName : "提交"
      }

      Vue.prototype.submit = function () {
        func && func();
      };
    };

    //关闭弹框
    Vue.prototype.closePop = function () {
      this.$store.state.showPop = false;
    }

    //显示loading弹框
    Vue.prototype.showLoading = function (text) {
      this.$store.state.loadConfig.loadShow = true;
      this.$store.state.loadConfig.loadText = text;
    }

    //关闭loading弹框
    Vue.prototype.hideLoading = function () {
      this.$store.state.loadConfig.loadShow = false;
    }

    //保存改变个人资料时候，保存更新本地用户信息session
    Vue.prototype.getUserInfo = function () {
      var that = this;
      var API = this.$store.state.api;
      var userInfo = this.getLocation("userInfo"); //判断是否是第一次登录的时候,获取的用户信息
      userInfo = {};//测试语句
      userInfo.openid = "obJDz0oGOVhCrVQTUmeh9-T2D2Pk"; //测试
      // userInfo.openid = 'obJdzOvi9GYT3XmxqaEe7LSNVDtg';
      if (userInfo.openid) {

        this.$http.get(API.checkUser + "?openid=" + userInfo.openid, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          emulateJSON: true
        }).then((res) => {
          var result = res.body;
          if (result.state == 1) {
            var data = result.data[0];
            // that.showToast("保存成功", 1,1500,that.toUserPage);
            that.setLocation("userInfo", data);//保存用户信息
          } else {
            alert("获取保存的用户信息失败");
          }
        });
      } else {
        // alert("openid为空");
      }

    };

    //获取房屋配置信息字典表
    Vue.prototype.getFacilityList = function () {
      var that = this;
      var API = this.$store.state.api;
      console.log("获取配置");
      this.$http.post(API.loadFacility, {}, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        emulateJSON: true
      }).then((res) => {
        var result = JSON.parse(res.bodyText);
        if (result.state == 1) { //获取配套信息字典表
          // console.log(result.data);
          this.setLocation("facilityList", result.data);
        } else {
          that.showToast(result.message, 2, 1500);
        }
      });

    }

    // //存储location
    Vue.prototype.setLocation = function (name, val) {
      window.sessionStorage.setItem(name, window.JSON.stringify(val));
    }

    //获取存储信息location
    Vue.prototype.getLocation = function (name) {
      return window.JSON.parse(window.sessionStorage.getItem(name));
    }

    //删除存储的值
    Vue.prototype.removeLocation = function (name) {
      window.sessionStorage.removeItem(name);
    }

    //设置长存储
    Vue.prototype.setLongStorage = function (name, val) {
      window.localStorage.setItem(name, window.JSON.stringify(val));
    }
    //获取长存储
    Vue.prototype.getLongStorage = function (name, val) {
      return window.JSON.parse(window.localStorage.getItem(name));
    }
    //删除长存储的值
    Vue.prototype.removeLocation = function (name) {
      window.localStorage.removeItem(name);
    }


    //数据拷贝
    Vue.prototype.copy = function (obj, params) {
      var key;
      for (key in params) {
        if (!(params[key] instanceof Object)) {
          obj[key] = params[key];
        }
        else {
          if (params[key] instanceof Array) {
            obj[key] = [];
          } else {
            obj[key] = {};
          }
          Vue.prototype.copy(obj[key], params[key]);
        }

      }
    }
    //设置类型的集合
    var class2type = {};
    var typeArr = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ');
    typeArr.forEach(function (item) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    });
    //判断类型
    Vue.prototype.type = function (val) {
      return class2type[class2type.toString.call(val)];
    }


  }

};

