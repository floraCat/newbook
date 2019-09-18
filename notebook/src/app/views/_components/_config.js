import { AttrOpts } from '@configs/filter-setting';

/* ------- 编辑时表单控件配置 start ------- */

export const PlaneFieldConfig = [
    { key: 'title', label: '标题', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', formCtrl: { type: 'text' } },
    { key: 'solid',
        label: '分类',
        formCtrl: {
            type: 'select',
            defVal: 1,
            opts: [
                { label: '技术', value: 1 },
                { label: '生活', value: 2 }
            ]
        }
    }
];

export const LineFieldConfig = [
    { key: 'title', label: '标题', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', formCtrl: { type: 'text' } },
    { key: 'description', label: '描述', formCtrl: { type: 'text' } },
    { key: 'id',
        label: '所属plane',
        formCtrl: {
            type: 'catalog-tree'
        }
    }
];

export const PointFieldConfig = [
    { key: 'title', label: '标题', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', formCtrl: { type: 'text' } },
    { key: 'attr', label: '属性', formCtrl: { type: 'select', opts: AttrOpts } },
    { key: 'description', label: '描述', formCtrl: { type: 'text' } },
    { key: 'extend', label: '拓展', formCtrl: { type: 'editor' } },
    { key: 'id',
        label: '所属line',
        formCtrl: {
            type: 'catalog-tree'
        }
    }
];

export const BitFieldConfig = [
    { key: 'title', label: '标题', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', formCtrl: { type: 'text' } },
    { key: 'attr', label: '属性', formCtrl: { type: 'select', opts: AttrOpts } },
    { key: 'audio', label: '音频', formCtrl: { type: 'file' } },
    { key: 'video', label: '视频', formCtrl: { type: 'file' } },
    { key: 'content', label: '正文', formCtrl: { type: 'editor' } },
    { key: 'id',
        label: '所属point',
        formCtrl: {
            type: 'catalog-tree'
        }
    }
];

/* ------- 编辑时表单控件配置 end ------- */

/* ------- 新增时默认字段值 start ------- */

export const RowDefaultPlane = {
    title: '',
    sort: 0,
    solid: 1
};

export const RowDefaultLine = {
    title: '',
    sort: 0,
    description: '',
    extend: '',
    planeId: null
};

export const RowDefaultPoint = {
    title: '',
    sort: 0,
    attr: 0,
    description: '',
    extend: '',
    lineId: null,
    config: ''
};

export const RowDefaultBit = {
    title: '',
    sort: 0,
    attr: 0,
    audio: '',
    vidoe: '',
    description: '',
    content: '',
    extend: '',
    pointId: null,
    config: ''
};

/* ------- 新增时默认字段值 end ------- */

// bit 字段配置 默认值
export const FieldConfigDefault = [
    { key: 'title', isAble: true, isShow: true },
    { key: 'sort', isAble: true, isShow: true },
    { key: 'attr', isAble: true, isShow: true },
    { key: 'audio', isAble: false, isShow: false },
    { key: 'video', isAble: false, isShow: false },
    { key: 'description', isAble: true, isShow: true },
    { key: 'content', isAble: true, isShow: true },
    { key: 'extend', isAble: false, isShow: false }
];