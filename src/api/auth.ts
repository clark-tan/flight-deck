/*
 * @Autor: clark tan
 * @Date: 2021-10-09 11:39:08
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-11 20:04:23
 * @Description:
 */
import request from "../request/index";
const serverPre = "/flight-deck/my/";
const loginPre = "/flight-deck/anonymous/";

export default {
  // 根据token获取用户信息
  getUserInfo() {
    return request.getWithErrorNotify(`${serverPre}profile`);
  },
  /**
   * ticket验证
   */
  ticketExchange(params: any) {
    return request.postWithErrorNotify(`${loginPre}ticket/login`, null, params);
  },
  logout(params: any = null) {
    return request.postWithErrorNotify(`${loginPre}logout`, params);
  },
};
