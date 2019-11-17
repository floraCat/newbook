// 属性选项
export const AttrOpts = [
    { label: '空', value: 'NULL' },
    { label: '标记', value: 1 },
    { label: '高亮', value: 2 },
    { label: '难点', value: 3 },
    { label: '未懂', value: 4 },
    { label: '常记', value: 5 },
    { label: '已熟悉，有空看看', value: 6 },
    { label: '少用，再处理', value: 7 },
    { label: '垃圾桶', value: 8 }
];

// 其他下拉选项(filter页)
export const DropdownOpts = {
    Fields: [],
    FieldsLog: [
        { label: '正文', value: 'content' },
        { label: '标题', value: 'title' }
    ],
    FieldsBit: [
        { label: '正文', value: 'content' },
        { label: '标题', value: 'title' }
    ],
    FieldsPoint: [
        { label: '标题', value: 'title' }
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

// filter列表传参默认值
export const FilterDefaultVals = {
    solid: null,
    dimension: 'bit',
    showType: 'slider',
    keyword: '',
    keywordFields: ['content'],
    cats: '',
    attrs: [],
    sortField: 'updatedAt',
    sortType: 'DESC', // or ASC
    playType: 'hand',
    playRate: '',
    updatedAt: null,
    createdAt: null
};

// 日志的类别选项(只针对随笔)
export const LogClassOpts = [
    { label: '随笔', value: 0 },
    { label: '读书笔记', value: 1 },
    { label: '写作素材', value: 2 },
    { label: '写作练习', value: 3 }
];

/*------------------------grade 暂存，以后可配置 start-------------*/
/*
亚洲,东亚
亚洲,东南亚
亚洲,南亚
亚洲,中亚
亚洲,西亚
欧洲,北欧
欧洲,东欧
欧洲,中欧
欧洲,西欧
欧洲,南欧
非洲,北非
非洲,东非
非洲,中非
非洲,西非
非洲,南非
大洋州,南非
北美洲,北美
北美洲,中美
北美洲,加勒比海
南美洲,北部
南美洲,中西部
南美洲,东部
南美洲,南部
*/
/*------------------------grade 暂存，以后可配置 end-------------*/