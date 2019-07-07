// page/component/new-pages/user/user.js
const app = getApp();

Page({
  data: {
  
  },
  onLoad() {
 
  },

  onShow() {
  
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '15105390367',
    })
  },
  goToBgInfo: function() {
    wx.navigateTo({
      url: '/pages/bgInfo/bgInfo',
    })
  },
  openLocation(e) {
    console.log(e)
    const value = e.detail.value
    console.log(value)
    wx.openLocation({
      longitude: 118.24065,
      latitude: 35.14640,
      name:"澳品汇义堂店",
      address:"山东省临沂市兰山区义堂中心卫生院东20米路南"
    })
  }, onShareAppMessage: function () {
    return {
      title: 'AO奥品汇',
      imageUrl: '../../images/icon/fruit.jpg',
      path: '/pages/homepage/homepage'
    }
  }, onPullDownRefresh: function () {
    wx.showLoading({
      title: '1111',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    console.log('111111111111111111111111111111111111')
  
  }
  
})