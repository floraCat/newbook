import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
var moment = require('moment');
import {Point} from "../entity/Point";
import {Bit} from "../entity/Bit";

export class PointController {

    private repository = getRepository(Point);
    private repositoryBit = getRepository(Bit);

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, { 
            relations: ["line"]
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
        rs = Object.assign({ extend: ''}, request.body);
        return this.repository.save(rs);
    }

    async del(request: Request, response: Response, next: NextFunction) {
        let ids = request.params.ids.split(',');
        await ids.map(async x => {
            // 删除下级条目
            let subItems = await this.repositoryBit
                .createQueryBuilder('_filter')
                .where('_filter.point = :point')
                .setParameters({
                    point: x
                })
                .getMany();
            await subItems.map(async y => {
                let removeSubItem = await this.repositoryBit.findOne(y.id);
                await this.repositoryBit.remove(removeSubItem);
            });
            // 删除当前条目
            setTimeout(async () => { // 不加定时会报因外键而不能删除
                let removeItem = await this.repository.findOne(x);
                await this.repository.remove(removeItem);
            }, 0);
        });
        return 'ok';
    }

    async list(request: Request, response: Response, next: NextFunction) {
        let _where = '';
        if (request.query.line !== undefined) {
            _where = `_filter.line = ${request.query.line}`;
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
            _where = `_filter.line = ${query.line} AND _filter.sort <= ${query.sort}`;
        }
        if (query.sortPos === 'last') {
            _where = `_filter.line = ${query.line} AND _filter.sort >= ${query.sort}`;
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