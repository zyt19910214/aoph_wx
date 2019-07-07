// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  var dbName = event.dbName; //集合名称
  var filter = event.filter ? event.filter:null; //筛选条件，默认为空，格式{_id:'ssss'}
  var pageIndex = event.pageIndex ?event.pageIndex: 1; //当前第几页，默认第一页
  var pageSize = event.pageSize ? event.pageSize:10; //每页获取多少数据，默认为10
  
  const countResult = await db.collection(dbName).where(filter).count() //获取集合中的总记录数
  const total = countResult.total
  const totalPage = Math.ceil(total/10) //计算需要多少页

  var haseMore; //提示前端还有数据
  if(pageIndex>totalPage || pageIndex == totalPage){
    haseMore = false;
  }else{
    haseMore = true;
  }

  //最后查询数据并返回给前端
  return db.collection(dbName).where(filter).skip((pageIndex-1)*pageSize).limit(pageSize).get().then(res =>{
    res.haseMore = haseMore;
    return res;
  })

}