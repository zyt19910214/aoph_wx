// miniprogram/pages/homepage/homepage.js


const app = getApp()

Page({
  
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    fruitInfo: [],
    curPage: 1,
    pageSize: 10,
    loadingMoreHidden: true,
    typeCat: [],
    activeTypeId:0,
    isShow:false,
    openid: ''
  },
  onPageScroll(e) {
   //console.log('页面滑动',e)
  },

  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('云函数login返回结果:', res)
        var openid = res.result.openid;
        //console.log('云函数获取到的openid:', openid)
        that.setData({
          openid: openid
        })
      }
    })
  },

  // // ------------加入收藏------------
  // addLoveByHome: function(e) {
  //   wx.showLoading({
  //     title: '加载中',
  //   }) 
  //   console.log(e.currentTarget.dataset)
  //   app.isNotRepeteToLove({ id: e.currentTarget.dataset._id, _openid: this.data.openid })
    
  // },
 

  // ------------分类展示切换---------
  typeSwitch: function(e) {
    //将当前分类存储到activeTypeId，并将页码置为1，清空已存的商品信息
    this.setData({
      activeTypeId: parseInt(e.currentTarget.id),
      loadingMoreHidden:true,
      curPage:1,
      fruitInfo: []
    });
    //获取当前类型下的所有数据
    this.getGoodsList(e.currentTarget.id)
  },


  // ---------点击跳转至详情页面-------------
  tapToDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.currentTarget.dataset.fid,
    })
  },


  // ------------生命周期函数------------
  onLoad: function (options) {
    var that = this

    // 获取openId
    this.getOpenid();
   
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
    //获取所有分类
    this.getTypeList()

    //获取当前所在分类
    let id = this.data.activeTypeId

    //获取当前分类的
    this.getGoodsList(id)

    
  },
 
  getTypeList:function(){
    var that = this
    // ---------加载所有分类-------------
    wx.request({
      url: 'https://api.it120.cc/aoph/shop/goods/category/all',
      success: function (res) {
        var categories = [{ id: 0, name: "全部" }];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          typeCat: categories,
          isShow: true
        });
        //console.log('当前分类为：', that.data.typeCat)
      }
    })
  }
  ,
  getGoodsList: function (categoryId, append) {
    // console.log(categoryId)
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;


    wx.request({
      url: 'https://api.it120.cc/aoph/shop/goods/list',
      
      data: {
        categoryId: categoryId,
        nameLike: '',
        page:that.data.curPage,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        //console.log(res)
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
          that.setData({
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
    let that = this
    wx.startPullDownRefresh({
    })
    this.setData({
      curPage: 1
    });
    console.log('111111111111111111111111111111111111')
    this.getGoodsList(0)
  
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
      title: 'AO奥品汇',
      imageUrl: '../../images/icon/fruit.jpg',
      path: '/pages/homepage/homepage'
    }
  }

})