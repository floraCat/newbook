import Vue from 'vue';
import App from './App';
import router from './app.router';
import API from './app/apis';

import './plugins';

Vue.config.productionTip = false;
Vue.prototype.$api = API;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
