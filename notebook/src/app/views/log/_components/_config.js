export const FieldConfig = [
    { key: 'title', label: '标题', defVal: '', formCtrl: { type: 'text' } },
    { key: 'sort', label: '排序', defVal: 0, formCtrl: { type: 'text' } },
    { 
        key: 'topic',
        label: '分类',
        defVal: null,
        formCtrl: {
            type: 'select',
            opts: [
                { label: '工作日志', value: 1 },
                { label: '生活日志', value: 2 },
                { label: '计划', value: 3 },
                { label: '随笔', value: 4 }
            ]
        }
    },
    { 
        key: 'class',
        label: '类别',
        defVal: null,
        formCtrl: {
            type: 'select',
            opts: [
                { label: '随笔', value: 0 },
                { label: '读书笔记', value: 1 },
                { label: '写作素材', value: 2 },
                { label: '写作练习', value: 3 }
            ]
        }
    },
    { key: 'content', label: '内容', defVal: '', formCtrl: { type: 'editor' } },
];