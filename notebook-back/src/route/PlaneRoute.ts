import {PlaneController} from "../controller/PlaneController";

export const PlaneRoute = [
    {
        method: "get",
        route: "/planes/:id",
        controller: PlaneController,
        action: "row"
    },
    {
        method: "get",
        route: "/planes",
        controller: PlaneController,
        action: "list"
    },
    {
        method: "post",
        route: "/planes",
        controller: PlaneController,
        action: "edit"
    },
    {
        method: "delete",
        route: "/planes/:ids",
        controller: PlaneController,
        action: "del"
    }
];
