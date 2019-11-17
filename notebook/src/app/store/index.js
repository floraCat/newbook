import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        planes: [],
        // 日志分类
        logTopics: []
    },
    getters: {},
    mutations: {
        planes (state, val) {
            state.planes = val;
        },
        logTopics (state, val) {
            state.logTopics = val;
        }
    },
    actions: {}
});