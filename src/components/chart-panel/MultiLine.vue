<template>
  <div class="e-charts-box">
    <div
      v-if="!isEmpty"
      @mousemove="chartMouseMoveEvent"
      @mouseout="chartMouseOutEvent"
      ref="myChart"
    ></div>
    <ChartsEmpty v-else :type="emptyType" :size="size" />
  </div>
</template>
<script lang="ts">
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import { sortArray, formatUnit, formatThousand } from "@/utils/Common";
import { numberTransition } from "@/utils/NumberTransition";
import { cloneDeep } from "lodash";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts";

@Component({
  components: { ChartsEmpty },
})
export default class MultiLine extends Vue {
  myChart: any = null;
  unit: any = "";
  guide: any = "";
  maxLang: any = 0;
  isEmpty: any = false;
  max: any = 100;

  @Prop({ default: () => [] }) data: any;
  @Prop({ default: "singleLine" }) emptyType?: any;
  @Prop({ default: false }) showMark?: boolean;
  @Prop({ default: 0 }) guideValue: any;
  @Prop({ default: true }) showLegend?: boolean;
  @Prop({ default: false }) isRadio?: boolean;
  @Prop({ default: true }) showYAxis?: boolean;
  @Prop({ default: "end" }) labelPosition?: string;
  @Prop({
    default: () => ["#4EFEF9", "#4A9AEC", "#FFCD68", "#AFCF74", "#F59170"],
  })
  color?: any;
  @Prop({ default: "" }) yAxisName?: string;
  @Prop() xAxisName: any;
  @Prop() size: any;
  @Watch("isEmpty")
  isEmptyChange(val: any) {
    console.log(val, "isEmpty3");
  }
  @Watch("data")
  updateChart() {
    if (this.data.length) {
      this.initChart();
    }
  }

  mounted() {
    if (this.data.length) {
      this.initChart();
    }
  }

