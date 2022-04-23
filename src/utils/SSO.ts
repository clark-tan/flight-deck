/*
 * @Autor: clark tan
 * @Date: 2021-04-08 09:46:16
 * @LastEditors: clark tan
 * @LastEditTime: 2021-09-10 09:04:35
 * @Description:
 */
/**
 * 自定义处理Url函数，用来处理后台配置的url
 * @param url 后台配置的url
 */
import { AppConfigModule } from "@/store/app-config";
function resolveUrl(url: string) {
  return url
    .replace("{origin}", window.location.origin)
    .replace("{host}", window.location.hostname);
}

function gotoLogin(logoutFirst: any = null) {
  let url: any =
    AppConfigModule.appConfig["sso.loginUrl"] +
    `?systemCode=${AppConfigModule.appConfig["sso.systemCode"]}&fw=` +
    btoa(window.location.href);
  if (logoutFirst) {
    url += "&logout=1";
  }
  window.location = url;
}

export default { gotoLogin, resolveUrl };
