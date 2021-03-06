/*
# 从数据库notebook 把表达相关的6张数据表的数据 组合一起 转移到excel表中
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

queryData('db_word', 'Word1'), // 成语
queryData('db_training', 'Word2'), // 用辞
queryData('db_matter', 'Word3'), // 素材
queryData('db_question', 'Remark1'), // 日省三身
queryData('db_mix', 'Remark2'), // 碎碎念
queryData('db_point', 'Remark3') // 溜点

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
            let _path = '../_sheets/card';
            fs.exists(_path, (exist) => {
                if (!exist) {
                    fs.mkdir(_path, () => {
                        let _path2 = _path + '/express';
                        fs.exists(_path2, (exist2) => {
                            if (!exist2) {
                                fs.mkdir(_path2, () => {
                                    fs.writeFile(_path2+'/'+_sheetName+'.xls', buffer, function (err){
                                        if (err) { throw err; }
                                        else { console.log(`${_sheetName} is ok`); }
                                    });
                                });
                            }
                        });
                    });
                } else {
                    let _path2 = _path + '/express';
                    fs.exists(_path2, (exist2) => {
                        if (!exist2) {
                            fs.mkdir(_path2, () => {
                                fs.writeFile(_path2+'/'+_sheetName+'.xls', buffer, function (err){
                                    if (err) { throw err; }
                                    else { console.log(`${_sheetName} is ok`); }
                                });
                            });
                        } else {
                            fs.writeFile(_path2+'/'+_sheetName+'.xls', buffer, function (err){
                                if (err) { throw err; }
                                else { console.log(`${_sheetName} is ok`); }
                            });
                        }
                    });
                }
            })
        }
    });
}


