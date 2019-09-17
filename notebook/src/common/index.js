import * as Directives from './directives';
import * as Filters from './filters';
import * as Utils from './utils';
import * as Components from './components';

export default {
    install: (Vue) => {
        for (let name of Object.keys(Components)) {
            Vue.component(Components[name]['name'], Components[name]);
        }
        for (let name in Filters) {
            Vue.filter(name, Filters[name]);
        }
        for (let name in Directives) {
            Vue.directive(name, Directives[name]);
        }
        Vue.prototype.$utils = Utils;
    }
};
