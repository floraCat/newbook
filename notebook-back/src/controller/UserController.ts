import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class UserController {

    private repository = getRepository(User);

    async list(request: Request, response: Response, next: NextFunction) {
        return this.repository.find();
    }

    async row(request: Request, response: Response, next: NextFunction) {
        return this.repository.findOne(request.params.id);
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