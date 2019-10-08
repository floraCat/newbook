import {_TransRoute} from "./_TransRoute"; // 数据转移

import {_FilterController} from "../controller/_FilterController";
import {UserRoute} from "./UserRoute";

import {BitRoute} from "./BitRoute";
import {PointRoute} from "./PointRoute";
import {LineRoute} from "./LineRoute";
import {PlaneRoute} from "./PlaneRoute";

import {LogTopicRoute} from "./LogTopicRoute";
import {LogArticleRoute} from "./LogArticleRoute";

export const Routes = [].concat(
    {
        method: "get",
        route: "/filter",
        controller: _FilterController,
        action: "filter"
    },
    _TransRoute,
    UserRoute,
    BitRoute,
    PointRoute,
    LineRoute,
    PlaneRoute,
    LogTopicRoute,
    LogArticleRoute
);