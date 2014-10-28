/**
 * Created by licanming on 14-9-4.
 */
var express = require("express");
var jade = require('jade');
var lessMiddleware = require('less-middleware');
var fs = require('fs');

var app = module.exports = express();
app.all('*', function(req, res, next) {
    res.header("host","www.licanbluesea.com")
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);
    else  next();
});
app.use( lessMiddleware(__dirname +'/',{
    "force":true
}));
app.use(express.static(__dirname + '/public'));
app.use("/assets",express.static(__dirname + '/assets'));
app.get('/', function(req, res){
    res.end(output("index"));
});
app.get('/list', function(req, res){
    res.end(output("new_list"));
});

app.get('/news', function(req, res){
    res.end(output("news"));
});
app.get('/migration/*',function(req,res){
    var _fun = req.query.callback
    res.end(_fun+"("+JSON.stringify(routers(req.params[0]))+")");
});
app.listen(3000,function(){
    console.log("sever at :3000")
});
function output($fs){
    var _html = jade.renderFile('./'+$fs+'.jade');
    fs.writeFile('./'+$fs+'.html',_html,function(err){
        console.log('It\'s saved!');
    });
    return _html;
}
function routers($params){
    var _url = $params.replace("\/","");
    switch(_url){
        case 'acclist':
            var _obj = {"status":1,"tips":{account:["user1", "user2", "user3"]}}
            return _obj;
            break;
        case 'thirdparty':
            var _obj = {"status":1,"tips":{"thirdparty":0}};
            return _obj;
            break;
        case 'reg':
            var _obj = {"status":1,"tips":"賬號創建成功！"};
            return _obj;
            break;
    }
};
//var log_list = [{"title":"多玩魔兽数据库9月12日更新了5.4新增的武器和装备","time":"2014 10.01","url":"http:jx3.xoyo.com"},{"title":"多玩魔兽数据库9月12日更新了5.4新增的武器和装备","time":"2014 10.01","url":"http:jx3.xoyo.com"},{"title":"多玩魔兽数据库9月12日更新了5.4新增的武器和装备","time":"2014 10.01","url":"http:jx3.xoyo.com"},{"title":"多玩魔兽数据库9月12日更新了5.4新增的武器和装备","time":"2014 10.01","url":"http:jx3.xoyo.com"}];

