import lodash from "lodash";
class NumberTransition {
  constructor() {}
  numberTransition: any = (num: any, ...list: any) => {
    // 第一个参数为要转换的数，最后一个参数为类型，中间参数参照各函数传参
    let data: any = num;
    const type = list[list.length - 1] || "-";
    this.transitionType = type;
    if (
      type &&
      (typeof num === "number" ||
        (num && typeof num === "string" && !lodash.isNaN(Number(num))))
    ) {
      const copyNum = JSON.parse(JSON.stringify(data));
      const params = list.slice(0, -1);
      switch (type) {
        case "num": // 金额
          data = this.getUnitNumber(copyNum, params);
          break;
        case "unit": // 单位
          data = this.getUnit(copyNum, params);
          break;
        case "integer": // 取整（转换单位后有小数保留）
          data = this.getIntegerNum(copyNum, params);
          break;
        case "ratio": // 比例
          data = this.getRatioNum(copyNum);
          break;
        case "delimiter": // 小数保留和千位符
          data = this.formatNumber(copyNum, params);
          break;
        case "toFixed": // 保留小数
          data = this.toFixed(copyNum, params);
          break;
        case "isEmpty":
          data = false;
          break;
        default:
          data = this.getUnitAndNum(copyNum, params[0]);
          break;
      }
    } else if (type === "isEmpty") {
      data = true;
    }
    return data;
  };
  transitionType: any = "";
  _transitionUnit: any = 5; // 固定值（需要修改进位规则时，和默认单位_unit修改）
  _unit: any = 5; // 默认万转换
  _delay: any = 1; // 延后几位数转换
  _promotionNum: any = 4; // 逢4长度进一个单位，从十位开始（比如，从十位开始，下一个单位为万，在一下个是亿）
  //（比如：_delay = 1，按万转换数据，万的后一位是10万，所以只有在数据大于10万的时候，才把数据转成万）
  unitArray: any = [
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
  // 数字--千位符（比如：10000 => 10,000）
  formatNumber: any = (num: any = 0, list: any) => {
    // isPerson 人次过滤，小数后面有数时（大于0），保留，否则去掉小数
    const [decimals, isPerson] = list;
    // decimals 小数位数(number); isPerson 是否是人次类型（boolean）
    num = Number(num).toFixed(decimals);
    // }
    const stringNum: any = num.toString();
    let [integer, decimal] = stringNum.split(".");
    integer = integer.replace(/\d(?=(\d{3})+$)/g, "$&,");
    if (isPerson) {
      decimal = decimal - 0 ? "." + decimal : "";
    } else {
      decimal = decimal ? "." + decimal : "";
    }
    return `${integer}${decimal}`;
  };
  getUnitByNum: any = (num: any, unit: any) => {
    num = Math.abs(num); // 负数多了个-号，所以取绝对值
    const _promotionNum = this._promotionNum;
    const numUnitStr: any = (num + "").split(".")[0];
    const len = numUnitStr.length;
    const index: any = this.getUnitIndex(unit);
    let unitIndex =
      Math.floor(len / _promotionNum) * _promotionNum +
      index -
      _promotionNum -
      1;
    if (
      unitIndex > this.unitArray.length - 1 ||
      unitIndex > len - 1 - this._delay
    ) {
      // 如果计算得到的单位下标（unitIndex）比unitArray总长度长 ｜｜
      // unitIndex 比要转换的数据长度海长（10万才进行万转换，所以-2）
      unitIndex = unitIndex - _promotionNum;
    }
    if (index > len || !index || unitIndex < 0) {
      unitIndex = 0;
    }
    const newUnit: any = this.unitArray[unitIndex];
    return newUnit;
  };
  getUnit: any = (num: any, list: any = []) => {
    //  this.decimals, isPerson,
    const [unit, decimals = 2] = list;
    // unit 单位; decimals 小数位数(number); isPerson 是否是人次类型（boolean）
    if (unit) {
      this._unit = unit;
    }
    let newUnit: any = this.getUnitByNum(num, this._unit);
    newUnit = this._getNewUnitByContrast(num, newUnit, decimals);
    return newUnit;
  };
  getUnitIndex: any = (unit: any) => {
    let index = unit;
    const unitArray = this.unitArray;
    if (typeof unit === "string") {
      index = unitArray.findIndex((a: any) => {
        return a === unit;
      });
      if (this.transitionType === "unit") {
        index++;
      }
    } else if (this.transitionType !== "unit") {
      index--;
    }
    return index;
  };
  getUnitAndNum: any = (num: any, params: any = {}) => {
    const { isPerson, decimals = 2 } = params;
    const unit = this.numberTransition(num, "unit");
    let newNum = this.numberTransition(num, unit, isPerson ? "integer" : "num");
    newNum = this.numberTransition(newNum, unit, isPerson, decimals, "toFixed");
    return {
      unit: unit,
      num: newNum,
    };
  };
  getUnitNumber: any = (num: any, list: any = []) => {
    const [unit] = list;
    const numStr = Number(num);
    const index = this.getUnitIndex(unit);
    let newNum = numStr;
    newNum = index > 0 ? numStr / Math.pow(10, index) : numStr;
    return newNum - 0;
  };
  // 人次转换
  getIntegerNum: any = (num: any, list: any) => {
    const [unit] = list;
    const returnNum = this.getUnitNumber(num, list);
    const newNum = this.numberTransition(returnNum, unit, true, 2, "toFixed");
    return newNum - 0;
  };
  getRatioNum: any = (num: any) => {
    const newNum: any = (num * 100).toFixed(2);
    return newNum - 0;
  };
  toFixed: any = (num: any, list: any) => {
    const [unit, isPerson, decimals = 2] = list;
    // decimals 小数位数(number); isPerson 是否是人次类型（boolean）
    // const newNum: any = (num - 0).toFixed(decimals);
    const decimalNum = Math.pow(10, decimals);
    const newNum: any = `${Math.round((num - 0) * decimalNum) / decimalNum}`;
    let [integer, decimal] = newNum.split(".");
    const index = this.getUnitIndex(unit);
    integer = integer + "";
    if (isPerson && index + this._delay < this._transitionUnit) {
      const [integerNum] = `${num}`.split(".");
      return integerNum;
    }
    if (decimal) {
      decimal = `.${decimal.padEnd(decimals, "0")}`;
    } else if (decimals > 0) {
      decimal = `.${"".padEnd(decimals, "0")}`;
    } else {
      decimal = "";
    }
    return `${integer}${decimal}`;
  };
  // 根据数据对比获取最新数据，查看保留小数后，数据位数是否发生变化
  //如果发生变化，按变化后的数据重新获取单位
  _getNewUnitByContrast: any = (num: any, unit: any, decimals: any = 2) => {
    // 不需要isPerson
    // const type = isPerson ? "integer" : "num";
    const index: any = this.getUnitIndex(this._transitionUnit);
    // const criticalVal: any = Math.pow(10, index); // 临界值
    // 获取转换的数据
    const newNum = this.numberTransition(num, unit, "num");
    // 截取小数
    const transitionNum = this.numberTransition(
      newNum,
      unit,
      false,
      decimals,
      "toFixed"
    );
    // 获取截取小数后的整数部分的长度
    // 如果长度大于等于临界值长度，重新获取单位
    if (transitionNum >= Math.pow(10, index)) {
      const unitIndex = this.getUnitIndex(unit);
      const newIndex = unitIndex + this._promotionNum;
      let newUnit = this.unitArray[newIndex];
      if (!newUnit) {
        newUnit = this.unitArray[this.unitArray.length - 1];
      }
      return newUnit;
    }
    return unit;
  };
}
const numberTransitionClass = new NumberTransition();
const numberTransition = numberTransitionClass.numberTransition;
export { numberTransition };
