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
    openid: '',
    text: '暂无公告',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 12,
    orientation: 'left',//滚动方向
    interval: 20 // 时间间隔

  },
  onPageScroll(e) {
   //console.log('页面滑动',e)
  },

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

    // 页面显示
    var vm = this;
    vm.get_ad()
    var length = vm.data.text.length * vm.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
    
    vm.run1();// 水平一行字滚动完了再按照原来的方向滚动
    
    //获取所有分类
    this.getTypeList()

    //获取当前所在分类
    let id = this.data.activeTypeId

    //获取当前分类的
    this.getGoodsList(id)

    
  }, 
  get_ad:function(){
    var that = this;

    wx.request({
      url: app.globalData.apiServer + 'wxgetadd/',
      data: {
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        //console.log('1',res)
        if (res.data.code == 0 ) {
         that.setData({
           text:'公告： '+res.data.data
         });
        } else {       
       
        }
      }
    })

  }, run1: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance < vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run1();
      }
    }, vm.data.interval);
  },
 
 
  getTypeList:function(){
    var that = this
    // ---------加载所有分类-------------
    wx.request({
      url: app.globalData.apiServer + 'wxlistType/ ',
      success: function (res) {
        var categories = [{ id: 0, name: "全部" }];
        console.log(res)
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
      url: app.globalData.apiServer + 'wxlistGood/',
      data: {
        categoryId: categoryId,
        nameLike: '',
        page:that.data.curPage,
        pageSize: that.data.pageSize
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method:'POST',
      success: function (res) {
        //console.log('1',res)
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
    //console.log('111111111111111111111111111111111111')
    this.getGoodsList(0)
  
  },
  
  lower: function (e) {
    console.log(e)
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
      title: 'Aus澳品汇 这家店真心不错,看看有没有自己想要的。品质消费，好而不贵！',
      imageUrl: '../../images/icon/title.png',
      path: '/pages/homepage/homepage'
    }
  }

})