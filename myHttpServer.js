const http = require('http');
const fs=require("fs");
const ejs=require("ejs")
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/manage',{useNewUrlParser: true});
var Schema = mongoose.Schema;
const querystring=require("querystring")
//const insertDB=require('./MongodbLib')
const express=require('express');
const app=express()
app.use(express.static(__dirname+"/public"))
app.set("view engine","ejs");
app.set("views","./views")
var a='';
var username='';
var password='';
var submit='';
var access='';
var pname='';
var pcategory='';
var pmeasure='';
var pbprice='';
var psprice='';
var pfirm='';
var preserve='';
var pdate='';
var pexp='';
var onumber='';
var odate='';
var a='';
var a1='';
var a2='';
var logSchema=new Schema({
    username:String,
    password:String,
    access:String
});
var ordSchema=new Schema({
  pname:String,
  onumber:String,
  pfirm:String,
  odate:String
});
var proSchema=new Schema({
    pname:String,
    pcategory:String,
    pmeasure:String,
    pbprice:String,
    psprice:String,
    pfirm:String,
    preserve:String,
    pdate:String,
    pexp:String
})
const logObj = mongoose.model('users',logSchema);
const proObj = mongoose.model('products',proSchema);
const ordObj = mongoose.model('orders',ordSchema);
app.get('/input', (req, res,next) => {
    username=req.query.username;
    password=req.query.password;
    submit=req.query.submit1;
    access=req.query.access;
    //res.send('Hello World!')
    a="This is a next() test."
    if(username.length!=0&&password.length!=0&&access.length!=0)
    next()
    else res.render(__dirname+"/views/demo.ejs",{message:'用户名和密码都不能为空，请输入'})
  })
  
  app.get('/input', (req, res,next) => {
    loginData=new logObj({username:username,password:password,access:access});
    logObj.find({username:username},(err,docs)=>{if(!err){
        if(docs.length!=0)nameInDB=100;
        else nameInDB=0;
        next();
    }})
  })

  app.get('/input', (req, res,next) => {
    if(submit=="注册"){
        if(nameInDB==0)loginData.save((err)=>{res.render(__dirname+"/views/demo.ejs",{message:username+"，注册成功，欢迎使用"})})
        else res.render(__dirname+"/views/demo.ejs",{message:"用户名已存在，注册失败"})
        
    }
    else next();
    //res.send(a)
  })
  app.get('/input', (req, res,next) => {
    if(submit=="登录"){
      if(access=="manager"){
        logObj.find({username:username,password:password,access:access},(err,docs)=>{if(!err){
            if(docs.length!=0)res.render(__dirname+"/views/first.ejs")
            else res.render(__dirname+"/views/demo.ejs",{message:"登录失败"})
        }})}
      if(access=="noruser"){
        logObj.find({username:username,password:password,access:access},(err,docs)=>{if(!err){
            if(docs.length!=0)res.render(__dirname+"/views/nfirst.ejs")
            else res.render(__dirname+"/views/demo.ejs",{message:"登录失败"})
          }})}
    }
    else next();
  })
  //用户界面
  app.get('/userlist',(req, res,next) =>{
    a1=req.query.a1;
    a2=req.query.a2;    
    if(a1=="商品列表"){
      proObj.find({},(err,docs)=>{if(!err){
        res.render(__dirname+"/views/prolist.ejs",{product:docs})
      }
    })
  }
  else if(a1=="首页"){
    res.render(__dirname+"/views/first.ejs")

}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="增加商品"){
  res.render(__dirname+"/views/addpro.ejs")

}
else if(a1=="进货记录"){
  ordObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
  }
})

}
else if(a1=="查询"){
  var reg = new RegExp(a2);
  var _filter = {
  //多字段匹配
      $or: [
          {'username': {$regex: reg}},
          {'access': {$regex: reg}},
      ]
  }

  logObj.find(_filter, (err, docs) => { 
      if(err) {
          console.log(err)
      }
      
      else{
        console.log(docs)
        res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
      }

})
}
  else next();
 });
 //删除用户
 app.get('/userdelete',(req,res) =>{
  a=req.query.id;
  logObj.findByIdAndDelete({_id:a},(err,doc)=>{if(!err)
    logObj.find({},(err,docs)=>{if(!err)
    res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
    })
  })
});

 //首页
 app.get('/first',(req, res,next) =>{
  a1=req.query.a1;
  if(a1=="商品列表"){
    proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/prolist.ejs",{product:docs})
    }
  })
}
 else if(a1=="用户列表"){
  logObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
  }
})
}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="增加商品"){
  res.render(__dirname+"/views/addpro.ejs")

}
else if(a1=="进货记录"){
  ordObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
  }
})
}
else if(a1=="首页"){
  res.render(__dirname+"/views/first.ejs")

}
else next();
});


