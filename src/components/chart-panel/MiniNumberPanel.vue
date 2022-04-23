<!--
 * @Author: clark tan
 * @Date: 2021-11-09 14:44:24
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-16 16:42:34
 * @Description: 
-->
<template>
  <div :class="['mini-panel', themes]">
    <number-increase
      :startVal="startVal"
      :endVal="endVal"
      :duration="duration"
      :decimals="decimals"
      :color="color"
      :fontSize="fontSize"
      :emptyText="emptyText"
      :isPerson="isPerson"
      :unit="unit"
    />
    <div class="desc">{{ dimension }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NumberIncrease from "@/components/NumberIncrease.vue";

@Component({
  components: {
    NumberIncrease,
  },
})
export default class MiniNumberPanel extends Vue {
  @Prop({ default: 0 }) startVal?: number; // 开始值
  @Prop({ default: null }) endVal?: number; // 目标值
  @Prop({ default: 2000 }) duration?: number; // 动画持续时间
  @Prop({ default: 0 }) decimals?: number;
  @Prop({ default: "#FFFFFF" }) color?: string; // 文字颜色
  @Prop({ default: "36px" }) fontSize?: string; // 文字大小
  @Prop({ default: "当月" }) dimension?: string; // 统计维度、颗粒度
  @Prop({ default: "blue" }) themes?: string; // 背景主题 green：绿色背景
  @Prop({ default: "- - -" }) emptyText?: string; // 暂无数据
  @Prop({ default: false }) isPerson?: string; // 是否是人次类型数据
  @Prop() unit?: string;
}
</script>

<style lang="less" scoped>
.mini-panel {
  width: 148px;
  height: 110px;
  padding-top: 8px;
  text-align: center;
  ::v-deep .numbers {
    line-height: 1;
    justify-content: center;
  }
  .desc {
    color: rgba(255, 255, 255, 0.6);
    padding-top: 10px;
  }
}
.mini-panel.blue {
  background: url(../../assets/images/svg/base-image-blue.svg) no-repeat center
    55px;
  background-size: 110%;
}
.mini-panel.green {
  background: url(../../assets/images/svg/base-image-green.svg) no-repeat center
    55px;
  background-size: 110%;
}
</style>
