/*
    数据转移：
    - 旧mysql数据 通过typeOrm 存入新的mysql
    - 解决 自增id 与 关联字段 等相关问题
    - 访问 http://localhost:3001/trans 即能调用trans方法完成数据转移
    - 转移数据涵盖 plane/line/point 数据表
    - 执行前需要先把旧数据转到对应Plane/Line/Point的excel表中（对应外部文件toXls.js）

    * 目前还存在的问题： line里有没有对应Plane的planeId，会报错
*/

import {getRepository} from "typeorm";
import {Request} from "express";
import xlsx from 'node-xlsx';
var moment = require('moment');

import {LogTopic} from "../../entity/LogTopic";
import {LogArticle} from "../../entity/LogArticle";


/* -------------------------------------- */

// excel表的存放地址
let _pathPre = 'D:/_phpStudy/WWW/_project/_my/newbook/_material/_sheets/';
let _path = '';
let _suf = '';

// topic 字典
let dictionary_topic = [
    { new: 'id', old: 'id', index: null}, // for缓存id已关联下级
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'createdAt', old: 'input_time', index: null },
    { new: 'updatedAt', old: 'update_time', index: null }
];

// article 字典
let dictionary_article = [
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'class', old: 'class', index: null },
    { new: 'keyword', old: 'keyword', index: null },
    { new: 'content', old: 'content', index: null },
    { new: 'createdAt', old: 'input_time', index: null },
    { new: 'updatedAt', old: 'update_time', index: null },
    { new: 'topic', old: 'topic_id', index: null }
];

/* -------------------------------------- */


export class TransControllerLog {

    async trans(request: Request) {

        // excel表的存放地址
        _path = `${_pathPre}${request.query.suf}`;
        _suf = request.query.suf.slice(0,-1);

        await this.trans_topic();
        this.trans_article();
        
        return `ok - trans`;
    }

    // 把excel表的数据 对照上面的字典 组装数据结构
    transFun (type) {
        let dictionary = [];
        let _xls = '';
        switch (type) {
        case 'topic':
            dictionary = dictionary_topic;
            _xls = 'LogTopic';
            break;
        case 'article':
            dictionary = dictionary_article;
            _xls = 'LogArticle';
            break;
        }
        
        var xlsxData = xlsx.parse(_path + _xls + '.xls');
        var data = xlsxData[0].data;
        data = data.filter(x => x[0] !== undefined);

        var fields = data[0];
        fields.map((x, i) => {
            let _index = dictionary.findIndex(y => y.old === x);
            if (_index > -1) {
                dictionary[_index].index = i;
            }
        });

        let rs = [];
        var len = data.length;
        for (let i = 1; i < len; i ++) {
            var $obj = {};
            dictionary.map(x => {
                if (x.new === 'id') {
                    if (type !== 'bit') {
                        $obj['pid'] = `${_suf}_${data[i][x.index]}`;
                    }
                } else {
                    if (!x.old) {
                        $obj[x.new] = x.def;
                    } else if (x.index !== null) {
                        if (x.new === 'createdAt' || x.new === 'updatedAt') {
                            $obj[x.new] = moment(new Date(1900, 0, data[i][x.index] - 1)).format("YYYY-MM-DD HH:mm:ss");
                        } else {
                            $obj[x.new] = data[i][x.index];
                        }
                    }
                }
            });
            rs.push($obj);
        }
        return rs;
    }

    // topic 保存到库
    async trans_topic () {
        return new Promise(resolve => {
            let rs_topic = this.transFun('topic');
            let repository = getRepository(LogTopic);
            function insert (i) {
                if (i >= rs_topic.length) {
                    resolve();
                    return;
                }
                repository.save(rs_topic[i]);
                console.log('------topic-----', rs_topic[i].title);
                i ++;
                setTimeout(() => { // 为了按先后顺序保存(一起保存顺序会乱)
                    insert(i);
                }, 200);
            }
            insert(0);
        });
    }

    // article 处理关联字段后 保存到库
    async trans_article () {
        let rs_article = this.transFun('article');
        
        let repositoryTopic = getRepository(LogTopic);
        let topics = await repositoryTopic.find();
        rs_article.map((x, i) => {
            let item = topics.find(y => y.pid === `${_suf}_${x.topic}`);
            rs_article[i].topic = item ? item.id : null;
        });
        let repository = getRepository(LogArticle);
        await Promise.all(rs_article.map(async x => {
            await repository.save(x);
        }));
    }
    

}