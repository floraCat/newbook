import { Plane } from './plane';
import { Line } from './line';
import { Point } from './point';
import { Bit } from './bit';

import { LogTopic } from './log-topic';
import { LogArticle } from './log-article';

let Common = {
    // 筛选
    filter: function (params) {
        return Axios.get(`${$prePath}/filter`, { params }).then((response) => {
            return response.data;
        });
    }
};
export default {
    Common,
    Plane,
    Line,
    Point,
    Bit,
    LogTopic,
    LogArticle
};