//修改信息
app.get('/proupdate',(req, res,next) =>{
  a1=req.query.a1;
  pname=req.query.pname;
  pcategory=req.query.pcategory;
  pmeasure=req.query.pmeasure;
  pbprice=req.query.pbprice;
  psprice=req.query.psprice;
  pfirm=req.query.pfirm;
  preserve=req.query.preserve;
  pdate=req.query.pdate;
  pexp=req.query.pexp;
  if(a1=="商品列表"){
    proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/prolist.ejs",{product:docs})
    }
  })
}
 else if(a1=="用户列表"){
  logObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
  }
})
}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="增加商品"){
  res.render(__dirname+"/views/addpro.ejs")

}
else if(a1=="进货记录"){
  ordObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
  }
})

}
else if(a1=="首页"){
  res.render(__dirname+"/views/first.ejs")

}
else if(a1=="确认"){
  proObj.update({pname:pname},{$set:{pname:pname,pcategory:pcategory,pmeasure:pmeasure,pbprice:pbprice,psprice:psprice,pfirm:pfirm,preserve:preserve,pdate:pdate,pexp:pexp}},(err,doc)=>{if(!err)
    proObj.find({},(err,docs)=>{if(!err)
    res.render(__dirname+"/views/prolist.ejs",{product:docs})
    })
  })
}
else if(a1=="取消"){
  proObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/prolist.ejs",{product:docs})
  }
})

}
else next();
});

app.get('/prodit',(req,res) =>{
  a=req.query.id;
  proObj.find({_id:a},(err,docs)=>{if(!err)  
    res.render(__dirname+"/views/proupdate.ejs",{product:docs})
    })
});

//添加进货
app.get('/order',(req, res,next) =>{
  a1=req.query.a1; 
  if(a1=="商品列表"){
    proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/prolist.ejs",{product:docs})
    }
  })
}
 else if(a1=="用户列表"){
  logObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
  }
})
}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="首页"){
  res.render(__dirname+"/views/first.ejs")

}
else if(a1=="增加商品"){
  res.render(__dirname+"/views/addpro.ejs")

}
else if(a1=="进货记录"){
  ordObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
  }
})
}
else next();
});

app.get('/order',(req, res,next) =>{
  pname=req.query.pname;
  onumber=req.query.onumber;
  pfirm=req.query.pfirm;
  var date = require("silly-datetime");
  var today = date.format(new Date(),'YYYY-MM-DD'); 
ordData=new ordObj({pname:pname,onumber:onumber,pfirm:pfirm,odate:today});
   if(a1=="确认"){
      ordData.save((err)=>{
      ordObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/orderlist.ejs",{order:docs})
    }
  })
})
}
else if(a1=="取消"){
  proObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/prolist.ejs",{product:docs})
  }
})
}
else next()
});

app.get('/addorder',(req,res) =>{
  a=req.query.id;
  proObj.find({_id:a},(err,docs)=>{if(!err)   
    res.render(__dirname+"/views/order.ejs",{order:docs})
    })
});

//商品列表
app.get('/prolist',(req, res,next) =>{
  a1=req.query.a1;
  a2=req.query.a2;
  
 if(a1=="用户列表"){
  logObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
  }
})
}
else if(a1=="首页"){
    res.render(__dirname+"/views/first.ejs")

}
else if(a1=="增加商品"){
  res.render(__dirname+"/views/addpro.ejs")

}
else if(a1=="进货记录"){
  ordObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
  }
})
}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="商品列表"){
  proObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/prolist.ejs",{product:docs})
  }
})
}
else if(a1=="查询"){
  var reg = new RegExp(a2);
  var _filter = {
  //多字段匹配
      $or: [
          {'pname': {$regex: reg}},
          {'pcategory': {$regex: reg}},
          {'pfirm': {$regex: reg}},
      ]
  }

  proObj.find(_filter, (err, docs) => { 
      if(err) {
          console.log(err)
      }
      
      else{
        console.log(docs)
        res.render(__dirname+"/views/prolist.ejs",{product:docs})
      }

})
}
else next();
});

