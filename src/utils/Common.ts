import { message } from "ant-design-vue";
/**
 * 单位格式化
 * @param originalVal 原始值
 */
const formatUnit = function (originalVal: any, isPerson = true) {
  let unit = "",
    unitValue = 1,
    targetValue = null;
  if (isNaN(originalVal) || originalVal == null) {
    return {
      targetValue: "-",
      unit: "",
    };
  }
  if (originalVal >= 1000000000000) {
    unit = "万亿";
    unitValue = 1000000000000;
    targetValue = (originalVal / unitValue).toFixed(2);
  } else if (originalVal >= 1000000000) {
    unit = "亿";
    unitValue = 100000000;
    targetValue = (originalVal / unitValue).toFixed(2);
  } else if (originalVal >= 100000) {
    unit = "万";
    unitValue = 10000;
    targetValue = (originalVal / unitValue).toFixed(2);
  } else {
    targetValue = isPerson
      ? (originalVal / unitValue).toFixed(0)
      : (originalVal / unitValue).toFixed(2);
  }
  return {
    targetValue,
    unit,
  };
};

const formatValue = function (
  originalVal: any,
  unitValue: any = 1,
  decimalNum: any = 2
) {
  const result = Number(originalVal / unitValue).toFixed(decimalNum);
  return Number(result);
};

const formatThousand = function (originalVal: any) {
  if (isNaN(originalVal) || originalVal == null) {
    return "-";
  }
  const arr = `${originalVal}`.split(".");
  const interger = arr[0].replace(/\d(?=(\d{3})+$)/g, "$&,");
  const decimal = arr.length > 1 ? `.${arr[1]}` : "";
  return `${interger}${decimal}`;
};

// 数字--千位符（比如：10000 => 10,000）
const formatNumber = function (
  num: any = 0,
  decimalNum: any = 3,
  filter: any = false
) {
  // filter 人次过滤，小数后面有数时（大于0），保留，否则去掉小数
  // num = parseFloat(Number(num).toFixed(decimalNum));
  // if (filter) {
  //   num = num + "";
  // } else {
  num = Number(num).toFixed(decimalNum);
  // }
  const stringNum: any = num.toString();
  let [integer, decimal] = stringNum.split(".");
  integer = integer.replace(/\d(?=(\d{3})+$)/g, "$&,");
  if (filter) {
    decimal = decimal - 0 ? "." + decimal : "";
  } else {
    decimal = decimal ? "." + decimal : "";
  }
  return `${integer}${decimal}`;
};

/**
 * 对象数组去重
 * @param {数组} arr
 * @param {唯一属性} attr
 */
const unique = (arr: any[], attr: string | number) => {
  const res = new Map();
  return arr.filter(
    (a: { [x: string]: any }) => !res.has(a[attr]) && res.set(a[attr], 1)
  );
};
/**
 * 求数组差集
 * @param {*} arr1
 * @param {*} arr2
 */
const subSet = function (
  arr1: Iterable<unknown> | null | undefined,
  arr2: Iterable<unknown> | null | undefined
) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const subset = [];
  for (const item of set1) {
    if (!set2.has(item)) {
      subset.push(item);
    }
  }
  return subset;
};

/**
 * @desc 获取url中参数的值
 * @param {url} 页面地址
 * @param {queryName} 参数名
 */
const getUrlParam = function (url: string, queryName: string) {
  const query = decodeURI(url.substring(1));
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    if (i == 0) {
      const pair = vars[i].split("=");
      if (pair[0].split("?")[1] == queryName) {
        return pair[1];
      }
    } else {
      const pair = vars[i].split("=");
      if (pair[0] == queryName) {
        return pair[1];
      }
    }
  }
  return null;
};

/**
 * 递归生成树形结构
 */
const generaterTree = function (
  arr: any[],
  label: string | number,
  pLabel: string | number
) {
  const result: any[] = [];
  arr.map((item: { [x: string]: any; children: any[] }) => {
    if (item[pLabel] == 0) {
      item.children = getchilds(item[label], arr, label, pLabel); // 子节点
      result.push(item);
    }
  });
  return result;
};

function getchilds(
  id: any,
  arr: any[],
  label: string | number,
  pLabel: string | number
) {
  const childs: any[] = [];
  arr.map((item: { [x: string]: any }) => {
    if (item[pLabel] == id) {
      childs.push(item);
    }
  });
  childs.map((item) => {
    const childscopy = getchilds(item[label], arr, label, pLabel); // 递归获取子节点
    if (childscopy.length > 0) {
      item.children = childscopy;
    }
  });
  return childs;
}
/**
 * 递归生成树形结构
 */
const toTree = function (list: string | any[], parId: any) {
  const len = list.length;
  function loop(parId: any) {
    const res = [];
    for (let i = 0; i < len; i++) {
      const item = list[i];
      if (item.parentId == parId) {
        item.children = loop(item.funcId);
        res.push(item);
      }
    }
    return res;
  }
  return loop(parId);
};

/**
 * 树转数组扁平化结构
 * 深度优先遍历  递归
 */
