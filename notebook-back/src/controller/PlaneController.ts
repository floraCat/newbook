import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
var moment = require('moment');
import {Plane} from "../entity/Plane";

export class PlaneController {

    private repository = getRepository(Plane);

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, {
            relations: ["lines"]
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
        let _where = request.query.solid ? '_filter.solid = :solid' : '';
        return this.repository
            .createQueryBuilder('_filter')
            .leftJoinAndSelect('_filter.lines', 'lines')
            .where(_where)
            .orderBy('_filter.sort', 'ASC')
            .setParameters({
                solid: request.query.solid
            })
            .getMany();
    }

}