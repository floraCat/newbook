// 获取顶级所有plane (用于菜单下拉时初始第一级选项)
export const GetPlane = (_this) => {
    return new Promise(resolve => {
        let params = {
            solid: _this.$route.query.solid
        };
        _this.$api.Plane.list(params).then(res => {
            let list = res;
            list.map(x => {
                x.top = true;
                if (_this.dimension === 'line') {
                    x.leaf = true;
                }
            });
            resolve(list);
        });
    });
}

// 遍历 bitlist 添加 bit 字段显隐属性
export const MapGetShowObj = (list, fieldSetting) => {
    list.map((x,i) => {
        list[i].isShowObj = {};
        let setting = _.cloneDeep(fieldSetting);
        if (x.point) {
            if (x.point.subFieldSetting.length > 0) {
                setting = _.cloneDeep(x.point.subFieldSetting);
            }
            setting.map(y => {
                if (y.isAble) {
                    list[i].isShowObj[y.key] = y.isShow;
                } else {
                    list[i].isShowObj[y.key] = false;
                }
            });
        } else { 
            if (x.point === undefined) { // 日志
                setting.map(y => {
                list[i].isShowObj[y.key] = true;
                });
            } else { // point为null,即散点时
                setting.map(y => {
                    if (y.isAble) {
                        list[i].isShowObj[y.key] = y.isShow;
                    } else {
                        list[i].isShowObj[y.key] = false;
                    }
                });
            }
        }
    });
    return list;
}