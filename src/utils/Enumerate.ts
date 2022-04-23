/*
 * @Autor: clark tan
 * @Date: 2021-10-08 10:06:34
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-08 11:15:50
 * @Description:
 */
const mapNames: any = {
  MAP_1: "HospitalOverview",
  MAP_2: "OutpatientOverview",
  MAP_3: "InpatientOverview",
};
class shortNamesClass {
  constructor() {
    const _this: any = this;
    _this[mapNames.MAP_1] = "hospital";
    _this[mapNames.MAP_2] = "outpatient";
    _this[mapNames.MAP_3] = "inpatient";
  }
}

const dateNames: any = {
  Name_1: "day",
  Name_2: "month",
};

class DateBtnCnNameClass {
  constructor() {
    const _this: any = this;
    _this[dateNames.Name_1] = "当日";
    _this[dateNames.Name_2] = "当月";
  }
}

class DateCnNameClass {
  constructor() {
    const _this: any = this;
    _this[dateNames.Name_1] = {
      text: "日",
      currentText: "当日",
      prevText: "昨日",
    };
    _this[dateNames.Name_2] = {
      text: "月",
      currentText: "当月",
      prevText: "上月",
    };
  }
}

class ThemesColorClass {
  color1 = "#4efef9";
  color2 = "#25fcc1";
  color3 = "#faf475";
  color4 = "#f27834";
  color5 = "#dc4b46";
  color6 = "#b568ff";
  color7 = "#4a9aec";
  getColor = (color: any, opacity: any) => {
    const _this: any = this;
    if (opacity && !isNaN(opacity)) {
      const newColor = _this[color] || color;
      return this.colorToRgba(newColor, opacity);
    } else {
      return _this[color];
    }
  };
  colorToRgba = (color: any, opacity: any) => {
    const pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
    if (color && pattern.test(color)) {
      if (color.length == 4) {
        // 将三位转换为六位
        color =
          "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
      }
      //处理六位的颜色值
      const colorNew = [];
      for (let i = 1; i < 7; i += 2) {
        colorNew.push(parseInt("0x" + color.slice(i, i + 2)));
      }
      return `rgba(${colorNew.join(",")}, ${opacity})`;
    }
    return color;
  };
}

const dateBtnCnName: any = new DateBtnCnNameClass();
const dateCnName: any = new DateCnNameClass();
const shortNames: any = new shortNamesClass();

const themesColorClass: any = new ThemesColorClass();
const themesColor: any = themesColorClass.getColor;

export {
  mapNames,
  shortNames,
  dateNames,
  dateBtnCnName,
  dateCnName,
  themesColor,
};
