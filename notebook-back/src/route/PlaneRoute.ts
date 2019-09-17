import {PlaneController} from "../controller/PlaneController";

export const PlaneRoute = [{
    method: "get",
    route: "/planes",
    controller: PlaneController,
    action: "list"
}, {
    method: "get",
    route: "/planes/:id",
    controller: PlaneController,
    action: "row"
}, {
    method: "post",
    route: "/planes",
    controller: PlaneController,
    action: "save"
}, {
    method: "delete",
    route: "/planes",
    controller: PlaneController,
    action: "del"
}];
