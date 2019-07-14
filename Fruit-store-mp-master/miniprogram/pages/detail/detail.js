// miniprogram/pages/detail/detail.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    fruitDetail: {}, //商品详情
    curIndex: 0,
    islove:true
  },

  // 跳转收藏页面
  goToCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart',

    })
    
  },

  // ------------加入收藏------------
  addLoveByDetail: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.apiServer + 'wxaddLove/',
      data: {
        id: e.currentTarget.dataset._id,
        openid: app.globalData.openid
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        app.globalData.carts = true 
        console.log(app.globalData.carts)
        wx.hideLoading()
        wx.showToast({
          title: '许愿成功',
        })
        that.setData({
          islove: true
        });
      }
    })
   

  },


  // 判断是否已收藏
  isNotRepeteToLove: function (item) {
    var that = this;

    wx.request({
      url: app.globalData.apiServer+'wxisNotRepeteToLove/',
      data: {
        id: item.id,
        openid: item._openid
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        //console.log('1',res)
        if (res.data.code == 400) {
          wx.hideLoading()
         
        } else {  
          that.setData({
            islove: false
          });
        }

      }
    })

  },

  // 详细信息切换
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: '15105390367',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //console.log('23222.',e)
    wx.showLoading() 

    this.isNotRepeteToLove({ id: e._id, _openid: app.globalData.openid })

    var that = this
    wx.request({
      url: app.globalData.apiServer + 'wxGoodDetail/ ',
      data: {
        id: e._id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        //console.log('12',res)
        that.setData({
          fruitDetail: res.data.data,
        });
        WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
        wx.hideLoading()
      }
    })
    
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e1) {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})