/*
# 从数据库notebook 把3张表的数据 转移到excel表中
*/

var xlsx = require('node-xlsx');
var fs = require('fs');


// 链接数据库
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'notebook'
});
 
connection.connect();


/* ----------------------------------------- */

queryData('db_plane', 'Plane'),
queryData('db_topic', 'Line'),
queryData('db_material', 'Point')

/* ----------------------------------------- */


function queryData(_db, _sheetName) {
    var sql = 'SELECT * FROM ' + _db;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        if (result.length > 0) {
            // 把数据组装成存excel的结构
            let rs = [];
            rs[0] = [];
            for (let key in result[0]) {
                rs[0].push(key);
            }
            result.map(x => {
                let arr = [];
                for (let key in x) {
                    arr.push(x[key]);
                }
                rs.push(arr);
            });
            let last = [
                {
                    name: 'sheet1',
                    data: rs
                }
            ];
            // 存入excel
            var buffer = xlsx.build(last);
            fs.writeFile('../_sheets/'+_sheetName+'.xls', buffer, function (err){
                if (err) { throw err; }
            });
        }
    });
}


