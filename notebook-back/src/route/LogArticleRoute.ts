import {LogArticleController} from "../controller/LogArticleController";

export const LogArticleRoute = [
    {
        method: "get",
        route: "/log/article/:id",
        controller: LogArticleController,
        action: "row"
    },
    {
        method: "get",
        route: "/log/article",
        controller: LogArticleController,
        action: "list"
    },
    {
        method: "post",
        route: "/log/article",
        controller: LogArticleController,
        action: "edit"
    },
    {
        method: "delete",
        route: "/log/article/:ids",
        controller: LogArticleController,
        action: "del"
    }
];
