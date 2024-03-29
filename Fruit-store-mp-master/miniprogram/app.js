//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "aoph-124265",//这个就是环境id
        traceUser: true,
      })
    }

    this.globalData = {
      cloudRoot : "clo140d-voyz-cloud-86f82a/",
      apiServer:"http://127.0.0.1:8888/",
      tmpNum: 0,
      tempFilePaths: "",
      carts:true,
      carts_list: [],
      admin: ["oenS94lGcw7qyDo0AZ7uWBqeo0Lg"],
      openId: null,
      appid: 'wxeeaa3b96ec8f029c',

    },
    // 获取用户openid

    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('云函数login返回结果:', res)
        var openid = res.result.openid;
        console.log('云函数获取到的openid:', openid)
        var that = this;
        that.globalData.openid = openid
      }
    })
    

  },

  // --------------常用----------------



  // 随机数生成函数
  RndNum: function(n){
      var rnd = "";
      for(var i = 0; i<n;i++)
      rnd += Math.floor(Math.random() * 10);
      return rnd;
  },


  // --------------数据库操作----------------

  // 向集合内新增记录(集合名，要添加的数据对象，回调函数)
  addRowToSet: function(setName,infoObject,callback){
    const db = wx.cloud.database()
    db.collection(setName).add({
      data: infoObject,
   
    }).then(callback)
  },

  // 从集合中取出数据
  getInfoFromSet: function (setName,selectConditionSet,callBack){
    const db = wx.cloud.database()
    db.collection(setName).where(selectConditionSet).get({
      success:callBack
    })
  },

  // 从集合中筛选数据
  getInfoWhere: function (setName,ruleObj,callback) {
    const db = wx.cloud.database()
    const _ = db.command

    db.collection(setName).where(ruleObj)
      .get({
        success: callback,
        fail: console.error
      })
  },
 

  // 排序后取出数据
  getInfoByOrder: function (setName, ruleItem, orderFuc,callback) {
    const db = wx.cloud.database()
    db.collection(setName)
      .orderBy(ruleItem, orderFuc)
      .get()
      .then(callback)
      .catch(console.error)
  },

  // 删除集合中的数据
  deleteInfoFromSet: function (setName,fruitId,callback) {
    const db = wx.cloud.database()
    db.collection(setName).doc(fruitId).remove().then(callback).catch(console.error)
  },

  // 选择本地图片上传至云端
  selectImgUpToC: function (imgName,tmpUrlCallback) {
    const self = this
    // 获取图片临时地址
    new Promise((resolve,reject)=>{
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          resolve(res.tempFilePaths["0"])
        }
      })
    }).then(e => self.upToClound("imgSwiper", imgName, e, tmpUrlCallback))
  },

  // 上传图片到云端（云端文件夹，云端文件名，文件临时地址）
  upToClound: (imgFolder, imgName, myFilePath,fileIDCallback) => {
    wx.cloud.uploadFile({
      cloudPath: imgFolder + "/" + imgName, // 上传至云端的路径
      filePath: myFilePath, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        wx.showToast({
          title: '图片已上传',
        })
        fileIDCallback(res.fileID)

      },
      fail: console.error
    })
  },

  // 获取云端文件tmpUrl
  getTmpUrl: (imgFolder, imgName,currentData)=>{
    wx.cloud.getTempFileURL({
      fileList: [getApp().globalData.cloudRoot+imgFolder + "/" + imgName],
      success: res => {
        // console.log(res.fileList["0"].tempFileURL)
        getCurrentPages().setData({
          currentData: res.fileList["0"].tempFileURL
        })
      },
      fail: console.error
    })
  }
})
