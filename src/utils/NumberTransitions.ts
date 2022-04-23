import lodash from "lodash";

enum numberType {
  money = "money",
  number = "number",
  empty = "empty",
}
// 1、判断数字是否大于转换值
// 2、数字转换
// 3、小数点进位
// 4、进位后是否大于转换临界值
// 5、获取单位
class NumberTransitions {
  constructor() {}
  //转换临界值
  convertNumber = 100000;

  unitArray: string[] = [
    "",
    "十",
    "百",
    "千",
    "万",
    "十万",
    "百万",
    "千万",
    "亿",
    "十亿",
    "百亿",
    "千亿",
    "万亿",
  ];

  numberTransitions: any = (num: any, ...list: any) => {
    // 1、判断数字是否大于转换值
    let data: string | number | boolean = num;
    const type = list[list.length - 1] || "-";
    if (
      typeof num === "number" ||
      (num && typeof num === "string" && !lodash.isNaN(Number(num)))
    ) {
      const copyNum = JSON.parse(JSON.stringify(data));
      // const params = list.slice(0, -1);
      // 2、数字转换
      this.getNumber(copyNum);
      console.log(data);
      // 3、获取类型
      // 4、小数点进位
      // 5、进位后是否大于转换临界值
      switch (type) {
        case numberType.money: // 金额
          // data = this.getUnitNumber(copyNum, params);
          break;
        case numberType.number: // 单位
          // data = this.getUnit(copyNum, params);
          break;
        case numberType.empty:
          data = false;
          break;
        default:
          // data = this.getUnitAndNum(copyNum, params[0]);
          break;
      }
    } else if (type === numberType.empty) {
      data = true;
    }
    return data;
  };
  getNumber: any = (num: any) => {
    const numStr = Number(num);
    let newNum;
    if (numStr / this.convertNumber >= 1) {
      const numStrIndex = numStr.toString().split(".")[0].length;
      if (numStrIndex < 8 && numStrIndex > 4) {
        newNum = numStr / Math.pow(10, 4);
      } else if (numStrIndex > 8) {
        newNum = numStr / Math.pow(10, 8);
      }
    } else {
      newNum = numStr;
    }
    console.log(newNum);
    return Number(newNum);
  };
  getUnit: any = (num: any, unit = "") => {
    // 是否有单位
    console.log(num, unit);
    const numStr = Number(num);
    let newUnit;
    const numStrIndex = numStr.toString().split(".")[0].length;
    if (numStrIndex < 8 && numStrIndex > 4) {
      newUnit = this.unitArray[4];
    } else if (numStrIndex > 8) {
      newUnit = this.unitArray[8];
    }
    return newUnit;
  };
  getNumberType: any = (num: any, type: any) => {
    //根据类型处理数值
    console.log(num, type);
    const numStr = Number(num);
    const newNum = numStr.toFixed(2);
    return Number(newNum);
  };
}
const numberTransitionsClass = new NumberTransitions();
const numberTransitions = numberTransitionsClass.numberTransitions;
export { numberTransitions };
