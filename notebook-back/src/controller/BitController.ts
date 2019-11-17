import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
var moment = require('moment');
import {Bit} from "../entity/Bit";

export class BitController {

    private repository = getRepository(Bit);

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, { 
            relations: ["point"]
        });
    }

    async edit(request: Request, response: Response, next: NextFunction) {
        let rs = request.body;
        if (rs.id === undefined) {
            rs.createdAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            rs.updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        } else {
            rs.updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        }
        let defaultVals = {
            description: '',
            extend: ''
        };
        rs = Object.assign(defaultVals, request.body);
        return this.repository.save(rs);
    }

    async del(request: Request, response: Response, next: NextFunction) {
        let ids = request.params.ids.split(',');
        await ids.map(async x => {
            let removeItem = await this.repository.findOne(x);
            await this.repository.remove(removeItem);
        });
        return 'ok';
    }

    async list(request: Request, response: Response, next: NextFunction) {
        let _where = '';
        if (request.query.point !== undefined) {
            _where = `_filter.point = ${request.query.point}`;
        }
        if (request.query.recom !== undefined) {
            _where = `_filter.recom = ${request.query.recom}`;
        }
        return this.repository
            .createQueryBuilder('_filter')
            .where(_where)
            .orderBy('_filter.sort', 'ASC')
            .skip(0)
            .take(30)
            .getMany();
    }

    // 排序
    async sort(request: Request, response: Response, next: NextFunction) {
        let query = request.body;
        let _where = '';
        if (query.sortPos === 'first') {
            _where = `_filter.point = ${query.point.id} AND _filter.sort <= ${query.sort}`;
        }
        if (query.sortPos === 'last') {
            _where = `_filter.point = ${query.point.id} AND _filter.sort >= ${query.sort}`;
        }
        let list = await this.repository
            .createQueryBuilder('_filter')
            .where(_where)
            .orderBy('_filter.sort', 'ASC')
            .getMany();
        let _index;
        // 前置
        if (query.sortPos === 'first') {
            let first = list.find(x => x.id === query.id);
            first.sort = 1;
            await this.repository.save(first);
            _index = 2;
        }
        // 后置
        if (query.sortPos === 'last') {
            let last = list.find(x => x.id === query.id);
            last.sort = query.sort + list.length - 1;
            await this.repository.save(last);
            _index = query.sort;
        }
        let rest = list.filter(x => x.id !== query.id);
        for (let i = 0; i < rest.length; i ++) {
            rest[i].sort = _index;
            await this.repository.save(rest[i]);
            _index ++;
        }
        return {
            code: 0,
            data: query.id,
            message: 'success'
        };
    }

}