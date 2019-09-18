import Vue from 'vue';
import Router from 'vue-router';

import ListBit from '@/app/views/list-bit.vue';
import ListPoint from '@/app/views/list-point.vue';
import ListLine from '@/app/views/list-line.vue';

import FilterSetting from '@/app/views/filter-setting.vue';
import FilterList from '@/app/views/filter-list.vue';
// import Editor from '@/app/views/editor.vue';

import ToBit from '@/app/views/to-bit/to-bit.vue';

Vue.use(Router);

export default new Router({
    routes: [
        /* ----- 颗粒拆分 STSRT ----- */
        {
            path: '/to-bit',
            name: 'ToBit',
            component: ToBit
        },
        /* ----- 颗粒拆分 END ----- */
        {
            path: '/bit/list',
            name: 'ListBit',
            component: ListBit
        },
        {
            path: '/point/list',
            name: 'ListPoint',
            component: ListPoint
        },
        {
            path: '/line/list',
            name: 'ListLine',
            component: ListLine
        },
        {
            path: '/filter',
            name: 'FilterSetting',
            component: FilterSetting
        },
        {
            path: '/filter-list',
            name: 'FilterList',
            component: FilterList
        },
        // {
        //     path: '/editor',
        //     name: 'Editor',
        //     component: Editor
        // }
        {
            path: '**',
            redirect: '/line/list'
        }
    ]
});
