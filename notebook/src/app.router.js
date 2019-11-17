import Vue from 'vue';
import Router from 'vue-router';

/* ---------预处理 start------ */
import ToBit from './_pre_handle/to-bit/to-bit.vue';
import xlsxToDb from './_pre_handle/xlsx-to-db.vue';
/* ---------预处理 end------ */

import Index from '@/app/views/index.vue';

import ListBit from '@/app/views/list/list-bit.vue';
import ListPoint from '@/app/views/list/list-point.vue';
import ListLine from '@/app/views/list/list-line.vue';

import Filter from '@/app/views/filter/filter.vue';
import FilterList from '@/app/views/filter/list.vue';

import LogList from '@/app/views/log/log-list.vue';
import LogArticle from '@/app/views/log/log-article.vue';

import RecomPage from '@/app/views/static-page/recom-page.vue';
import LocalSource from '@/app/views/static-page/local-source.vue';

Vue.use(Router);

export default new Router({
    routes: [
        /* ----- 预处理 STSRT ----- */
        { path: '/to-bit', name: 'ToBit', component: ToBit }, // 颗粒拆分
        { path: '/to-db', name: 'xlsxToDb', component: xlsxToDb }, // 颗粒拆分
        /* ----- 预处理 END ----- */

        { path: '/', name: 'Index', component: Index },
        { path: '/bit/list', name: 'ListBit', component: ListBit },
        { path: '/point/list', name: 'ListPoint', component: ListPoint },
        { path: '/line/list', name: 'ListLine', component: ListLine },

        { path: '/filter', name: 'Filter', component: Filter },
        { path: '/filter-list', name: 'FilterList', component: FilterList },

        { path: '/log/list', name: 'LogList', component: LogList },
        { path: '/log/article', name: 'LogArticle', component: LogArticle },

        { path: '/recom-page', name: 'RecomPage', component: RecomPage },
        { path: '/local-source', name: 'LocalSource', component: LocalSource },

        { path: '**', redirect: '/' }
    ]
});