//删除商品
app.get('/prodelete',(req,res) =>{
  a=req.query.id;
  proObj.findByIdAndDelete({_id:a},(err,doc)=>{if(!err)
    proObj.find({},(err,docs)=>{if(!err)
    res.render(__dirname+"/views/prolist.ejs",{product:docs})
    })
  })
});
//增加商品
app.get('/addpro',(req, res,next) =>{
  a1=req.query.a1; 
  if(a1=="商品列表"){
    proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/prolist.ejs",{product:docs})
    }
  })
}
 else if(a1=="用户列表"){
  logObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
  }
})
}
else if(a1=="首页"){
  res.render(__dirname+"/views/first.ejs")

}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="增加商品"){
  res.render(__dirname+"/views/addpro.ejs")

}
else if(a1=="进货记录"){
  ordObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
  }
})

}
else if(a1=="取消"){
  proObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/prolist.ejs",{product:docs})
  }
})
}
else next();
});
app.get('/addpro',(req, res,next) =>{
  
  pname=req.query.pname;
  pcategory=req.query.pcategory;
  pmeasure=req.query.pmeasure;
  pbprice=req.query.pbprice;
  psprice=req.query.psprice;
  pfirm=req.query.pfirm;
  preserve=req.query.preserve;
  pdate=req.query.pdate;
  pexp=req.query.pexp;
  if(pname.length!=0&&pcategory.length!=0&&pmeasure.length!=0&&pbprice.length!=0&&psprice.length!=0&&pfirm.length!=0&&preserve.length!=0&&pdate.length!=0&&pexp.length!=0)
    next()
  else res.render(__dirname+"/views/addpro.ejs",{message:"请填写完整"})
});
app.get('/addpro',(req, res,next) =>{
  proData=new proObj({pname:pname,pcategory:pcategory,pmeasure:pmeasure,pbprice:pbprice,psprice:psprice,pfirm:pfirm,preserve:preserve,pdate:pdate,pexp:pexp});
    proObj.find({pname:pname},(err,docs)=>{if(!err){
        if(docs.length!=0)nameInDB=100;
        else nameInDB=0;
        next();
    }})
});
app.get('/addpro',(req, res,next) =>{
   if(a1=="添加"){
    if(nameInDB==0)proData.save((err)=>{
      proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/prolist.ejs",{product:docs})
    }
  })
})
}
else next()
});

//进货单
app.get('/orderlist',(req, res,next) =>{
  a1=req.query.a1;
  a2=req.query.a2;
  if(a1=="商品列表"){
    proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/prolist.ejs",{product:docs})
    }
  })
}
 else if(a1=="用户列表"){
  logObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/userlist.ejs",{userlist:docs})
  }
})
}
else if(a1=="增加商品"){
  res.render(__dirname+"/views/addpro.ejs")

}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="进货记录"){
  ordObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
  }
})

}
else if(a1=="首页"){
  res.render(__dirname+"/views/first.ejs")

}
else if(a1=="查询"){
  var reg = new RegExp(a2);
  var _filter = {
  //多字段匹配
      $or: [
          {'pname': {$regex: reg}},
          {'odate': {$regex: reg}},
          {'pfirm': {$regex: reg}},
      ]
  }

  ordObj.find(_filter, (err, docs) => { 
      if(err) {
          console.log(err)
      }
      
      else{
        console.log(docs)
        res.render(__dirname+"/views/orderlist.ejs",{order:docs})
      }

})
}
else next();
});

//删除商品
app.get('/orderdelete',(req,res) =>{
  a=req.query.id;
  ordObj.findByIdAndDelete({_id:a},(err,doc)=>{if(!err)
    ordObj.find({},(err,docs)=>{if(!err)
    res.render(__dirname+"/views/orderlist.ejs",{order:docs})
    })
  })
});

