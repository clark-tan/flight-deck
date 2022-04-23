<template>
  <div class="e-charts-box">
    <div v-if="!isEmpty" ref="myChart"></div>
    <ChartsEmpty v-else :type="'moreLine'" />
  </div>
</template>
<script lang="ts">
import { numberTransition } from "@/utils/NumberTransition";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { formatThousand } from "@/utils/Common";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
const echarts = require("echarts");

@Component({
  components: { ChartsEmpty },
})
export default class ChartBar extends Vue {
  myChart: any = null;
  unit: any = "";
  inData: any = [];
  outData: any = [];
  isEmpty: any = false;

  @Prop({ default: () => [] }) data: any;

  @Watch("data")
  updateChart() {
    if (this.data) {
      this.initChart();
    }
  }

  mounted() {
    if (this.data) {
      this.initChart();
    }
  }

  initChart() {
    if (this.myChart !== null) {
      this.myChart.clear();
      this.myChart.dispose();
      window.removeEventListener("resize", this.myChart.resize);
    }
    // this.formatUnit();
    this.checkIsEmpty([...this.data.inData, ...this.data.outData]);
    if (!this.isEmpty) {
      this.$nextTick(() => {
        this.myChart = echarts.init(this.$refs["myChart"]);
        this.setOption();
        window.addEventListener("resize", this.myChart.resize);
      });
    }
  }
  setOption() {
    const options = {
      color: ["#4A91D9", "#76B5F7", "#FFCD68", "#AFCF74", "#F59170"],
      tooltip: {
        className: "echarts-tooltip-dark",
        trigger: "axis",
        padding: [12, 20],
        textStyle: {
          color: "#fff",
        },
        formatter: (params: any) => {
          let result = "",
            value = "-";
          result += `<div style="color:rgba(255,255,255,0.8);font-size:14px;margin-bottom:8px">${params[0].axisValue}</div>`;
          const isMoreData = params.length > 1;
          params.map((v: any) => {
            const temp = numberTransition(
              v.value,
              {
                isPerson: true,
              },
              "-"
            );
            if (temp != null) {
              value = `${formatThousand(temp.num)}${temp.unit}`;
            }
            result += `<div>${
              v.marker
            } <span style="font-size: 16px; margin-right: 20px">${
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
        data: [
          {
            name: "入院",
            icon: "rect",
          },
          {
            name: "出院",
            icon: "rect",
          },
        ],
        textStyle: {
          color: "rgba(255,255,255,0.6)",
          fontSize: "14px",
          lineHeight: 1,
          rich: {
            name: {
              width: 5,
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
        itemGap: 24,
        itemWidth: 10,
        itemHeight: 10,
        // align: "left",
        right: 0,
        // selectedMode: false,
        top: "10",
      },
      grid: {
        left: "0",
        right: "40",
        bottom: "0px",
        top: "45px",
        containLabel: true,
      },
      xAxis: {
        name: "月份",
        nameGap: 5,
        nameTextStyle: {
          color: "rgba(255,255,255,0.6)",
        },
        interval: 0,
        nameLocation: "end",
        type: "category",
        data: this.data.x,
        axisLabel: {
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
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
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: ["rgba(255,255,255,0.15)"],
          },
        },
      },
      yAxis: {
        type: "value",
        // name: "人次",
        nameTextStyle: {
          color: "rgba(255,255,255,0.6)",
          padding: [0, 0, 0, 22],
        },
        nameLocation: "end",
        minInterval: 1,
        axisLabel: {
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
          formatter: function (val: any) {
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
      series: [
        {
          name: "入院",
          type: "bar",
          barWidth: "8",
          cursor: "default",
          data: this.data.inData,
          barGap: "30%",
          itemStyle: {
            color: "#4EFEF9",
          },
        },
        {
          name: "出院",
          type: "bar",
          barWidth: "8",
          cursor: "default",
          data: this.data.outData,
          barGap: "30%",
          itemStyle: {
            color: "#4A9AEC",
          },
        },
      ],
    };
    this.myChart.setOption(options);
  }
  // 不用统一修改单位
  formatUnit() {
    let temp: any = [...this.data.inData, ...this.data.outData];
    const max = temp.sort(function (a: any, b: any) {
      return b - a;
    })[0];
    this.checkIsEmpty(temp);
    this.unit = numberTransition(max, 5, "unit");
    this.data.inData.map((item: any) => {
      this.inData.push(numberTransition(item, this.unit, "num"));
    });
    this.data.outData.map((item: any) => {
      this.outData.push(numberTransition(item, this.unit, "num"));
    });
  }
  checkIsEmpty(data: any) {
    let isEmpty = true;
    data.forEach((val: any) => {
      const flag = numberTransition(val, "isEmpty");
      isEmpty = isEmpty ? flag : false;
    });
    this.isEmpty = isEmpty;
  }
}
</script>

<style lang="less" scoped></style>
