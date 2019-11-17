import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
var moment = require('moment');
import {LogTopic} from "../entity/LogTopic";

export class LogTopicController {

    private repository = getRepository(LogTopic);

    async list(request: Request, response: Response, next: NextFunction) {
        return this.repository
            .createQueryBuilder('_filter')
            .leftJoinAndSelect('_filter.articles', 'articles')
            .getMany();
    }

}