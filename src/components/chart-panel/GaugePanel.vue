<template>
  <div class="gauge-group" ref="myChart"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts";

@Component({
  components: {},
})
export default class GaugePanel extends Vue {
  myChart: any = null;
  colorList: any = {
    normal: ["#25fcc1", "rgba(255, 255, 255, 0.5)"],
    warnning: ["#faf475", "rgba(255, 255, 255, 0.5)"],
    terrible: ["#dc4b46", "rgba(255, 255, 255, 0.5)"],
  };
  @Prop({ default: true }) isShowPointer?: boolean; // 是否显示指针
  @Prop({ default: true }) isShowLegend?: boolean; // 是否显示标题和值
  @Prop({ default: "55%" }) radius?: any; // 圆环大小
  @Prop({
    default: () => [],
  })
  data: any;
  @Prop({ default: () => ["50%", "30%"] }) center: any;
  @Prop({ default: "rgba(37,252,193,0.1)" }) bgColor?: string; // 环默认背景色

  @Prop({ default: "normal" })
  progressColor!: string; // 环进度条颜色 'normal' 'warnning' 'terrible'

  @Prop({
    default: () => [
      ["-80%", "150%"],
      ["80%", "150%"],
    ],
  })
  labelPosition?: any; // 标题位置

  @Prop({
    default: () => [
      ["-80%", "190%"],
      ["80%", "190%"],
    ],
  })
  valuePosition?: any; // 值位置

  @Watch("data")
  updateChart() {
    if (this.data && this.data.length) {
      this.initChart();
    }
  }

  mounted() {
    if (this.data && this.data.length) {
      this.initChart();
    }
  }

  initChart() {
    if (this.myChart !== null) {
      this.myChart.clear();
      this.myChart.dispose();
    }
    this.myChart = echarts.init(this.$refs["myChart"] as HTMLElement);
    this.formmatData();
    this.setOption();
    window.addEventListener("resize", this.myChart.resize);
  }
  setOption() {
    const option = {
      color: this.colorList[this.progressColor],
      series: [
        {
          type: "gauge",
          center: this.center,
          radius: this.radius,
          startAngle: 90,
          endAngle: -270,
          progress: {
            show: true,
            width: 8,
            roundCap: true,
            overlap: false, // 多组数据双环展示
          },
          axisLine: {
            lineStyle: {
              width: 14,
              color: [[1, this.bgColor]],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          anchor: {
            show: this.isShowPointer,
            showAbove: true,
            size: 12,
            itemStyle: {
              borderWidth: 4,
              color: "#093246",
              borderColor: this.colorList[this.progressColor][0],
            },
          },
          pointer: {
            show: this.isShowPointer,
            length: "90%",
            width: 3,
          },
          title: {
            show: this.isShowLegend,
            fontSize: 16,
            color: "inherit",
          },
          detail: {
            show: this.isShowLegend,
            valueAnimation: true,
            fontSize: 16,
            formatter: "{value}%",
            color: "inherit",
          },
          data: this.data,
        },
      ],
    };
    this.myChart.setOption(option);
  }
  // 格式化数据
  formmatData() {
    this.data.map((item: any, index: any) => {
      item.name = item.label || item.name;
      item.value = item.value * 100;
      item.detail = {
        offsetCenter: this.valuePosition[index],
        valueAnimation: true,
      };
      item.title = {
        offsetCenter: this.labelPosition[index],
        color: this.colorList[this.progressColor][index],
      };
      return item;
    });
  }
}
</script>

<style lang="less" scoped>
.gauge-group {
  width: 100%;
  height: 350px;
  position: relative;
}
</style>
