import {PointController} from "../controller/PointController";

export const PointRoute = [{
    method: "get",
    route: "/points",
    controller: PointController,
    action: "list"
}, {
    method: "get",
    route: "/points/:id",
    controller: PointController,
    action: "row"
}, {
    method: "post",
    route: "/points",
    controller: PointController,
    action: "save"
}, {
    method: "delete",
    route: "/points/:ids",
    controller: PointController,
    action: "del"
}];
