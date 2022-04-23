<template>
  <div class="my-gauge" ref="myChart"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
const echarts = require("echarts");

@Component({
  components: {},
})
export default class MyGuage extends Vue {
  myChart: any = null;

  @Prop({ default: "55%" }) radius?: any; // 圆环大小
  @Prop({ default: () => [] }) data: any;
  @Prop({ default: () => ["50%", "30%"] }) center: any;
  @Prop({ default: "rgba(78,254,249,0.15)" }) bgColor?: string; // 环默认背景色

  @Prop({ default: "#4EFEF9" }) progressColor?: any; // 环进度条颜色

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
    }
    this.myChart = echarts.init(this.$refs["myChart"]);
    this.formmatData();
    this.setOption();
    window.addEventListener("resize", this.myChart.resize);
  }
  setOption() {
    const option = {
      color: [this.progressColor],
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          center: this.center,
          radius: this.radius,
          progress: {
            show: true,
            width: 8,
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: [[1, "rgba(78,254,249,0.15)"]],
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
            show: false,
          },
          pointer: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            show: false,
            valueAnimation: true,
            fontSize: 18,
            fontWeight: "200",
            fontFamily: "DINAlternate",
            offsetCenter: [0, "0"],
            color: "#FFFFFF",
            formatter: "{value}%",
          },
          data: this.data,
        },
      ],
    };
    this.myChart.setOption(option);
  }
  // 格式化数据
  formmatData() {
    this.data.map((item: any) => {
      item.name = item.label;
      item.value = item.value * 100;
      return item;
    });
  }
}
</script>

<style lang="less" scoped>
.my-gauge {
  width: 100%;
  height: 100px;
  position: relative;
}
</style>
