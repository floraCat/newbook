import {_TransRoute} from "./_TransRoute"; // 数据转移
import {UserRoute} from "./UserRoute";
import {BitRoute} from "./BitRoute";
import {PointRoute} from "./PointRoute";
import {LineRoute} from "./LineRoute";
import {PlaneRoute} from "./PlaneRoute";

export const Routes = [].concat(
    _TransRoute,
    UserRoute,
    BitRoute,
    PointRoute,
    LineRoute,
    PlaneRoute
);