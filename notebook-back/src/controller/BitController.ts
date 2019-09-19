import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Bit} from "../entity/Bit";
import {Plane} from "../entity/Plane";
import {Line} from "../entity/Line";

export class BitController {

    private repository = getRepository(Bit);
    private repositoryPlane = getRepository(Plane);
    private repositoryLine = getRepository(Line);

    async filter(request: Request, response: Response, next: NextFunction) {
        let _opts = request.query;
        let _skip = _opts.pageSize * (_opts.pageNum - 1) || 0;
        let _take = parseInt(_opts.pageSize) || 10;
        let _where = await this.getSql(_opts);
        let rs = this.repository
            .createQueryBuilder('bit')
            .leftJoinAndSelect("bit.point", "point")
            .where(_where)
            .orderBy(`bit.${_opts.sortField}`, _opts.sortType)
            .skip(_skip)
            .take(_take)
            .setParameters({
                keyword: '%'+_opts.keyword+'%'
            })
            .getMany();
        return rs;
    };

    async getSql (opts) {
        let sql = '';
        let filterAttr = this.filterAttr(opts)
        sql = filterAttr ? `(${filterAttr})` : 'bit.attr = 0';
        let filterKeyword = this.filterKeyword(opts);
        sql += filterKeyword ? ` AND (${filterKeyword})` : '';
        let filterCats = await this.filterCats(opts);
        sql += filterCats ? ` AND (${filterCats})` : '';
        return sql;
    };

    filterKeyword (opts) {
        let sql = '';
        if (opts.keywordFields) {
            opts.keywordFields.split(',').map(x => {
                sql += ` OR bit.${x} LIKE :keyword`
            });
            sql = sql.substr(4);
        }
        return sql;
    };

    filterAttr (opts) {
        let sql = '';
        if (opts.attrs) {
            opts.attrs.split(',').map(x => {
                sql += ` OR bit.attr = ${x}`
            });
            sql = sql.substr(4);
        }
        return sql;
    };

    async filterCats (opts) {
        let sql = '';
        let cats = { planes: [], lines: [], points: [] };
        if (opts.cats) {
            cats = JSON.parse(opts.cats);
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
        _points = _points.concat(cats.points).sort();
        if (_points) {
            _points.map(x => {
                sql += ` OR bit.point = ${x}`
            });
            sql = sql.substr(4);
        }
        return sql;
    };

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, { 
            relations: ["point"]
        });
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.repository.save(request.body);
    }

    async del(request: Request, response: Response, next: NextFunction) {
        let ids = request.params.ids.split(',');
        await ids.map(async x => {
            let removeItem = await this.repository.findOne(x);
            await this.repository.remove(removeItem);
        });
        return 'ok';
    }

}