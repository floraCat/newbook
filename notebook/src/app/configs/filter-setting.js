export const dropdownOpts = {
    Fields: [
        { label: '正文', value: 'content' }
    ],
    FieldsBit: [
        { label: '正文', value: 'content' }
    ],
    FieldsPoint: [
        { label: '标题', value: 'title' },
    ],
    Attrs: [
        { label: '全部', value: 0 },
        { label: '标记', value: 1 },
        { label: '高亮', value: 2 },
        { label: '难点', value: 3 },
        { label: '未懂', value: 4 },
        { label: '常记', value: 5 },
        { label: '已熟悉，有空看看', value: 6 },
        { label: '少用，再处理', value: 7 },
        { label: '垃圾桶', value: 8 },
        { label: '空', value: 9 }
    ],
    SortFields: [
        { label: '按标题', value: 'title' },
        { label: '按创建时间', value: 'createdAt' },
        { label: '按更新时间', value: 'updatedAt' }
    ],
    SortTypes: [
        { label: '默认', value: 'ASC' },
        { label: '倒序', value: 'DESC' },
        { label: '随机', value: 'random' }
    ],
    PlayRates: [
        { value: '1000' },
        { value: '2000' }
    ]
};
