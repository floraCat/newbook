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

import jquery from 'jquery'
window.jQuery = window.$ = jquery

// 富文本编辑器
require('froala-editor/js/froala_editor.pkgd.min')
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)

// global style
import './assets/styles/index.scss';

import 'swiper/css/swiper.css';