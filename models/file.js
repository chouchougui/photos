var fs = require("fs");
exports.getDirNames = function(callback){
    //真正读取upload文件夹下的所有文件夹
    fs.readdir("./upload",function(err,files) {
        if(err){
            callback("没有找到该路径下的文件夹",null);
            return;
        }
        //循环遍历文件夹下的所有内容,判断是文件夹还是图片
        var dirNames = [];
        (function iterator(i) {
            if (i == files.length) {
                //res.render("index", {"names": dirNames});
                //console.log("files",dirNames);
                callback(dirNames);
                return;
            }
            fs.stat("./upload/"+files[i],function (err,stats) {
                if(err){
                    callback("该文件不存在"+files[i],null);
                    return;
                }
                //console.log(err);
                if (stats.isDirectory()){
                    //如果当前遍历到的内容是文件夹 则将文件夹放到dirNames中
                    dirNames.push(files[i]);
                }
                iterator(i+1);
            })
        })(0);
    })
};
//暴露根据文件夹名称返回该相册下所有皂片
exports.getAllPhotosByDirName=function(dirName,callback){
    fs.readdir("./upload/"+dirName,function(err,files){
        if(err){
            callback("没有找到该路径下的文件夹",null);
            return;
        }
        //定义一个保存所有照片的数组
        var allps = [];
        //依次判断files是否是文件 是则放入allps中
        (function iterator(i){
            if (i==files.length){
                //全都读取完成 使用调用者定义的方法 并将此时的所有图片返回调用者
                callback(null,allps);
                return;
            }
            fs.stat("./upload/"+dirName+"/"+files[i],function(err,stats){
                if (stats.isFile()){
                    allps.push(files[i]);
                }
                iterator(i+1);
            });
        })(0);
    })
};