const deepTraversal = function (data: any[]) {
  const result: { funcId: any; funcName: any; parentId: any; url: any }[] = [];
  data.forEach((item: any) => {
    const loop = (data: {
      funcId: any;
      funcName: any;
      parentId: any;
      url: any;
      children: any;
    }) => {
      result.push({
        funcId: data.funcId,
        funcName: data.funcName,
        parentId: data.parentId,
        url: data.url,
      });
      const child = data.children;
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });
  return result;
};

const getAllLeaf = function (data: any) {
  const result: any[] = [];
  function getLeaf(data: any[]) {
    data.forEach((item: any) => {
      if (item.children.length == 0) {
        delete item.children;
        result.push(item);
      } else {
        getLeaf(item.children);
      }
    });
  }
  getLeaf(data);
  return result;
};

/**
 * @desc 格式化时间
 * @param {time} 需要格式化的时间
 * @param {cFormat} 格式化的规则 {y}-{m}-{d} {h}:{i}:{s} {a} 或 {y}-{m}-{d} {h}:{i}:{s}
 */
const FormatTime = function (time: any, cFormat: string) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(
    /{(y|m|d|h|i|s|a)+}/g,
    (result: string | any[], key: string) => {
      if (formatObj.a == 0) formatObj.a = 7;
      let value = formatObj[key];
      if (key === "a")
        return [
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
          "星期日",
        ][value - 1];
      if (result.length > 0 && value < 10) {
        value = "0" + value;
      }
      return value || 0;
    }
  );
  return time_str;
};

/**
 * @desc 判断是否为IE浏览器
 */
const isIE = () => {
  if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
  else return false;
};

/**
 * 对象数组差集
 * @param {Array} arr1 数组1
 * @param {Array} arr2 数组2
 * @param {String} typeName 用来过滤的属性名称
 */
const getDifferenceSet = function (
  arr1: any[],
  arr2: any,
  typeName: string | number
) {
  return Object.values(
    arr1
      .concat(arr2)
      .reduce(
        (acc: { [x: string]: any }, cur: { [x: string]: string | number }) => {
          if (
            acc[cur[typeName]] &&
            acc[cur[typeName]][typeName] === cur[typeName]
          ) {
            delete acc[cur[typeName]];
          } else {
            acc[cur[typeName]] = cur;
          }
          return acc;
        },
        {}
      )
  );
};

/**
 * 对json数据按照一定规则进行排列
 * @param {string} propertyName [排序时所依据的字段]
 * @param {boolean} asc  [可选参数，默认降序，设置为true即为升序]
 */
const compare = function (propertyName: string | number, asc: boolean) {
  const _asc = asc || false;
  return function (
    object1: { [x: string]: any },
    object2: { [x: string]: any }
  ) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];
    value1 = new Date(value1);
    value2 = new Date(value2);
    if (_asc) {
      if (value2.getTime() > value1.getTime()) {
        return -1;
      } else if (value2.getTime() < value1.getTime()) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (value2.getTime() < value1.getTime()) {
        return -1;
      } else if (value2.getTime() > value1.getTime()) {
        return 1;
      } else {
        return 0;
      }
    }
  };
};

/**
 * 对象数组排序
 * @param arr 被排序的数组
 * @param key 排序的属性
 * @param order 排序方式
 */
const sortArray = function (arr: any[], key: string | number, order: string) {
  if (order == "asc") {
    arr.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) =>
        a[key] - b[key]
    );
  } else if (order == "desc") {
    arr.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) =>
        b[key] - a[key]
    );
  }
  return arr;
};

/**
 * 下载文件流
 * @param {blob} file 二进制流文件
 * @param {string} fileName  文件名称
 */
const downloadFile = function (file: BlobPart, fileName: any) {
  // const blob = new Blob([file], { type: 'application/vnd.ms-excel' });
  const blob = new Blob([file], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 复制文本
 * @param {string} text 需要复制的文本信息
 */
const copyText = function (text: string) {
  const textBox = document.createElement("input");
  textBox.value = text;
  document.body.appendChild(textBox);
  textBox.select();
  document.execCommand("Copy");
  textBox.className = "textBox";
  textBox.style.display = "none";
  message.success("复制成功", 2);
};

/**
 * 信息脱敏
 * @param {string} str 需要脱敏的字符串
 * @param {number} frontLen 字符串前面保留位数
 * @param {number} endLen 字符串后面保留位数
 * @returns {string} 返回的脱敏字符串
 */
const maskInfo = function (str: string, frontLen: number, endLen: number) {
  str = str + "";
  const len = str.length - frontLen - endLen;
  let xing = "";
  for (let i = 0; i < len; i++) {
    xing += "*";
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
};

const getBase64Image = function (img: any) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx: any = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  const dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
};

// 手机号验证
const regPhone = /^1[3456789]\d{9}$/;
// 身份证号验证
const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
// 密码 数字和字母组合
// const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/
const regPassword = /^[^\u4e00-\u9fa5]{6,30}$/;
// 纯数字
const regNumber = /^[0-9]{1,30}$/;
// 纯字母
const regLetter = /^[A-Za-z]{1,20}$/;
// 纯字母、纯数字、数字和字母组合
const resUserName =
  /^[0-9]{2,30}$|[A-Za-z]{2,30}$|(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,30}$/;
const resChinese = /^[\u4e00-\u9fa5]{1,20}$/;
// 中文、字母、数字 2-20位
const resRealName = /^[\u4E00-\u9FA5A-Za-z0-9]{2,30}$/;
// 名称类：中文、字母、数字 1-20位
const resCommon = /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/;
// code编码 数字、字母 4-30位
// const resCode = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,30}$/
const resCode = /^[^\u4e00-\u9fa5]{4,30}$/;

export {
  unique,
  subSet,
  generaterTree,
  FormatTime,
  toTree,
  deepTraversal,
  getAllLeaf,
  getUrlParam,
  isIE,
  getDifferenceSet,
  compare,
  sortArray,
  downloadFile,
  copyText,
  maskInfo,
  getBase64Image,
  regPhone,
  regIdCard,
  regPassword,
  regNumber,
  regLetter,
  resUserName,
  resChinese,
  resRealName,
  resCommon,
  resCode,
  formatNumber,
  formatUnit,
  formatValue,
  formatThousand,
};
