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
import xlsx from 'node-xlsx';
var moment = require('moment');

import {Plane} from "../entity/Plane";
import {Line} from "../entity/Line";
import {Point} from "../entity/Point";


/* -------------------------------------- */

 // excel表的存放地址
let _path = 'D:/_phpStudy/WWW/_project/_my/newbook/_material/_sheets/';

let plane_oldIds = [], line_oldIds = [];

// plane 字典
let dictionary_plane = [
    { new: 'id', old: 'id', index: null},
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'createdAt', old: 'input_time', index: null },
    { new: 'updatedAt', old: 'update_time', index: null },
    { new: 'solid', old: null, def: 1, index: null }
];

// line 字典
let dictionary_line = [
    { new: 'id', old: 'id', index: null},
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'description', old: 'description', index: null },
    { new: 'extend', old: 'content', index: null },
    { new: 'createdAt', old: 'input_time', index: null },
    { new: 'updatedAt', old: 'update_time', index: null },
    { new: 'plane', old: 'topic_id', index: null }
];

// point 字典
let dictionary_point = [
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'attr', old: null, def: 0, index: null },
    { new: 'description', old: 'description', index: null },
    { new: 'extend', old: 'content', index: null },
    { new: 'config', old: null, def: '', index: null },
    { new: 'createdAt', old: 'input_time', index: null },
    { new: 'updatedAt', old: 'update_time', index: null },
    { new: 'line', old: 'topic_id', index: null }
];

/* -------------------------------------- */


export class TransController {

    async trans() {

        await this.trans_plane();
        await this.trans_line();
        this.trans_point();
        
        return `ok - trans`;
    }

    // 把excel表的数据 对照上面的字典 组装数据结构
    transFun (type) {
        let dictionary = [];
        let _xls = '';
        switch (type) {
        case 'plane':
            dictionary = dictionary_plane;
            _xls = 'Plane';
            break;
        case 'line':
            dictionary = dictionary_line;
            _xls = 'Line';
            break;
        case 'point':
            dictionary = dictionary_point;
            _xls = 'Point';
            break;
        }

        var xlsxData = xlsx.parse(_path + _xls + '.xls');
        var data = xlsxData[0].data;

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
                    if (type === 'plane') {
                        plane_oldIds.push(data[i][x.index]);
                    }
                    if (type === 'line') {
                        line_oldIds.push(data[i][x.index]);
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

    // plane 保存到库
    async trans_plane () {
        return new Promise(resolve => {
            let rs_plane = this.transFun('plane');
            let repository = getRepository(Plane);
            function insert (i) {
                if (i >= rs_plane.length - 1) {
                    resolve();
                    return;
                }
                repository.save(rs_plane[i]);
                i ++;
                setTimeout(() => { // 为了按先后顺序保存(一起保存顺序会乱)
                    console.log('------plane-----', rs_plane[i].title);
                    insert(i);
                }, 200);
            }
            insert(0);
        });
    }

    // line 处理关联字段后 保存到库
    async trans_line () {
        return new Promise(resolve => {
            let rs_line = this.transFun('line');
            
            rs_line.map(x => {
                let index = plane_oldIds.findIndex(y => y === x.plane);
                if (index > -1) {
                    x.plane = index + 1;
                }
            });

            let repository = getRepository(Line);
            function insert (i) {
                if (i >= rs_line.length - 1) {
                    resolve();
                    return;
                }
                repository.save(rs_line[i]);
                i ++;
                setTimeout(() => { // 为了按先后顺序保存(一起保存顺序会乱)
                    console.log('------line-----', rs_line[i].title);
                    insert(i);
                }, 200);
            }
            insert(0);
        });
    }

    // point 处理关联字段后 保存到库
    async trans_point () {
        let rs_point = this.transFun('point');
        
        rs_point.map((x, i) => {
            let index = line_oldIds.findIndex(y => y === x.line);
            if (index > -1) {
                x.line = index + 1;
            } else {
                // 没有对应lineId的赋值最新的lineId
                console.log('-----------', i, x.title);
                x.line = 172;
            }
        });
        let repository = getRepository(Point);
        await Promise.all(rs_point.map(async x => {
            await repository.save(x);
        }));
    }
    

}