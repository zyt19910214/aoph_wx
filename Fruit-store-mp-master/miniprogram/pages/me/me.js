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
      title: 'Aus澳品汇 这家店真心不错,看看有没有自己想要的。品质消费，好而不贵！',
      imageUrl: '../../images/icon/title.png',
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