var path = require('path');
var express = require('express');
var app = express();

app.set('port',2019);

// url传path本地打开文件夹
app.get('/local-source', function(req, res) {
    let _path = req.query.path;
    console.log('-----_path-----', _path);
    if (_path) {
        var { execute } = require('./exec.js');
        execute(_path);
    }
 });
// 示例：localhost:2019/local-source?path=D:\_phpStudy\WWW\_demo

app.use(express.static(path.join(__dirname,'./')));
app.listen(app.get('port'));
console.log('2019 ok');