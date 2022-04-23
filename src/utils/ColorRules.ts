/*
 * @Author: clark tan
 * @Date: 2021-11-05 09:13:08
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-05 14:31:49
 * @Description:
 */
import lodash from "lodash";

class ColorRules {
  constructor() {}
  ColorRules: any = (num: any, ...list: any) => {
    // 第一个参数为要转换的数，最后一个参数为类型，中间参数参照各函数传参
    let data = num;
    const type = list[list.length - 1] || "progress";
    if (
      type &&
      (typeof num === "number" ||
        (num && typeof num === "string" && !lodash.isNaN(Number(num))))
    ) {
      const copyNum = JSON.parse(JSON.stringify(data));
      const params = list.slice(0, -1);
      switch (type) {
        case "progress": // 进度
          data = this.getProgressColor(copyNum, params);
          break;
        case "proportion": // 占比
          data = this.getProportion(copyNum, params);
          break;
        case "ratio": // 环比
          data = this.getRatio(copyNum, params);
          break;
        default:
      }
    }
    return data;
  };

  //颜色class，基于common.less文件变量，以便规则统一
  ruleColors = {
    terrible: "#dc4b46",
    warning: "#faf475",
    better: "#25fcc1",
    normal: "rgba(255, 255, 255, 0.8)",
  };

  // 数字--千位符（比如：10000 => 10,000）
  getProgressColor: any = (num: any = 100) => {
    switch (num) {
      case num < 90: //todo 此处数字替换store变量，根据后台返回值控制
        return this.ruleColors.terrible;
      default:
        return this.ruleColors.better;
    }
  };

  getProportion: any = (num: any) => {
    switch (num) {
      case num < 0: //todo 此处数字替换store变量，根据后台返回值控制
        return this.ruleColors.terrible;
      case num > 0: //todo 此处数字替换store变量，根据后台返回值控制
        return this.ruleColors.better;
      default:
        return this.ruleColors.better;
    }
  };
  getRatio: any = (num: any, targetNum: any) => {
    switch (num) {
      case num < targetNum: //todo 此处数字替换store变量，根据后台返回值控制
        return this.ruleColors.terrible;
      default:
        return this.ruleColors.better;
    }
  };
}
const ColorRulesClass = new ColorRules();

const colorRules = ColorRulesClass.ColorRules;

export { colorRules };
