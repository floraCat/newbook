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

import {Plane} from "../../entity/Plane";
import {Line} from "../../entity/Line";
import {Point} from "../../entity/Point";
import {Bit} from "../../entity/Bit";


/* -------------------------------------- */

// excel表的存放地址
let _pathPre = 'D:/_phpStudy/WWW/_project/_my/newbook/_material/_sheets/';
let _path = '';
let _suf = '';

// plane 字典
let dictionary_plane = [
    { new: 'id', old: 'id', index: null}, // for缓存id已关联下级
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'createdAt', old: 'input_time', index: null },
    { new: 'updatedAt', old: 'update_time', index: null },
    { new: 'solid', old: 'topic_id', index: null }
];

// line 字典
let dictionary_line = [
    { new: 'id', old: 'id', index: null}, // for缓存id已关联下级
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'attr', old: null, def: null, index: null },
    { new: 'description', old: 'description', index: null },
    { new: 'extend', old: null, def: '', index: null },
    { new: 'createdAt', old: null, def: '', index: null },
    { new: 'updatedAt', old: null, def: '', index: null },
    { new: 'plane', old: 'topic_id', index: null }
];

// point 字典
let dictionary_point = [
    { new: 'id', old: 'id', index: null}, // for缓存id已关联下级
    { new: 'sort', old: null, def: 0, index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'attr', old: null, def: null, index: null },
    { new: 'description', old: 'description', index: null },
    { new: 'extend', old: null, def: '', index: null },
    { new: 'subFieldSet', old: null, def: '', index: null },
    { new: 'createdAt', old: null, def: '', index: null },
    { new: 'updatedAt', old: null, def: '', index: null },
    { new: 'line', old: 'topic_id', index: null }
];

// bit 字典
let dictionary_bit = [
    { new: 'sort', old: 'sort', index: null },
    { new: 'title', old: 'ttl', index: null},
    { new: 'subtitle', old: 'subtitle', index: null},
    { new: 'attr', old: 'attr', index: null },
    { new: 'grade', old: 'grade', index: null },
    { new: 'class', old: 'class', index: null },
    { new: 'keyword', old: 'keyword', def: '', index: null },
    { new: 'pic', old: 'pic', def: '', index: null },
    { new: 'audio', old: 'audio', def: '', index: null },
    { new: 'video', old: 'video', def: '', index: null },
    { new: 'description', old: 'description', def: '', index: null },
    { new: 'content', old: 'content', def: '', index: null },
    { new: 'extend', old: null, def: '', index: null },
    { new: 'createdAt', old: 'input_time', index: null },
    { new: 'updatedAt', old: 'update_time', index: null },
    { new: 'point', old: 'topic_id', index: null }
];

/* -------------------------------------- */


export class TransControllerCard {

    async trans(request: Request) {

        // excel表的存放地址
        _path = `${_pathPre}${request.query.suf}`;
        _suf = request.query.suf.slice(0,-1);

        await this.trans_plane();
        await this.trans_line();
        await this.trans_point();
        this.trans_bit();
        
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
        case 'bit':
            dictionary = dictionary_bit;
            _xls = 'Bit';
            break;
        }
        
        var xlsxData = xlsx.parse(_path + _xls + '.xls');
        var data = xlsxData[0].data;
        data = data.filter(x => x[0] !== undefined);

        // 字典字段index对应上excel字段index
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
                            $obj[x.new] = data[i][x.index] || x.def;
                        }
                    }
                }
            });
            rs.push($obj);
            // console.log('---------------', rs.filter((x, i) => i < 2));
        }
        return rs;
    }

    // plane 保存到库
    async trans_plane () {
        return new Promise(resolve => {
            let rs_plane = this.transFun('plane');
            let repository = getRepository(Plane);
            function insert (i) {
                if (i >= rs_plane.length) {
                    resolve();
                    return;
                }
                repository.save(rs_plane[i]);
                console.log('------plane-----', rs_plane[i].title);
                i ++;
                setTimeout(() => { // 为了按先后顺序保存(一起保存顺序会乱)
                    insert(i);
                }, 200);
            }
            insert(0);
        });
    }

    // line 处理关联字段后 保存到库
    async trans_line () {
        return new Promise(async resolve => {
            let rs_line = this.transFun('line');
            
            let repositoryPlane = getRepository(Plane);
            let planes = await repositoryPlane.find();
            rs_line.map((x, i) => {
                let item = planes.find(y => y.pid === `${_suf}_${x.plane}`);
                rs_line[i].plane = item ? item.id : null;
            });

            let repository = getRepository(Line);
            function insert (i) {
                if (i >= rs_line.length) {
                    resolve();
                    return;
                }
                repository.save(rs_line[i]);
                console.log('------line-----', rs_line[i].title);
                i ++;
                setTimeout(() => { // 为了按先后顺序保存(一起保存顺序会乱)
                    insert(i);
                }, 200);
            }
            insert(0);
        });
    }

    // point 处理关联字段后 保存到库
    async trans_point () {
        return new Promise(async resolve => {
            let rs_point = this.transFun('point');
            
            let repositoryLine = getRepository(Line);
            let lines = await repositoryLine.find();
            rs_point.map((x, i) => {
                let item = lines.find(y => y.pid === `${_suf}_${x.line}`);
                rs_point[i].line = item ? item.id : null;
            });
            let repository = getRepository(Point);
            function insert (i) {
                if (i >= rs_point.length) {
                    resolve();
                    return;
                }
                repository.save(rs_point[i]);
                console.log('------point-----', rs_point[i].title);
                i ++;
                setTimeout(() => { // 为了按先后顺序保存(一起保存顺序会乱)
                    insert(i);
                }, 200);
            }
            insert(0);
        });
        // await Promise.all(rs_point.map(async x => {
        //     await repository.save(x);
        // }));
    }

    // bit 处理关联字段后 保存到库
    async trans_bit () {
        let rs_bit = this.transFun('bit');
        
        let repositoryPoint = getRepository(Point);
        let points = await repositoryPoint.find();
        rs_bit.map((x, i) => {
            let item = points.find(y => y.pid === `${_suf}_${x.point}`);
            rs_bit[i].point = item ? item.id : null;
        });
        let repository = getRepository(Bit);
        await Promise.all(rs_bit.map(async x => {
            await repository.save(x);
        }));
    }
    

}