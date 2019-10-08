/*
# 从数据库notebook 把日志相关的6张数据表的数据 组合一起 转移到一张excel表中
- 需要把 LogTopic.xls 复制到/log里
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
let sheetName=null, fields=null;
handle();

async function handle () {
    let diary = await queryData('db_diary', 'Diary'); // 日志
    let plan = await queryData('db_plan', 'Plan'); // 计划
    let note1 = await queryData('db_note', 'Note1'); // 随笔
    let note2 = await queryData('db_read_note', 'Note2'); // 读书笔记
    let note3 = await queryData('db_writing_material', 'Note3'); // 写作素材
    let note4 = await queryData('db_writing_practice', 'Note4'); // 写作练习
    let rs = [].concat(diary, plan, note1, note2, note3, note4);
    let last = [
        {
            name: 'sheet1',
            data: rs
        }
    ];
    // 存入excel
    var buffer = xlsx.build(last);
    let _path = '../_sheets/log';
    fs.exists(_path, async (exist) => {
        if (!exist) {
            await fs.mkdir(_path);
        }
        fs.writeFile(_path+'/LogArticle.xls', buffer, function (err){
            if (err) { throw err; }
            else { console.log(`LogArticle is ok`); }
        });
    })
}
    
/* ----------------------------------------- */

function queryData(_db, _sheetName) {
    return new Promise(resolve => {
        var sql = 'SELECT * FROM ' + _db;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            if (result.length > 0) {
                sheetName = _sheetName;
                let rs = _dataHandle(result);
                resolve(rs);
            }
        });
    });
}

// 把数据组装成存excel的结构
function _dataHandle (_data) {
    let rs = [];
    if (!fields) { // 获取第一行的字段
        rs[0] = [];
        for (let key in _data[0]) {
            if (key !== 'ttl' && key !== 'keyword') {
                rs[0].push(key);
            }
        }
        /* ----------------<------ */
        rs[0].push('ttl');
        rs[0].push('keyword');
        rs[0].push('class');
        rs[0].push('topic_id');
        /* ----------------->----- */
        fields = rs[0];
    }
    
    let ttlCache = '', keywordCache = '';
    _data.map(x => {
        let arr = [];
        for (let key in x) {
            if (key === 'ttl') {
                ttlCache = x[key];
            } else if (key === 'keyword') {
                keywordCache = x[key];
            } else {
                arr.push(x[key]);
            }
        }
        /* -------------<---- */
        arr.push(ttlCache);
        arr.push(keywordCache);
        let classVal = null;
        if (sheetName === 'Note1') { classVal = 0; }
        if (sheetName === 'Note2') { classVal = 1; }
        if (sheetName === 'Note3') { classVal = 2; }
        if (sheetName === 'Note4') { classVal = 3; }
        arr.push(classVal);
        let topicIdVal = 0;
        if (sheetName === 'Diary') { topicIdVal = 1; }
        else if (sheetName === 'Plan') { topicIdVal = 3; }
        else { topicIdVal = 4; }
        arr.push(topicIdVal);
        /* ------------>----- */
        rs.push(arr);
    });
    return rs;
}

