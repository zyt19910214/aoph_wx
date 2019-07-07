// page/component/new-pages/cart/cart.js
const app = getApp()

Page({
  data: {
    carts:[],               // 收藏列表
    hasList: true,          // 列表是否有数据
    delBtnWidth: 180 //删除按钮宽度单位（rpx）
  },

  onLoad(e) {
    // 页面初始化 options为页面跳转所带来的参数

    this.initEleWidth();

    this.getlove()
  },

  onShow() {
   
    let loves = app.globalData.carts
    //console.log(loves.length)
    if(loves.length>0){
      this.setData({  
        hasList:true,
        carts: loves
      })
    }else{
      this.setData({
        hasList: false,
      });
    }
 
  },


  onHide: function () {
   
  },

  touchS: function (e) {

    if (e.touches.length == 1) {

      this.setData({

        //设置触摸起始点水平方向位置

        startX: e.touches[0].clientX

      });

    }

  },

  touchM: function (e) {

    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;

      //手指起始点位置与移动期间的差值

      var disX = this.data.startX - moveX;

      var delBtnWidth = this.data.delBtnWidth;

      var txtStyle = "";

      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变

        txtStyle = "left:0px";

      } else if(disX > 0){ //移动距离大于0，文本层left值等于手指移动距离

        txtStyle = "left:-" + disX + "px";

        if (disX >= delBtnWidth) {

          //控制手指移动距离最大值为删除按钮的宽度

          txtStyle = "left:-" + delBtnWidth + "px";

        }

      }

      //获取手指触摸的是哪一项

      var index = e.target.dataset.index;

      var list = this.data.carts;

    
      //更新列表的状态

      this.setData({

        carts: list

      });

    }

  },



  touchE: function (e) {

    if (e.changedTouches.length == 1) {

      //手指移动结束后水平位置

      var endX = e.changedTouches[0].clientX;

      //触摸开始与结束，手指移动的距离

      var disX = this.data.startX - endX;

      var delBtnWidth = this.data.delBtnWidth;

      //如果距离小于删除按钮的1/2，不显示删除按钮

      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      console.log(txtStyle)
      //获取手指触摸的是哪一项
      console.log(e.currentTarget)
      var index = e.currentTarget.dataset.index;
      console.log('ssss',index)
      var carts = this.data.carts;
     
      carts[index]['txtStyle'] = txtStyle;
      console.log(carts)
      //更新列表的状态

      this.setData({

        carts: carts

      });

    }

  },

  //获取元素自适应后的实际宽度

  getEleWidth: function (w) {

    var real = 0;

    try {

      var res = wx.getSystemInfoSync().windowWidth;

      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应

      // console.log(scale);

      real = Math.floor(res / scale);
      console.log('real',real)
      return real;

    } catch (e) {

      return false;

      // Do something when catch error

    }

  },

  initEleWidth: function () {

    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

    this.setData({

      delBtnWidth: delBtnWidth

    });

  },


  /**
   * 删除收藏的当前商品
   */
  deleteList(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)
    const index = e.currentTarget.dataset.index;
    console.log(index)
    let carts = app.globalData.carts;
    app.getInfoWhere('love', { id: e.currentTarget.dataset._id},e3=>{

      app.deleteInfoFromSet('love', e3.data[0]['_id'],e4=>{
 
        wx.showToast({
          title: '删除成功',
        })
        carts.splice(index, 1);
        this.setData({
          carts:carts
        });
        app.globalData.carts = carts

        if (!carts.length) {
          this.setData({
            hasList: false
          });
        } else {
        }
      })
      })
      
   
  },onPullDownRefresh: function () {

  },


  getlove:function (e){
    let that = this
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      app.getInfoWhere('love', {}, e => {
        
        //console.log(e.data)

        for (let i = 0; i < e.data.length; i++) {
          //console.log(e.data[i]['id'])
          wx.request({
            url: 'https://api.it120.cc/aoph/shop/goods/detail',
            data: {
              id: e.data[i]['id']
            },
            success: function (res) {
              //console.log(res.data.data)
              let details = app.globalData.carts
              if (JSON.stringify(details).indexOf(JSON.stringify(res.data.data)) == -1) {
                details.push(res.data.data) // 进行动态的操作
              }
              app.globalData.carts = details
              that.setData({
                carts:details
              })
            }
          })
        }
        //console.log(e.data.length)
        if (e.data.length == 0) {
          that.setData({
            hasList: false
          });

        } else {
          that.setData({
            hasList: true,
          });

        }

        wx.hideLoading()
    
      })
    

   
  }





})