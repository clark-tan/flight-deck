/*
 * @Autor: clark tan
 * @Date: 2021-04-19 14:31:40
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-12 14:32:39
 * @Description:
 */
import router from "./router";
import API from "@/api/index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { isEmpty } from "lodash";
// import AccessController from "@/utils/AccessController";
import { setToken } from "@/utils/LocalStorage";
import { AppConfigModule } from "@/store/app-config";
import { UserModule } from "@/store/user/index";

NProgress.configure({ showSpinner: true });

// 初始化页面标题的系统名称
const getPageTitle = (key) => {
  console.log(key);
  if (key) {
    return `${key} - 管理驾驶舱`;
  }
  return `管理驾驶舱`;
};

const whiteList = ["/error-page", "/access-denied"];

router.beforeEach(async (to, from, next) => {
  // Start progress bar
  NProgress.start();
  if (isEmpty(AppConfigModule.appConfig)) {
    await AppConfigModule.InitAppConfig();
  }
  // 判断是否带有ticket
  if (Object.hasOwnProperty.call(to.query, "ticket")) {
    try {
      const res = await API.auth.ticketExchange({ ticket: to.query.ticket });
      setToken(AppConfigModule.appConfig["session.headName"], res.token);
      const replaceUrl = window.location.href.replace(/[?&]ticket=[\w-]*/, "");
      window.location.href = replaceUrl;
    } catch (error) {
      next({ name: "ErrorPage", params: error });
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (isEmpty(UserModule.userInfo)) {
        await UserModule.getUserInfo();
      }
      next();
      // await AccessController.load();
      // const funcCode = to.meta?.funcCode;
      // const searchFunCode = to.meta?.searchFunCode;
      // if (
      //   !funcCode ||
      //   (AccessController.funcEnabled(funcCode) &&
      //     (!searchFunCode || AccessController.funcEnabled(searchFunCode)))
      // ) {
      //   next();
      // } else {
      //   Message.error("您没有权限查看该菜单");
      //   next("/access-denied");
      // }
    }
  }
});

router.afterEach((to) => {
  // Finish progress bar
  NProgress.done();
  // set page title
  document.title = getPageTitle(to.meta?.title);
});