  initChart() {
    if (this.myChart !== null) {
      this.myChart.clear();
      this.myChart.dispose();
    }
    this.checkIsEmpty(this.data, "value");
    if (!this.isEmpty) {
      this.$nextTick(() => {
        this.myChart = echarts.init(this.$refs["myChart"] as HTMLElement);
        this.setOption();
        window.addEventListener("resize", this.myChart.resize);
      });
    }
  }
  chartMouseMoveEvent() {
    this.$emit("echartHover", true);
  }
  chartMouseOutEvent() {
    this.$emit("echartHover", false);
  }
  setOption() {
    const color = this.color;
    let legend: any = [];
    let series: any = [];
    let x: any = [];
    this.data.map((v: any) => {
      legend.push({
        name: v.name,
        // icon: "rect",
        textStyle: {
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
        },
      });
      series.push({
        name: v.name,
        type: "line",
        data: v.data,
        symbolSize: 6,
        symbol: "circle",
        markPoint: {
          data: [
            {
              type: "max",
              name: "Max",
              label: {
                position: "top",
              },
            },
            {
              type: "min",
              name: "Min",
              label: {
                position: "bottom",
              },
            },
          ],
          symbol: "circle",
          symbolSize: 6,
          itemStyle: {
            opacity: 1,
            borderColor: "#fff",
          },
          label: {
            color: this.data.length > 1 ? "inherit" : "#ffffff",
            fontSize: "18px",
            formatter: (params: any) => {
              if (this.isRadio) {
                return (
                  `${Number(params.value).toFixed(2)}`.replace(
                    /\d(?=(\d{3})+$)/g,
                    "$&,"
                  ) + "%"
                );
              }
              const temp = numberTransition(
                params.value,
                {
                  isPerson: true,
                },
                "-"
              );
              return temp == null
                ? "-"
                : `${formatThousand(temp.num)}${temp.unit}`;
            },
          },
        },
      });
      x = [];
      v.data.map((item: any) => {
        x.push(item.dataDt || item.name);
      });
    });
    if (this.showMark && this.data.length == 1) {
      series[0].markLine = {
        lineStyle: {
          color: "#FAF475",
          type: "solid",
        },
        symbol: "none",
        label: {
          position: this.labelPosition,
          color: "#FAF475",
          fontSize: 18,
          formatter: (params: any) => {
            if (this.isRadio) {
              return (
                `${Number(params.value).toFixed(2)}`.replace(
                  /\d(?=(\d{3})+$)/g,
                  "$&,"
                ) + "%"
              );
            }
            const temp = numberTransition(
              params.value,
              {
                isPerson: true,
              },
              "-"
            );
            return temp == null
              ? "-"
              : `${formatThousand(temp.num)}${temp.unit}`;
          },
        },
        data: [
          {
            yAxis: this.guideValue == null ? "" : this.guideValue,
          },
        ],
      };
    }
    if (this.data.length == 1) {
      series[0].areaStyle = {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(78,254,249,0.5)", // 0% 处的颜色
            },
            {
              offset: 0.5,
              color: "rgba(0,0,0,0.05)", // 50% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(0,0,0,0.05)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      };
    }
    const options: any = {
      color: color,
      tooltip: {
        className: "echarts-tooltip-dark",
        confine: true,
        trigger: "axis",
        padding: [12, 15],
        textStyle: {
          color: "#fff",
        },
        formatter: (params: any) => {
          let result = "";
          result += `<div style="color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:8px">${params[0].axisValue}</div>`;
          const isMoreData = params.length > 1;
          params.map((v: any) => {
            let value = "";
            if (this.isRadio) {
              value =
                isNaN(v.value) || v.value == null
                  ? "-"
                  : `${Number(v.value).toFixed(2)}%`;
            } else {
              const temp = numberTransition(
                v.value,
                {
                  isPerson: true,
                },
                "-"
              );
              value =
                temp == null ? "-" : `${formatThousand(temp.num)}${temp.unit}`;
            }
            result += `<div>${
              v.marker
            } <span style="font-size: 16px; margin-right: 16px">${
              v.seriesName
            }</span>
            <span style="font-size: 16px;color:${
              isMoreData ? v.color : ""
            }">${value}</span></div>`;
          });
          return result;
        },
      },
      legend: {
        show: this.showLegend,
        data: legend,
        itemGap: 20,
        itemWidth: 14,
        itemHeight: 7,
        align: "left",
        right: "10",
        // selectedMode: false,
        top: "10",
        textStyle: {
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
        right: this.chartsRight(),
        bottom: "0px",
        top: "45px",
        containLabel: true,
      },
      xAxis: {
        name: this.xAxisName || "月份",
        nameTextStyle: {
          color: "rgba(255,255,255,0.6)",
          verticalAlign: "top",
          padding: [8, 0, 0, 0],
        },
        nameGap: 5,
        interval: 0,
        nameLocation: "end",
        type: "category",
        data: Array.from(new Set(x)),
        // data: this.data.x,
        axisLabel: {
          color: "rgba(255,255,255,0.6)",
          fontSize: "14px",
          formatter: function (name: any) {
            const _temp = name.split("-");
            const result =
              _temp[_temp.length - 1] == "01"
                ? `${_temp[_temp.length - 2].slice(2)}-${
                    _temp[_temp.length - 1]
                  }`
                : _temp[_temp.length - 1];
            return result;
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,0.15)",
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        // name: `${this.yAxisName}` || "",
        nameTextStyle: {
          color: "rgba(255,255,255,0.6)",
          padding: [0, 25, 0, 0],
        },
        type: "value",
        nameLocation: "end",
        minInterval: 1,
        axisLabel: {
          width: 100,
          color: "rgba(255,255,255,0.6)",
          fontSize: "14px",
          formatter: (val: any) => {
            if (this.showYAxis) {
              if (this.isRadio) {
                return (
                  `${Number(val)}`.replace(/\d(?=(\d{3})+$)/g, "$&,") + "%"
                );
              }
              const temp = numberTransition(
                val,
                {
                  isPerson: true,
                  decimals: 0,
                },
                "-"
              );
              return temp == null
                ? "-"
                : `${formatThousand(temp.num)}${temp.unit}`;
            }
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255,255,255,0.15)",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["rgba(255,255,255,0.15)"],
          },
        },
      },
      series: series,
    };
    // 辅助线与坐标最大值比较
    let temp: any = [];
    const _data = cloneDeep(this.data);
    _data.map((v: any) => {
      temp.push(Number(sortArray(v.data, "value", "desc")[0].value) || 0);
    });
    const max = temp.sort(function (a: any, b: any) {
      return b - a;
    })[0];
    if (this.guideValue > max) {
      options.yAxis.max = this.guideValue;
    }
    this.myChart.setOption(options);
  }
  // 左边空距离
  chartsLeft() {
    const yAxisName = this.yAxisName;
    const yAxisLabelShow = this.showYAxis;
    const labelLang = Number(this.guide).toFixed(2).length;
    if (yAxisName && yAxisLabelShow) {
      const max = labelLang > this.maxLang ? labelLang : this.maxLang;
      const num = yAxisName.length - max;
      return num > 0 ? num * 12 : 10;
    } else if (yAxisName && this.labelPosition == "start") {
      const num = yAxisName.length - labelLang;
      return num > 0 ? num * 12 : 10;
    } else if (yAxisName) {
      return yAxisName.length * 12;
    } else {
      return 10;
    }
  }
  chartsRight() {
    // this.labelPosition == "end"
    //   ? Number(formatUnit(this.guideValue).targetValue).toFixed(2)
    //       .length * 14
    //   : 30,
    if (this.labelPosition == "end") {
      if (this.isRadio) {
        return (
          Number(formatUnit(this.guideValue).targetValue).toFixed(2).length * 14
        );
      }
      return (
        Number(formatUnit(this.guideValue).targetValue).toFixed(2).length * 10
      );
    }
    return 30;
  }
  checkIsEmpty(data: any, valueFiled: any) {
    let isEmpty = true;
    data.forEach((v: any) => {
      v.data.forEach((item: any) => {
        const flag = numberTransition(item[valueFiled], "isEmpty");
        isEmpty = isEmpty ? flag : false;
      });
    });
    this.isEmpty = isEmpty;
  }
}
</script>

<style lang="less" scoped></style>
