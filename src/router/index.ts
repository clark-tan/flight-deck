/*
 * @Autor: clark tan
 * @Date: 2021-10-09 10:00:24
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-09 14:05:43
 * @Description:
 */
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import HospitalOverview from "../views/hospital-overview/index.vue";
import MapConfigView from "@/components/map/ConfigMapView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/hospital-overview",
    name: "HospitalOverview",
    component: HospitalOverview,
  },
  {
    path: "/map-config-view",
    name: "MapConfigView",
    component: MapConfigView,
  },
];

const createRouter = () =>
  new VueRouter({
    mode: "history", // Disabled due to Github Pages doesn't support this, enable this if you need.
    routes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
//此处为重新设置路由，在获取路由的时候重新设置路由
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher; // reset router
}

export default router;
