import {LogTopicController} from "../controller/LogTopicController";

export const LogTopicRoute = [
    {
        method: "get",
        route: "/log/topic",
        controller: LogTopicController,
        action: "list"
    }
];
