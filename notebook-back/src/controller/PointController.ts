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
            relations: ["bits", "line"]
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

}