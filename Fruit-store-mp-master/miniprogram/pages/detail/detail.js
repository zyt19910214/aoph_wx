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
    // console.log('hhhh')
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },




  
  // ------------加入收藏------------
  addLoveByDetail: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)
    this.isNotRepeteToLove({ id: e.currentTarget.dataset._id, _openid: this.data.openid })

  },


  // 判断是否已收藏
  isNotRepeteToLove: function (item) {

    app.getInfoWhere('love', { id: item.id, _openid: item._openid },
      e => {
        if (e.data.length != 0) {
          wx.hideLoading()
          wx.showToast({
            title: '许过愿啦！',
          })

        } else {
          // 保存收藏
          app.addRowToSet('love', { id: item.id }, e1 => {
            console.log(e1)

            wx.request({
              url: 'https://api.it120.cc/aoph/shop/goods/detail',
              data: {
                id: item.id
              },
              success: function (res) {

                app.globalData.carts.push(res.data.data) // 进行动态的操作

              }
            })
            wx.hideLoading()
            wx.showToast({
              title: '许愿成功',
            })
            this.setData({
              islove: true
            });
          })
        }
      }
    )
  },

  // 详细信息切换
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.showLoading() 

    app.getInfoWhere('love', { id: parseInt(e._id)}, res => {
      if(res.data.length>0){
        this.setData({
          islove: true
        })
      }else{
        this.setData({
          islove: false
        })
        
      }
      
    })
    var that = this
    wx.request({
      url: 'https://api.it120.cc/aoph/shop/goods/detail',
      data: {
        id: e._id
      },
      success: function (res) {
        console.log(res)

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