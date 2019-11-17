import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
var moment = require('moment');
import {LogArticle} from "../entity/LogArticle";

export class LogArticleController {

    private repository = getRepository(LogArticle);

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, { 
            relations: ["topic"]
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
        let query = request.query;
        let pageSize = query.pageSize || 10;
        let pageNum = query.pageNum || 1;
        let start = (pageNum - 1) * pageSize;
        let end = start + pageSize;
        let entity = await this.repository.createQueryBuilder('_filter');
        let _where = '';
        if (request.query.topic !== undefined) {
            _where = `_filter.topic = ${request.query.topic}`;
        }
        if (request.query.recom !== undefined) {
            _where = `_filter.recom = ${request.query.recom}`;
        }
        let all = await entity
            .leftJoinAndSelect('_filter.topic', 'topic')
            .where(_where)
            .orderBy('_filter.createdAt', 'DESC')
            .getMany();
        let list = all.slice(start, end);
        return {
            list: list,
            total: all.length
        };
    }

}