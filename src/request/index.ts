/*
 * @Autor: clark tan
 * @Date: 2021-04-08 09:46:16
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-09 13:49:40
 * @Description:
 */
import Axios, { AxiosRequestConfig } from "axios";
import { message } from "ant-design-vue";
import { isIE } from "@/utils/Common";
import AxiosExtension from "./AxiosExtension";
import sso from "../utils/SSO";
import { isEmpty } from "lodash";
import { getToken, getTokenName } from "@/utils/LocalStorage";
import { mainMessage } from "@/utils/MessageOnce";

const setCookie = (request: AxiosRequestConfig) => {
  const name = getTokenName();
  const token = getToken();
  if (name && token) request.headers[name] = token;
};

const error_handle = (error: { response: { status: any } }) => {
  switch (error?.response?.status) {
    case 403:
      mainMessage.error("权限不足");
      break; //Message.error("权限不足")
    case 500:
      mainMessage.error("服务异常");
      break; //Message.error("服务异常")
    default:
      mainMessage.error("服务异常！请稍后再试～");
      break; //Message.error("服务异常！请稍后再试～")
  }
  console.log(error);
};

const service: any = Axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 60000,
});

//判断是否ie11修复axios请求使用缓存
const fixedIERequest = (config: AxiosRequestConfig) => {
  if (isIE() == true) {
    const dataTime: any = new Date();

    if (isEmpty(config.params)) {
      config.params = {
        data: Date.parse(dataTime),
      };
    } else {
      config.params = {
        data: Date.parse(dataTime),
        ...config.params,
      };
    }
  }
};

// http request 请求拦截器
service.interceptors.request.use((config: any) => {
  setCookie(config);
  fixedIERequest(config);
  return config;
});

// http request 响应拦截器
service.interceptors.response.use(
  async (response: any) => {
    if (response.data.code === 401) {
      message.error(response.data.msg ?? "token过期，请重新登录");
      sso.gotoLogin();

      return false;
    }
    return response;
  },
  (error: { response: { status: any } }) => {
    error_handle(error);
    return Promise.reject(error);
  }
);

AxiosExtension.extend(service);

export default service;
