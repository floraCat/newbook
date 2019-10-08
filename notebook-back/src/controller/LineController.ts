import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
var moment = require('moment');
import {Line} from "../entity/Line";

export class LineController {

    private repository = getRepository(Line);

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, {
            relations: ["plane", "points"]
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
            let removeItem = await this.repository.findOne(x);
            await this.repository.remove(removeItem);
        });
        return 'ok';
    }

}