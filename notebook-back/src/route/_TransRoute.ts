/*
    数据转移 用到的 路由
*/

import {TransController} from "../controller/_pre_handle/_TransController";
import {TransControllerCard} from "../controller/_pre_handle/_TransController-card";
import {TransControllerLog} from "../controller/_pre_handle/_TransController-log";

export const _TransRoute = [
    {
        method: "get",
        route: "/trans",
        controller: TransController,
        action: "trans"
    },
    {
        method: "get",
        route: "/transCard",
        controller: TransControllerCard,
        action: "trans"
    },
    {
        method: "get",
        route: "/transLog",
        controller: TransControllerLog,
        action: "trans"
    }
];
