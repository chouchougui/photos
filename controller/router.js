//引入专门获取数据的对象 file.js
var file = require("../models/file.js");
var formidable = require("formidable");
var path = require("path");
var sd = require("silly-datetime");
var fs = require("fs");
exports.showIndex=function(req,res){
    //res.send("我是router指定的首页");
    //读取upload下的所有文件夹 赋值给dirNames
    /*var dirNames = {"names":file.getDirNames()};
    console.log("router",dirNames);
    res.render("index",dirNames);*/

    //调用回调函数 有值之后填充index
    file.getDirNames(function(names){
        res.render("index",{
            "names":names
        });
    });
};
exports.showPhotos=function(req,res,next){
    //1.获取相册名
    var dirName = req.params.dirName;
    //2.根据相册名称，读取对应路径下的内容
    file.getAllPhotosByDirName(dirName,function(err,photos){
        if (err){
            next();
            return;
        }
        console.log(photos);
        //将数据填充到页面
        res.render("photos",{
            "photos":photos,
            "dirName":dirName
        });
    })
};
//暴露showUpPage:进入上传图片静态页面
exports.showUpPage=function(req,res){
    //res.render("upPage");
    file.getDirNames(function(names){
        res.render("upPage",{
            "names":names
        });
    });
};
//暴露doPost 提交表单信息
exports.doMul=function(req,res){
    //获取表单中的fileds和files
    var form = new formidable.IncomingForm();
    form.multiples=true;//设置为多文件上传
    form.keepExtensions=true;//是否包含文件后缀    
    form.uploadDir="./upload";
    var all = [];
    form.on("file", function (filed,file) {
        all.push([filed,file]);
    })
    //改成接受批量files
    form.parse(req,function(err,fileds,files){
        //console.log("fileds",fileds);
        //console.log("files",files);
        //res.end();
        //将上传的图片放在对应文件夹下，重命名
        //1.获取整个原始文件名
        for(var i=0;i<all.length;i++){
            var fname = all[i][1].name;
            //获取文件后缀名
            var extname = path.extname(fname);
            //2.得到新的文件名
            var time = sd.format(new Date(),"YYMMDDHHmmss");
            var suiji = parseInt(Math.random()*1000+10000);
            var newname = time+suiji+extname;
            //console.log(newname);
            //3.替换成新的文件名
            var newpath = "./upload/"+fileds.dirName+"/"+newname;
            var oldpath = all[i][1].path;
            fs.rename(oldpath,newpath,function(err){
                if (err){
                    res.end("重命名失败");
                }
            });
        }
        //上传成功回到主页
        res.redirect("/");
    });
};
