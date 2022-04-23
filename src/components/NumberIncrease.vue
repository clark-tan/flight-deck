<template>
  <div class="numbers" :style="{ color, 'font-size': fontSize }">
    <template v-if="!isEmpty">
      <template v-if="hasAnimation">
        <countTo
          :startVal="startVal"
          :endVal="numVal"
          :duration="2000"
          :decimals="numDecimals"
          :suffix="suffix"
        ></countTo>
      </template>
      <template v-else>
        <span>{{ numVal }}</span>
      </template>
      <span
        :style="{ unitColor, 'font-size': unitFontSize }"
        :class="[unitFontSize && 'has-font-size']"
        class="unit"
        >{{ newUnit }}</span
      ><arrow-icon
        v-if="hasArrow"
        class="arrow-icon"
        :arrowType="arrowType"
        :momValue="numVal"
      />
    </template>
    <template v-else>
      <div class="empty">{{ emptyText }}</div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import countTo from "vue-count-to";
import { numberTransition } from "@/utils/NumberTransition";
import ArrowIcon from "@/components/ArrowIcon.vue";
//endVal && endVal.toString().split('.')[1] ? decimals : 0
@Component({
  components: {
    countTo,
    ArrowIcon,
  },
})
export default class NumberIncrease extends Vue {
  @Prop({ default: 0 }) startVal?: any; // 开始值
  @Prop({ default: null }) endVal?: any; // 目标值
  @Prop({ default: 2000 }) duration?: number; // 动画持续时间
  @Prop({ default: 2 }) decimals?: number; // 小数位数
  @Prop({ default: "" }) color?: string; // 文字颜色
  @Prop({ default: "" }) fontSize?: string; // 文字大小
  @Prop({ default: "- - - -" }) emptyText?: string; // 空状态文案
  @Prop({ default: "" }) suffix?: string; // 后缀
  @Prop({ default: false }) isPerson: any; // 人次小数展示
  @Prop({ default: true }) hasAnimation: any; // 有动画
  @Prop({ default: "" }) numType?: string; // 转换类型（暂未使用）

  @Prop({ default: "" }) unit?: string; // 单位
  @Prop({ default: "" }) unitFontSize?: string; // 单位字体大小
  @Prop({ default: "" }) unitColor?: string; // 单位颜色
  @Prop({ default: false }) hasArrow: any; // 人次小数展示
  @Prop() arrowType: any; // 箭头类型，

  get isEmpty() {
    return numberTransition(this.endVal, "isEmpty");
  }

  get numVal() {
    const isPerson = this.isPerson;
    let newNum = this.endVal;
    if (this.unit) {
      switch (this.unit) {
        case "%":
          newNum = numberTransition(this.endVal, "ratio");
          break;
        default:
          newNum = numberTransition(
            this.endVal,
            this.unit,
            isPerson ? "integer" : "num"
          );
      }
      const decimals = this.decimals;
      const val = numberTransition(
        newNum,
        this.unit,
        isPerson,
        decimals,
        "toFixed"
      );
      return val - 0;
    } else {
      const { num } = numberTransition(newNum, { isPerson: isPerson }, "-");
      return num - 0;
    }
  }
  get newUnit() {
    const isPerson = this.isPerson;
    if (this.unit) {
      return this.unit;
    } else {
      const { unit } = numberTransition(
        this.endVal,
        { isPerson: isPerson },
        "-"
      );
      return unit;
    }
  }
  get numDecimals() {
    if (this.isPerson && !this.newUnit) {
      return 0;
    } else {
      return this.decimals;
    }
  }
}
</script>

<style lang="less" scoped>
.empty {
  color: rgba(255, 255, 255, 0.5);
}
.numbers {
  display: flex;
  align-items: baseline;
  white-space: nowrap;
}
.unit {
  display: inline-block;
  transform: scale(0.8);
  // margin-left: 4px;
  position: relative;
  &.has-font-size {
    transform: scale(1);
  }
}
</style>
