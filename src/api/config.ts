/*
 * @Autor: clark tan
 * @Date: 2021-08-06 16:28:33
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-09 14:00:59
 * @Description:
 */
import request from "../request/index";
const servicePre = "/flight-deck/anonymous/";
const nomalPre = "/flight-deck/dict/";

export default {
  /**
   * 后端配置的参数
   */
  initConfig() {
    return request.getWithErrorNotify(`${servicePre}web-params`);
  },
  /**
   * 字典表
   */
  dictQuery(data: any) {
    return request.postWithErrorNotify(`${nomalPre}item/query`, data);
  },
};
