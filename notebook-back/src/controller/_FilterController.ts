import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Bit} from "../entity/Bit";
import {Point} from "../entity/Point";
import {Plane} from "../entity/Plane";
import {Line} from "../entity/Line";
import { LogArticle } from "../entity/LogArticle";

export class _FilterController {

    private repositoryBit = getRepository(Bit);
    private repositoryPoint = getRepository(Point);
    private repositoryLine = getRepository(Line);
    private repositoryPlane = getRepository(Plane);

    private repositoryLogArticle= getRepository(LogArticle);

    async filter(request: Request, response: Response, next: NextFunction) {

        let _opts = request.query;
        let _skip = _opts.pageSize * (_opts.pageNum - 1) || 0;
        let _take = parseInt(_opts.pageSize) || 10;
        let _orderField = _opts.sortField || 'sort';
        let _where = await this.getSql(_opts);

        let list = null;
        if (_opts.dimension === 'bit') {
            list = await this.repositoryBit
                .createQueryBuilder('_filter')
                .leftJoinAndSelect('_filter.point', 'point')
                .where(_where)
                .setParameters({
                    keyword: '%'+_opts.keyword+'%'
                });
        } else if (_opts.dimension === 'point') {
            list = await this.repositoryPoint
                .createQueryBuilder('_filter')
                .leftJoinAndSelect('_filter.line', 'line')
                .leftJoinAndSelect('_filter.bits', 'bits')
                .where(_where)
                .setParameters({
                    keyword: '%'+_opts.keyword+'%'
                });
        } else { // 日志
            list = await this.repositoryLogArticle
                .createQueryBuilder('_filter')
                .where(_where)
                .setParameters({
                    keyword: '%'+_opts.keyword+'%'
                });
        }

        let list3 = await list.getMany();
        let list2 = await list
            .orderBy(`_filter.${_orderField}`, _opts.sortType)
            .skip(_skip)
            .take(_take)
            .getMany();
        let rs = {
            list: list2,
            total: list3.length
        }
        return rs;
    };

    // 获取完成sql语句
    async getSql (opts) {
        let sql = '';

        let filterAttr = this.filterAttr(opts)
        sql += filterAttr ? `(${filterAttr})` : '';

        let filterKeyword = this.filterKeyword(opts);
        sql += filterKeyword && opts.keyword ? ` AND (${filterKeyword})` : '';
        
        let filterCats = await this.filterCats(opts);
        sql += filterCats ? ` AND (${filterCats})` : '';
        
        let filterUpdatedAt = await this.filterUpdatedAt(opts);
        sql += filterUpdatedAt ? ` AND (${filterUpdatedAt})` : '';
        
        let filterCreatedAt = await this.filterCreatedAt(opts);
        sql += filterCreatedAt ? ` AND (${filterCreatedAt})` : '';

        if (sql.trim().substr(0, 3) === 'AND') {
            sql = sql.trim().slice(3);
        }
        console.log('-----sql-----', sql);
        return sql;
    };

    // sql语句 - 属性
    filterAttr (opts) {
        let sql = '';
        if (opts.attrs) {
            opts.attrs.split(',').map(x => {
                if (x === 'NULL') {
                    sql += ` OR _filter.attr is NULL` 
                } else {
                    sql += ` OR _filter.attr = ${x}`
                }
            });
            sql = sql.substr(4);
        }
        return sql;
    };

    // sql语句 - 关键字
    filterKeyword (opts) {
        let sql = '';
        if (opts.keywordFields) {
            opts.keywordFields.split(',').map(x => {
                sql += ` OR _filter.${x} LIKE :keyword`
            });
            sql = sql.substr(4);
        }
        return sql;
    };

    // sql语句 - 分类
    async filterCats (opts) {
        let sql = '';
        let cats = { isNull: false, planes: [], lines: [], points: [] };
        if (opts.cats) {
            cats = JSON.parse(opts.cats);
        } else {
            if (opts.solid) {
                let _where = `_plane.solid = ${opts.solid}`;
                let planes = await this.repositoryPlane
                    .createQueryBuilder('_plane')
                    .where(_where)
                    .getMany();
                cats.planes = await planes.map(x => x.id);
            }
        }
        let _lines = [];
        if (cats.planes.length > 0) {
            await Promise.all(cats.planes.map(async x => {
                let rs = await this.repositoryPlane.findOne(x, { relations: ["lines"] });
                rs.lines.map(y => {
                    _lines.push(y.id);
                });
            }));
        }
        _lines = _lines.concat(cats.lines).sort();
        let _points = [];
        if (_lines.length > 0) {
            await Promise.all(_lines.map(async x => {
                let rs = await this.repositoryLine.findOne(x, { relations: ["points"] });
                rs.points.map(y => {
                    _points.push(y.id);
                });
            }));
        }
        if (opts.dimension === 'point') {
            if (cats.isNull) {
                sql += ` OR _filter.line is NULL`
            }
            _lines.map(x => {
                sql += ` OR _filter.line = ${x}`
            });
            sql = sql.substr(4);
        }
        if (opts.dimension === 'bit') {
            _points = _points.concat(cats.points).sort();
            if (_points) {
                if (cats.isNull) {
                    sql += ` OR _filter.point is NULL`
                }
                _points.map(x => {
                    sql += ` OR _filter.point = ${x}`
                });
                sql = sql.substr(4);
            }
        }
        return sql;
    };

    // sql语句 - 更新时间
    filterUpdatedAt (opts) {
        let sql = '';
        if (opts.updatedAt) {
            let times = opts.updatedAt.split(',');
            sql = `_filter.updatedAt BETWEEN '${times[0]}' AND '${times[1]}'`;
        }
        return sql;
    };

    // sql语句 - 创建时间
    filterCreatedAt (opts) {
        let sql = '';
        if (opts.createdAt) {
            let times = opts.createdAt.split(',');
            sql = `_filter.createdAt BETWEEN '${times[0]}' AND '${times[1]}'`;
        }
        return sql;
    };

}