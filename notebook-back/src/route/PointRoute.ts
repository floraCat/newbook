import {PointController} from "../controller/PointController";

export const PointRoute = [
    {
        method: "get",
        route: "/points/:id",
        controller: PointController,
        action: "row"
    },
    {
        method: "post",
        route: "/points",
        controller: PointController,
        action: "edit"
    },
    {
        method: "delete",
        route: "/points/:ids",
        controller: PointController,
        action: "del"
    }
];
