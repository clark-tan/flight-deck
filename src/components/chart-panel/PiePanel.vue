<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:56:59
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-08 15:12:36
 * @Description: 饼图/玫瑰图
-->
<template>
  <div class="e-charts-box">
    <div v-if="!isEmpty" ref="myChart" class="pie-chart"></div>
    <ChartsEmpty v-else :type="emptyType" :size="size" :showText="showText" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import { numberTransition } from "@/utils/NumberTransition";
import { formatThousand } from "@/utils/Common";
import * as echarts from "echarts";

@Component({
  components: { ChartsEmpty },
})
export default class PiePanel extends Vue {
  myChart: any = null;
  isEmpty: any = false;

  @Prop({ default: false }) roseType?: boolean; // 是否展示成玫瑰图

  @Prop({ default: () => ["36%", "55%"] }) radius?: any; // 饼图占容器比例

  @Prop({ default: () => ["30%", "50%"] }) center?: any;

  @Prop({ default: true }) isShowLegend?: boolean;
  @Prop({ default: false }) isShowLabel?: boolean;
  @Prop({ default: false }) isRatio?: boolean;
  @Prop({ default: "rosePie" }) emptyType: any;
  @Prop() labelTextStyle: any;
  @Prop({ default: () => {} }) labelLine: any;
  @Prop() size: any;
  @Prop() showText: any;
  @Prop({
    default: () => [
      "#35BDBE",
      "#FAF475",
      "#E3742B",
      "#DC4B46",
      "#FB76C4",
      "#B568FF",
      "#3A41D9",
      "#6986F2",
      "#65EDCE",
      "#FFFDCC",
      "#FFAC75",
      "#69BEF2",
      "#30AAFF",
    ],
  })
  color?: any;

  @Prop({
    default: () => [],
  })
  data: any; // 饼图数据

  @Watch("data")
  updateChart() {
    this.initChart();
  }
  mounted() {
    this.initChart();
  }
  initChart() {
    if (this.myChart !== null) {
      this.myChart.clear();
      this.myChart.dispose();
      window.removeEventListener("resize", this.myChart.resize);
    }
    this.formmatData();
    if (!this.isEmpty) {
      this.$nextTick(() => {
        this.myChart = echarts.init(this.$refs["myChart"] as HTMLElement);
        this.setOption();
        window.addEventListener("resize", this.myChart.resize);
      });
    }
  }

  setOption() {
    const color = this.color;
    const option = {
      color: color,
      tooltip: {
        trigger: "item",
        className: "echarts-tooltip-dark",
        padding: [12, 15],
        textStyle: {
          color: "#fff",
        },
        formatter: (params: any) => {
          if (!this.isRatio) {
            const temp = numberTransition(
              params.value,
              {
                isPerson: true,
              },
              "-"
            );
            return temp == null
              ? "-"
              : `${params.marker} ${params.name}  ${formatThousand(temp.num)}${
                  temp.unit
                }`;
          }
          return `${params.marker} ${params.name}  ${(
            params.value * 100
          ).toFixed(2)}%`;
        },
      },
      legend: {
        show: this.isShowLegend,
        // selectedMode: false,
        icon: "circle",
        position: "right",
        layout: "horizontal",
        width: 100,
        right: 10,
        top: "center",
        itemSize: 8,
        itemWidth: 8,
        itemHeight: 8,
        itemStyle: {
          borderWidth: 0,
        },
        textStyle: {
          color: "#fff",
          fontSize: 14,
          rich: {
            name: {
              width: 100,
            },
            valueTitle: {
              width: 50,
              align: "right",
            },
          },
        },
        tooltip: {
          show: true,
        },
        formatter: (name: any) => {
          const itemValueArr = this.data.filter((el: any) => el.name == name);
          let newName = name;
          const _echarts: any = echarts;
          newName = _echarts.format.truncateText(newName, 95, "", "...");
          return `{name|${newName}}   {valueTitle|${(
            parseFloat(itemValueArr[0].value) * 100
          ).toFixed(2)}%}`;
        },
      },
      series: [
        {
          type: "pie",
          radius: this.radius,
          center: this.center,
          roseType: this.roseType,
          startAngle: 90,
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "rgba(0,0,0,0.1)",
            borderWidth: 3,
            opacity: 0.8,
          },
          label: {
            show: this.isShowLabel,
            position: "outer",
            formatter: (item: any) => {
              return `${item.percent.toFixed(2)}%\n${item.data.name}`;
            },
            color: "#fff",
            textStyle: this.labelTextStyle,
          },
          labelLine: this.labelLine,
          data: this.data,
        },
      ],
    };
    this.myChart.setOption(option);
  }
  // 格式化数据
  formmatData() {
    let isEmpty = true;
    this.data.map((item: any) => {
      item.name = item.label || item.name;
      // item.value = item.value * 100;
      const flag = numberTransition(item.value, "isEmpty");
      isEmpty = isEmpty ? flag : false;
      return item;
    });
    this.isEmpty = isEmpty;
  }
}
</script>

<style lang="less" scoped>
.pie-chart {
  width: 100%;
  height: 100%;
}
</style>
