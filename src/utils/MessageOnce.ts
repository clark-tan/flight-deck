/*
 * @Autor: clark tan
 * @Date: 2021-08-17 10:41:32
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-09 13:31:22
 * @Description:
 */
import { message } from "ant-design-vue";

let messageInstance: any = null;

const mainMessage: any = function DoneMessage(options: any) {
  //如果弹窗已存在先关闭
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = message.config(options);
};
const arr = ["success", "warning", "info", "error"];
arr.forEach(function (type) {
  mainMessage[type] = function (options: any) {
    if (typeof options === "string") {
      options = {
        message: options,
      };
    }
    options.type = type;
    return mainMessage(options);
  };
});
export { mainMessage };
