// components/search/search.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchWord:''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 获取搜索词
    listenerSearchInput: function (e) {
      getCurrentPages()["0"].setData({
        searchWord: e.detail.value
      })
    },

    // 点击查找按钮
    toSearch: function(e){
      const myWord = getCurrentPages()["0"].data.searchWord
      if ("undefined" != typeof myWord){
        // ---------点击跳转至详情页面-------------
        wx.navigateTo({
          url: '../searchInfo/searchInfo?_word=' + myWord,
        })
      }else{
        wx.showToast({
          title: '请输入搜索内容！',
          icon: 'success',
          image: '',
          duration: 1500,
          mask: false,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      
    }
    
  }
})
