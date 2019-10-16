import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        planes: []
    },
    getters: {},
    mutations: {
        planes (state, val) {
            state.planes = val;
        }
    },
    actions: {}
});