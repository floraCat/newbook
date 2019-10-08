import {LogTopicController} from "../controller/LogTopicController";

export const LogTopicRoute = [
    {
        method: "get",
        route: "/log/topic/:id",
        controller: LogTopicController,
        action: "row"
    },
    {
        method: "get",
        route: "/log/topic",
        controller: LogTopicController,
        action: "list"
    },
    {
        method: "post",
        route: "/log/topic",
        controller: LogTopicController,
        action: "edit"
    },
    {
        method: "delete",
        route: "/log/topic",
        controller: LogTopicController,
        action: "del"
    }
];
