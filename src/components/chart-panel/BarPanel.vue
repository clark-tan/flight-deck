<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:56:59
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-19 15:53:49
 * @Description: 柱状图
-->
<template>
  <div class="e-charts-box">
    <div
      v-if="!isEmpty"
      @mousemove="chartMouseMoveEvent"
      @mouseout="chartMouseOutEvent"
      ref="BarChart"
    ></div>
    <ChartsEmpty v-else :type="emptyType" :size="size" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { numberTransition } from "@/utils/NumberTransition";
import { formatThousand } from "@/utils/Common";
import { themesColor } from "@/utils/Enumerate";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import * as echarts from "echarts";

@Component({
  components: { ChartsEmpty },
})
export default class BarPanel extends Vue {
  @Prop({
    default: () => [
      ["2021-09", null],
      ["2021-10", null],
    ],
  })
  chartData: any; // 地图数据
  @Prop({ default: 0 }) lineValue: any; // 警示线
  @Prop({ default: () => [{}] }) series: any;
  @Prop({ default: false }) yAxisLabelShow: any; // y轴刻度是否展示
  @Prop({ default: false }) splitLineShow: any;
  @Prop({ default: false }) markLineShow: any;
  @Prop({ default: false }) valueLabelShow: any;
  @Prop({ default: false }) isRadio?: boolean;
  @Prop({ default: 0 }) markValueDecim?: any;
  @Prop() yAxisName: any;
  @Prop({ default: false }) integer?: any;
  @Prop({ default: "singleBar" }) emptyType?: any;
  @Prop() size: any;
  @Prop({ default: 2 }) decimals: any;
  myCharts: any = null;

  yAxisUnit: any = "";
  maxLang: any = 0;
  maxNumber: any = 0;
  isEmpty: any = false;

