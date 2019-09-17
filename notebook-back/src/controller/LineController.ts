import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Line} from "../entity/Line";

export class LineController {

    private repository = getRepository(Line);

    async list(request: Request, response: Response, next: NextFunction) {
        return this.repository.find({ relations: ["plane"] });
        let query = request.query;
        let pageSize = query.pageSize || 10;
        let pageNum = query.pageNum || 1;
        let start = (pageNum - 1) * pageSize;
        let rs = this.repository
            .createQueryBuilder('line')
            .skip(start)
            .take(pageSize)
            .getMany();
        return rs;
    }

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, {
            relations: ["plane", "points"]
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