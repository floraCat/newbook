import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Plane} from "../entity/Plane";

export class PlaneController {

    private repository = getRepository(Plane);

    async list(request: Request, response: Response, next: NextFunction) {
        return this.repository.find({ relations: ["lines"] });
    }

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id, { 
            relations: ["lines"]
        });
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.repository.save(request.body);
    }

    async del(request: Request, response: Response, next: NextFunction) {
        let ids = request.query.ids.split(',');
        await ids.map(async x => {
            let removeItem = await this.repository.findOne(x);
            await this.repository.remove(removeItem);
        });
        return 'ok';
    }

}