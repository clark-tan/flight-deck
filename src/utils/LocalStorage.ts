/*
 * @Autor: clark tan
 * @Date: 2021-04-21 10:47:25
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-11 20:04:42
 * @Description:
 */

// App
// export const getSidebarStatus = () => window.localStorage.getItem(TOKEN_HEAD_NAME);
// export const setSidebarStatus = window.localStorage.getItem(TOKEN_HEAD_NAME);

// User
const tokenKey = "TOKEN_HEAD_NAME"; //x-  兼容标准格式
export const getTokenName: any = () => window.localStorage.getItem(tokenKey);
export const getToken = () => window.localStorage.getItem(getTokenName());
export const setToken = (tokenName: string, token = "") => {
  window.localStorage.setItem(tokenKey, tokenName);
  token
    ? window.localStorage.setItem(tokenName, token)
    : window.localStorage.removeItem(tokenName);
};
