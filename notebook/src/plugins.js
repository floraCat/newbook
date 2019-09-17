import Vue from 'vue';

// polyfills
import 'blob';
import 'form-data';

// frame
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

// common
import Common from './common';
Vue.use(Common);

// 富文本编辑器
import 'froala-editor/css/froala_editor.pkgd.min.css';
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)

// global style
import './assets/styles/index.scss';
