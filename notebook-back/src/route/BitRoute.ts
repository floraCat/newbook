import {BitController} from "../controller/BitController";

export const BitRoute = [{
    method: "get",
    route: "/bits/filter",
    controller: BitController,
    action: "filter"
}, {
    method: "get",
    route: "/bits/:id",
    controller: BitController,
    action: "row"
}, {
    method: "post",
    route: "/bits",
    controller: BitController,
    action: "save"
}, {
    method: "delete",
    route: "/bits/:ids",
    controller: BitController,
    action: "del"
}];
