import Vue from 'vue';
import App from './App';
import router from './app.router';
import store from './app/store';
import API from './app/apis';

import './plugins';

Vue.config.productionTip = false;
Vue.prototype.$api = API;
// window.$prePath = 'http://39.100.81.105/nb';
window.$prePath = 'http://localhost:8077/nb';

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
