/*
    数据转移 用到的 路由
*/

import {TransController} from "../controller/_TransController";

export const _TransRoute = [{
    method: "get",
    route: "/trans",
    controller: TransController,
    action: "trans"
}];
