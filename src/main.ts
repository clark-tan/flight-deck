/*
 * @Autor: clark tan
 * @Date: 2021-09-26 13:41:56
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-09 13:56:16
 * @Description:
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/less/index.less";
import "@/permission"; // permission control
import "./core/lazy_use"; //懒加载｜按需加载
import moment from "moment";

moment.locale("zh_cn");
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
