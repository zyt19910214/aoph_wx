
const app = getApp()

Page({
  
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    fruitInfo: [],
    curPage: 1,
    pageSize: 10,
    loadingMoreHidden: true,
    activeTypeId:0,
    isShow:false,
    openid: ''
  },
  onPageScroll(e) {
   //console.log('页面滑动',e)
  },



  // ---------点击跳转至详情页面-------------
  tapToDetail: function(e) {
    //console.log('2311122222222222222',e)
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.currentTarget.dataset.fid,
    })
  
  },


  // ------------生命周期函数------------
  onLoad: function (options) {
  
   
  },

  onReady: function () {

  },


  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

    //获取当前分类的商品
    this.getGoodsList(this.data.activeTypeId)
    
  },
  getGoodsList: function (categoryId, append) {
    // console.log(categoryId)
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;

    wx.request({
      url: app.globalData.apiServer + 'wxlistGood/',
      data: {
        categoryId: -1,
        nameLike: '',
        page:that.data.curPage,
        pageSize: that.data.pageSize
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method:'POST',
      success: function (res) {
        console.log('1',res)
        if (res.data.code == 404 || res.data.code == 700) {
          that.setData({
             loadingMoreHidden: false 
          });
          if(append){
            wx.showToast({
              title: '没有更多啦',
              icon: '',
              image: '',
              duration: 1000,
            })
          }
          wx.hideLoading()
        }else{
          let goods = [];
          if (append) {
            goods = that.data.fruitInfo
            
          }
          
          for (var i = 0; i < res.data.data.length; i++) {
            goods.push(res.data.data[i]);
          }
          console.log(goods)
          that.setData({
            isShow:true,
            loadingMoreHidden: true,
            fruitInfo: goods,
          });
          //console.log("当前的商品信息：", that.data.fruitInfo)
          wx.hideLoading()
        }
       
      }
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  
  },

  onReachBottom: function () {
    if(this.data.loadingMoreHidden){
      let page = this.data.curPage + 1
      //console.log('当前页数',page)
      this.setData({
        curPage: page
      })
      this.getGoodsList(this.data.activeTypeId, true)
    }else{
      wx.showToast({
        title: '没有更多啦',
        icon: '',
        image: '',
        duration: 500,
      })
    }
    

  },

  onShareAppMessage: function () {
    return {
      title: 'Aus澳品汇特价商品，快来看看吧！',
      imageUrl: '../../images/icon/title.png',
      path: '/pages/specialoffer/specialoffer'
    }
  }

})