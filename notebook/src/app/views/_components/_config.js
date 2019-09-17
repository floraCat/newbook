import { Attrs } from '../config';

export const RowDefaultPlane = {
    title: '',
    sort: 0
};

export const RowDefaultLine = {
    title: '',
    sort: 0,
    description: '',
    extend: '',
    planeId: null,
};

export const RowDefaultPoint = {
    title: '',
    sort: 0,
    description: '',
    extend: '',
    lineId: null,
};

export const RowDefaultBit = {
    keyword: '',
    content: '',
    attr: null,
    sort: 0,
    description: '',
    extend: '',
    pointId: null,
};

export const PlaneFields = [
    { key: 'title', label: '标题', defVal: '' },
    { key: 'sort', label: '排序', defVal: 0 }
];

export const LineFields = [
    { key: 'title', label: '标题', defVal: '' },
    { key: 'sort', label: '排序', defVal: 0 }
];

export const PointFields = [
    { key: 'title', label: '标题', defVal: '' },
    { key: 'sort', label: '排序', defVal: 0 }
];

export const BitFields = [
    { key: 'content', label: '内容', defVal: '' },
    { key: 'attr', label: '属性', defVal: '', opts: Attrs }
];