  @Watch("chartData")
  chartDataChange() {
    this.mountedCharts();
  }
  mounted() {
    if (this.chartData.length) {
      this.mountedCharts();
    }
  }
  createCharts() {
    const el: any = this.$refs.BarChart;
    this.myCharts = echarts.init(el);
  }
  chartMouseMoveEvent() {
    this.$emit("echartHover", true);
  }
  chartMouseOutEvent() {
    this.$emit("echartHover", false);
  }
  async mountedCharts() {
    if (this.myCharts) {
      this.myCharts.clear();
    }
    try {
      const option = this.createOption(this.chartData);
      if (!this.isEmpty) {
        this.$nextTick(() => {
          this.createCharts();
          this.myCharts.setOption(option);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  getMaxLang(data: any) {
    let maxLang = 0;
    data.forEach((list: any) => {
      for (let i = 0; i < list.length; i++) {
        maxLang = list[i] > maxLang ? list[i] : maxLang;
      }
    });
    const str: any = (maxLang + "").split(".")[0];
    return str.length;
  }
  createOption(data: any) {
    const { num, unit } = numberTransition(
      this.lineValue,
      {
        isPerson: this.integer,
        decimals: this.decimals,
      },
      "-"
    );
    const lineVal = num;
    data = this.disposalData(data);
    const dataList = JSON.parse(JSON.stringify(data));
    const lineLeng = lineVal ? (lineVal + "").length : 0;
    const seriesConfig = (series: any) => {
      const list: any = [];
      series.forEach((item: any) => {
        // series 可配置
        // 柱子颜色，警戒线颜色\stack堆叠\柱子宽度
        const barColor: any = item.barColor;
        const markLineColor: any = item.markLineColor;
        const stack: any = item.stack;
        const name: any = item.name;
        // *****************
        const seriesConfig: any = {
          name: name,
          type: "bar",
          stack: stack || null,
          itemStyle: {
            color: barColor
              ? typeof barColor === "string"
                ? barColor
                : new echarts.graphic.LinearGradient(0, 0, 0, 1, barColor)
              : themesColor("color1"),
          },
          barWidth: 20,
          label: {
            show: this.valueLabelShow,
            color: "#fff",
            position: "top",
            fontSize: 18,
          },
        };
        if (this.markLineShow && !isNaN(lineVal - 0)) {
          seriesConfig.markLine = {
            lineStyle: {
              color: markLineColor ? markLineColor : "#FAF475",
              type: "solid",
            },
            symbol: "none",
            label: {
              position: "end",
              color: "#FAF475",
              fontSize: 18,
              formatter: () => {
                // return numberTransition(params.value, 1, false, "delimiter");
                // return `${lineVal}${unit}`;
                return `${formatThousand(lineVal)}${unit}`;
              },
            },
            data: [
              {
                yAxis: this.lineValue,
              },
            ],
          };
        }
        list.push(seriesConfig);
      });
      return list;
    };
    const yAxisLabelShow = this.yAxisLabelShow;
    const series = seriesConfig(this.series);
    const yAxisName = this.yAxisName;
    const chartConfig: any = {
      tooltip: {
        trigger: "axis",
        confine: true,
        padding: [12, 20],
        className: "echarts-tooltip-dark",
        textStyle: {
          color: "#fff",
        },
        formatter: (params: any) => {
          let result = "";
          result += `<div style="color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:8px">${params[0].axisValue}</div>`;
          const isMoreData = params.length > 1;
          params.map((item: any) => {
            const list = item.value;
            let value = list[item.seriesIndex + 1];
            value = numberTransition(value, "isEmpty") ? "-" : value;
            let newNum = value;
            let newUnit = "";
            if (this.isRadio) {
              newNum = numberTransition(value, "ratio");
              newUnit = `%`;
            } else {
              const { unit, num } = numberTransition(
                value,
                {
                  isPerson: this.integer,
                  decimals: this.decimals,
                },
                "-"
              );
              // value = `${num}${unit}`;
              newNum = num;
              newUnit = unit;
            }
            value =
              newNum && newNum !== "-"
                ? `${formatThousand(newNum)}${newUnit}`
                : "-";
            result += `<div>${
              item.marker
            } <span style="font-size: 16px; margin-right: 16px">${
              item.seriesName
            }</span>
            <span style="font-size: 16px;color:${
              isMoreData ? item.color : ""
            }">${value}</span>`;
          });
          result += `</div>`;
          return result;
        },
      },
      legend: {
        show: series.length > 1 ? true : false,
        itemGap: 24,
        itemWidth: 10,
        itemHeight: 10,
        // align: "right",
        right: lineLeng > 1 ? lineLeng * 10 + 20 : 30,
        // selectedMode: false, // 关闭时tooltip无效
        top: 0,
        textStyle: {
          color: "rgba(255,255,255, 0.6)",
          fontSize: 14,
          rich: {
            name: {
              width: 95,
            },
          },
        },
        formatter: (name: any) => {
          const _echarts: any = echarts;
          const newName = _echarts.format.truncateText(name, 95, "", "...");
          return `{name|${newName}}`;
        },
        tooltip: {
          show: true,
        },
      },
      grid: {
        left: this.chartsLeft(),
        top: 40,
        right: lineLeng > 1 ? lineLeng * 10 + 20 : 30,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        name: "月份",
        nameGap: 5,
        nameTextStyle: {
          color: "rgba(255,255,255,0.6)",
          verticalAlign: "top",
          padding: [8, 0, 0, 0],
        },
        type: "category",
        interval: 0,
        axisLabel: {
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
          formatter: (val: any) => {
            const _temp = val.split("-");
            const result =
              _temp[_temp.length - 1] == "01"
                ? `${_temp[_temp.length - 2].slice(2)}-${
                    _temp[_temp.length - 1]
                  }`
                : _temp[_temp.length - 1];
            return result;
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        // name: yAxisName,
        nameGap: 10,
        nameTextStyle: {
          color: "rgba(255,255,255,0.6)",
          padding: [0, yAxisName ? yAxisName.length * 12 : 0, 0, 0],
        },
        type: "value",
        splitLine: {
          show: this.splitLineShow,
          lineStyle: {
            color: ["rgba(255,255,255,0.15)"],
          },
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
          formatter: (val: any) => {
            if (yAxisLabelShow) {
              if (this.isRadio) {
                return `${val}%`;
              }
              const numObj = numberTransition(
                val,
                {
                  isPerson: this.integer,
                  decimals: 0,
                },
                "-"
              );
              return numObj
                ? `${formatThousand(numObj.num)}${numObj.unit}`
                : "-";
            }
          },
        },
      },
      dataset: {
        source: dataList,
      },
    };
    if (this.maxNumber < lineVal) {
      chartConfig.yAxis.max = this.lineValue;
    }
    chartConfig.series = series;
    return chartConfig;
  }
  disposalData(data: any) {
    const newData = JSON.parse(JSON.stringify(data));
    let max = 0;
    // max = max && !isNaN(max) ? max : 0;
    // const type = this.integer ? "integer" : "num";
    const seriesLeng = this.series.length || 1;
    let isEmpty = true;
    for (let i = 1; i < newData.length; i++) {
      const array = newData[i];
      let itemSum = 0;
      for (let n = 0; n < seriesLeng; n++) {
        // 只考虑了堆叠的情况
        const val = array[n + 1] - 0;
        itemSum += isNaN(val) ? 0 : val;
      }
      max = Math.max(Math.abs(max), Math.abs(itemSum));
    }
    // const unit = numberTransition(max, 5, "unit");

    for (let i = 1; i < newData.length; i++) {
      const array = newData[i];
      for (let n = 0; n < seriesLeng; n++) {
        // let val = numberTransition(array[n + 1], unit, type);
        // array[n + 1] = val;
        // 是否是空图表
        const flag = numberTransition(array[n + 1], "isEmpty");
        isEmpty = isEmpty ? flag : false;
      }
    }
    this.isEmpty = isEmpty;
    this.maxNumber = max;
    if (this.lineValue > max) {
      max = this.lineValue;
    }
    this.maxLang = `${max}`.length;

    // this.yAxisUnit = unit;
    return newData;
  }
  chartsLeft() {
    const yAxisName = this.yAxisName;
    const yAxisLabelShow = this.yAxisLabelShow;
    if (yAxisName && yAxisLabelShow) {
      const num = yAxisName.length - this.maxLang;
      return num > 0 ? num * 12 : 0;
    } else if (yAxisName) {
      return yAxisName.length * 12;
    } else {
      return 0;
    }
  }
}
</script>

<style></style>
