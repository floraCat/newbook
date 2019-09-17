import {UserController} from "../controller/UserController";

export const UserRoute = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "list"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "row"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:ids",
    controller: UserController,
    action: "del"
}];