//普通用户首页
app.get('/nfirst',(req, res,next) =>{
  a1=req.query.a1;
  if(a1=="商品列表"){
    proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/nprolist.ejs",{product:docs})
    }
  })
}
else if(a1=="进货记录"){
  ordObj.aggregate([
    {
      $lookup:
        {
          from: "products",
          localField: "pname",
          foreignField: "pname",
          as: "product"
        }
   }, {
    $unwind: { //这个必须写，不知道啥意思，忘了
      path: "$product", //和上面对应
      preserveNullAndEmptyArrays: true //固定的
    }
  }, {
    $group: { //组包
      _id: "$_id",
      pname: {
        $first: "$pname"
      },
      onumber: {
        $first: "$onumber"
      },
      pfirm: {
        $first: "$pfirm"
      },
      odate: {
        $first: "$odate"
      },
      product: {
        $first: "$product"
      }
    }
  }],(err, data) =>{if(!err){
    console.log(data)
    res.render(__dirname+"/views/norderlist.ejs",{order:data})}
  })

}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="首页"){
  res.render(__dirname+"/views/nfirst.ejs")

}
else next();
});
//普通用户进货单
app.get('/norderlist',(req, res,next) =>{
  a1=req.query.a1;
  a2=req.query.a2;
  if(a1=="商品列表"){
    proObj.find({},(err,docs)=>{if(!err){
      res.render(__dirname+"/views/nprolist.ejs",{product:docs})
    }
  })
}
else if(a1=="进货记录"){
  ordObj.aggregate([
    {
      $lookup:
        {
          from: "products",
          localField: "pname",
          foreignField: "pname",
          as: "product"
        }
   }, {
    $unwind: { //这个必须写，不知道啥意思，忘了
      path: "$product", //和上面对应
      preserveNullAndEmptyArrays: true //固定的
    }
  }, {
    $group: { //组包
      _id: "$_id",
      pname: {
        $first: "$pname"
      },
      onumber: {
        $first: "$onumber"
      },
      pfirm: {
        $first: "$pfirm"
      },
      odate: {
        $first: "$odate"
      },
      product: {
        $first: "$product"
      }
    }
  }],(err, data) =>{if(!err){
    console.log(data)
    res.render(__dirname+"/views/norderlist.ejs",{order:data})}
  })

}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="首页"){
  res.render(__dirname+"/views/nfirst.ejs")

}
else if(a1=="查询"){
  var reg = new RegExp(a2);
  var _filter = {
  //多字段匹配
      $or: [
          {'pname': {$regex: reg}},
          {'odate': {$regex: reg}},
          {'pfirm': {$regex: reg}},
      ]
  }

  ordObj.find(_filter, (err, docs) => { 
      if(err) {
          console.log(err)
      }
      
      else{
        console.log(docs)
        res.render(__dirname+"/views/norderlist.ejs",{order:docs})
      }

})
}
else next();
});
//普通用户商品列表
app.get('/nprolist',(req, res,next) =>{
  a1=req.query.a1;
  a2=req.query.a2;
if(a1=="首页"){
    res.render(__dirname+"/views/nfirst.ejs")

}
else if(a1=="进货记录"){
  ordObj.aggregate([
    {
      $lookup:
        {
          from: "products",
          localField: "pname",
          foreignField: "pname",
          as: "product"
        }
   }, {
    $unwind: { //这个必须写，不知道啥意思，忘了
      path: "$product", //和上面对应
      preserveNullAndEmptyArrays: true //固定的
    }
  }, {
    $group: { //组包
      _id: "$_id",
      pname: {
        $first: "$pname"
      },
      onumber: {
        $first: "$onumber"
      },
      pfirm: {
        $first: "$pfirm"
      },
      odate: {
        $first: "$odate"
      },
      product: {
        $first: "$product"
      }
    }
  }],(err, data) =>{if(!err){
    console.log(data)
    res.render(__dirname+"/views/norderlist.ejs",{order:data})}
  })
}
else if(a1=="注销"){
  res.render(__dirname+"/views/demo.ejs",{message:''})
}
else if(a1=="商品列表"){
  proObj.find({},(err,docs)=>{if(!err){
    res.render(__dirname+"/views/nprolist.ejs",{product:docs})
  }
})
}
else if(a1=="查询"){
  var reg = new RegExp(a2);
  var _filter = {
  //多字段匹配
      $or: [
          {'pname': {$regex: reg}},
          {'pcategory': {$regex: reg}},
          {'pfirm': {$regex: reg}},
      ]
  }

  proObj.find(_filter, (err, docs) => { 
      if(err) {
          console.log(err)
      }
      
      else{
        console.log(docs)
        res.render(__dirname+"/views/nprolist.ejs",{product:docs})
      }

})
}
else next();
});

app.listen(3000)