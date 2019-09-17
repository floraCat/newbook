/*
    数据转移：
    - 旧mysql数据 通过typeOrm 存入新的mysql
    - 解决 自增id 与 关联字段 等相关问题
    - 两个方法： trans & pid
*/

import xlsx from 'node-xlsx';
var moment = require('moment');
import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";

import {Plane} from "../entity/Plane";
import {Line} from "../entity/Line";
import {Point} from "../entity/Point";




/* -------------------------------------- */

let _xls, _entity;

// trans传参三种情况：

_entity = Plane, _xls = 'Plane';
// _entity = Line, _xls = 'Line';
// _entity = Point, _xls = 'Point';

/* -------------------------------------- */


export class TransController {

    private repository = getRepository(_entity);


    /*
    
    * 把excel数据导入mysql
    - excel最前面新增一排作为id，值都为0
    - excel顺序按 entity 的字段
        - Line里有一个planeId超出已有的
        - 部分新字段没有的用extend装载
    
    */

    async trans(request: Request, response: Response, next: NextFunction) {
        
        let keys = Object.keys(this.repository.metadata.propertiesMap);
        
        var data = xlsx.parse('D:/_phpStudy/WWW/__test/testExcel/_xls/'+_xls+'.xls');
        var data1 = data[0].data;
        let rs = [];
        var len = data1.length;
        for (let i = 1; i < len; i ++) {
            var $obj = {};
            for (let j = 0; j < keys.length; j ++) {
                if (keys[j] === 'createdAt' || keys[j] === 'updatedAt') {
                    $obj[keys[j]] = moment(new Date(1900, 0, data1[i][j] - 1)).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    $obj[keys[j]] = data1[i][j];
                }
            }
            rs.push($obj);
        }
        console.log(4444, rs);
        
        rs.map(x => {
            this.repository.save(x);
        });
        return `ok - ${_entity}`;
    }


    
    /*
    
    * 关联字段对应上自增id
    - 先增加字段 sid
    - 关联字段lineId 先用常规 @Column
    - lineId 与 Line的sid 相同时， 赋值 Line的id值
    - 最后把字段 sid 删掉， lineId用回 @ManyToOne 关联
    
    */


    // Line里的planeId = Plane里的id
    async pid1(request: Request, response: Response, next: NextFunction) {

        let repositoryPlane = await getRepository(Plane);
        let repositoryLine = await getRepository(Line);

        let planes = await repositoryPlane.find();
        let lines = await repositoryLine.find();
        for (let i = 0; i < planes.length; i ++) {
            for (let j = 0; j < lines.length; j ++) {
                if (lines[j].planeId === planes[i].sid) {
                    console.log(22222, planes[i].id);
                    await repositoryLine.update({id: lines[j].id}, { planeId: planes[i].id});
                }
            }
        }
        return 'end';
    }


    // Point里的lineId = Line里的id
    async pid2(request: Request, response: Response, next: NextFunction) {

        let repositoryLine = await getRepository(Line);
        let repositoryPoint = await getRepository(Point);

        let lines = await repositoryLine.find();
        let points = await repositoryPoint.find();
        for (let i = 0; i < lines.length; i ++) {
            for (let j = 0; j < points.length; j ++) {
                if (points[j].lineId === lines[i].sid) {
                    console.log(3333, lines[i].id);
                    await repositoryPoint.update({id: points[j].id}, { lineId: lines[i].id});
                }
            }
        }
        return 'end';
    }

}