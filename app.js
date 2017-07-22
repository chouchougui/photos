var express = require("express");
var app = express();
var router = require("./controller");
app.listen(4000);
//若要一个文件夹可以被直接用地址访问到
//使用express.static()
app.use(express.static("./public"));
app.use(express.static("./upload"));
app.set("view engine","ejs");
app.get("/",router.showIndex);
//添加处理/:dirName
app.get("/:dirName",router.showPhotos);
//进入上传图片页面
app.get("/up",router.showUpPage);
//处理上传图片功能
app.post("/upMul",router.doMul);
//必须写在最后
app.use(function(req,res){
    res.render("err");
});