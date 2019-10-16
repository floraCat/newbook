import {BitController} from "../controller/BitController";

export const BitRoute = [
    {
        method: "get",
        route: "/bits/:id",
        controller: BitController,
        action: "row"
    },
    {
        method: "get",
        route: "/bits",
        controller: BitController,
        action: "list"
    },
    {
        method: "post",
        route: "/bits",
        controller: BitController,
        action: "edit"
    },
    {
        method: "delete",
        route: "/bits/:ids",
        controller: BitController,
        action: "del"
    },
    {
        method: "post",
        route: "/bits/sort",
        controller: BitController,
        action: "sort"
    }
];
