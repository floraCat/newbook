import {LineController} from "../controller/LineController";

export const LineRoute = [{
    method: "get",
    route: "/lines",
    controller: LineController,
    action: "list"
}, {
    method: "get",
    route: "/lines/:id",
    controller: LineController,
    action: "row"
}, {
    method: "post",
    route: "/lines",
    controller: LineController,
    action: "save"
}, {
    method: "delete",
    route: "/lines/:ids",
    controller: LineController,
    action: "del"
}];
