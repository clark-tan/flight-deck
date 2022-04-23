<template>
  <div
    class="charts-empty"
    :class="[chartsType[type]]"
    :style="{ 'background-size': size }"
  >
    <div v-if="showText" class="empty-text">{{ text }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class ChartsEmpty extends Vue {
  @Prop({ default: "" }) type?: any; // 类型
  @Prop() size: any;
  @Prop({ default: "当前图表无数据" }) text: any;
  @Prop({ default: true }) showText: any;
  chartsType = {
    singleBar: "single-bar", // 单柱
    moreBar: "more-bar", // 多柱
    sortBar: "sort-bar", // 排序柱（横）预约渠道
    stackBar: "stack-bar", // 堆叠
    singleLine: "single-line", // 单线
    moreLine: "more-line", //多线
    barAndLine: "bar-and-line", //线柱混合
    rosePie: "rose-pie", // 玫瑰饼图
    pie: "pie",

    rankEmpty: "rank-empty", //排行无数据
    ratioPieComplete: "ratio-pie-complete", // 占比达成环形图
    ratioPieUnfinished: "ratio-pie-unfinished", // 占比未达成环形图
    // 住院---手术占比用
    operationRatio1: "operation-ratio1",
    operationRatio2: "operation-ratio2",
    operationRatio3: "operation-ratio3",
  };
}
</script>

<style lang="less" scoped>
.rank-empty {
  background: url("~@/assets/images/empty/rank-empty.png");
}
.ratio-pie-complete {
  background: url("~@/assets/images/empty/charts-ratio-pie-complete.svg");
}
.ratio-pie-unfinished {
  background: url("~@/assets/images/empty/charts-ratio-pie-unfinished.svg");
}

.single-bar {
  background: url("~@/assets/images/empty/charts-single-bar.svg");
}
.more-bar {
  background: url("~@/assets/images/empty/charts-more-bar.svg");
}
.sort-bar {
  background: url("~@/assets/images/empty/charts-sort-bar.svg");
}
.stack-bar {
  background: url("~@/assets/images/empty/charts-stack-bar.svg");
}
.single-line {
  background: url("~@/assets/images/empty/charts-single-line.svg");
}
.more-line {
  background: url("~@/assets/images/empty/charts-more-line.svg");
}
.bar-and-line {
  background: url("~@/assets/images/empty/charts-bar-and-line.svg");
}
.rose-pie {
  background: url("~@/assets/images/empty/charts-rose-pie.svg");
}
.pie {
  background: url("~@/assets/images/empty/charts-pie.svg");
}
.operation-ratio1 {
  background: url("~@/assets/images/empty/charts-operation-ratio1.svg");
}
.operation-ratio2 {
  background: url("~@/assets/images/empty/charts-operation-ratio2.svg");
}
.operation-ratio3 {
  background: url("~@/assets/images/empty/charts-operation-ratio3.svg");
}
.charts-empty {
  height: 100%;
  width: 100%;
  //   margin-top: 10px;
  background-size: 100% 100%;
  background-position: 50%;
  background-repeat: no-repeat;
}
.empty-text {
  width: 136px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid #ffffff;
  border-radius: 2px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  line-height: 32px;
  text-align: center;
  color: #ffffff;
}
</style>
