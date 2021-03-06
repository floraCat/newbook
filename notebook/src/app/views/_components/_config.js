import { AttrOpts, LogClassOpts } from '@configs/options';

/* ------- 编辑时表单控件配置 start ------- */

// plane
export const PlaneFieldConfig = [
    { key: 'title', label: '标题', defVal: '', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', defVal: 0, formCtrl: { type: 'text' } },
    { 
        key: 'solid',
        label: '分类',
        defVal: null,
        formCtrl: {
            type: 'select',
            defVal: 1,
            opts: [
                { label: '技术', value: 1 },
                { label: '生活', value: 2 },
                { label: '卡片', value: 3 }
            ]
        }
    }
];

// line
export const LineFieldConfig = [
    { 
        key: 'plane',
        label: '所属plane',
        defVal: null,
        formCtrl: {
            type: 'catalog-tree'
        }
    },
    { key: 'title', label: '标题', defVal: '', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', defVal: 0, formCtrl: { type: 'text' } },
    { key: 'description', label: '描述', defVal: '', formCtrl: { type: 'textarea' } }
];

// point
export const PointFieldConfig = [
    { 
        key: 'line',
        label: '所属line',
        defVal: null,
        formCtrl: {
            type: 'catalog-tree'
        }
    },
    { key: 'title', label: '标题', defVal: '', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', defVal: 0, formCtrl: { type: 'text' } },
    { key: 'attr', label: '属性', defVal: null, formCtrl: { type: 'select', opts: AttrOpts } },
    { key: 'description', label: '描述', defVal: '', formCtrl: { type: 'text' } },
    { key: 'extend', label: '拓展', defVal: '', formCtrl: { type: 'editor' } }
];

// bit
export const BitFieldConfig = [
    { 
        key: 'point',
        label: '所属point',
        defVal: null,
        formCtrl: {
            type: 'catalog-tree'
        }
    },
    { key: 'title', label: '标题', defVal: '', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', defVal: 0, formCtrl: { type: 'text' } },
    { key: 'attr', label: '属性', defVal: null, formCtrl: { type: 'select', opts: AttrOpts } },
    { key: 'audio', label: '音频', defVal: '', formCtrl: { type: 'file' } },
    { key: 'video', label: '视频', defVal: '', formCtrl: { type: 'file' } },
    { key: 'description', label: '描述', defVal: '', formCtrl: { type: 'textarea' } },
    { key: 'content', label: '正文', defVal: '', formCtrl: { type: 'editor' } }
];

// log
export const LogArticleFieldConfig = [
    { key: 'title', label: '标题', defVal: '', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', defVal: 0, formCtrl: { type: 'text' } },
    { 
        key: 'topic',
        label: '分类',
        defVal: null,
        formCtrl: {
            type: 'select',
            opts: []
        }
    },
    { 
        key: 'class',
        label: '类别',
        defVal: null,
        formCtrl: {
            type: 'select',
            opts: LogClassOpts
        }
    },
    { key: 'content', label: '内容', defVal: '', formCtrl: { type: 'editor' } },
];

/* ------- 编辑时表单控件配置 end ------- */

/* --point 下属颗粒字段配置 默认值-- */
// 模式一
export const FieldSettingMode1 = [
    { key: 'title', isAble: false, isShow: true },
    { key: 'sort', isAble: true, isShow: true },
    { key: 'attr', isAble: true, isShow: true },
    { key: 'audio', isAble: false, isShow: true },
    { key: 'video', isAble: false, isShow: true },
    { key: 'description', isAble: false, isShow: true },
    { key: 'content', isAble: true, isShow: true },
    { key: 'extend', isAble: false, isShow: true }
];
// 模式二
export const FieldSettingMode2 = [
    { key: 'title', isAble: true, isShow: true },
    { key: 'sort', isAble: true, isShow: true },
    { key: 'attr', isAble: true, isShow: true },
    { key: 'audio', isAble: false, isShow: true },
    { key: 'video', isAble: false, isShow: true },
    { key: 'description', isAble: false, isShow: true },
    { key: 'content', isAble: true, isShow: true },
    { key: 'extend', isAble: false, isShow: true }
];