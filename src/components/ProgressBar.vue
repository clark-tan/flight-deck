<template>
  <div :class="['my-progress', themes]">
    <div class="progress-bg" :style="{ height: bgHeight }">
      <div
        class="progress-bar"
        :style="{ height: barHeight, width: `${barWidth}%` }"
      >
        <div
          class="progress-value"
          ref="values"
          :style="{
            left: offsetLeft,
            right: offsetRight,
            'font-size': barFontSize,
          }"
        >
          <NumberIncrease
            :endVal="data.progressValue"
            :emptyText="emptyText"
            :unit="'%'"
          />
        </div>
      </div>
    </div>
    <div class="progress-text">
      <div class="accumulate textl">
        <span>年累计</span>
        <strong>
          <NumberIncrease
            :endVal="data.accumulatedValue"
            :unit="rackedUpUint"
            :emptyText="emptyText"
            :isPerson="isPerson"
          />
        </strong>
      </div>
      <div class="target textr">
        <span>年目标</span>
        <strong>
          <NumberIncrease
            class="flex-end-align"
            :endVal="data.targetValue"
            :unit="unit"
            :emptyText="emptyText"
            :isPerson="isPerson"
          />
        </strong>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { numberTransition } from "@/utils/NumberTransition";
import NumberIncrease from "@/components/NumberIncrease.vue";
@Component({
  components: {
    NumberIncrease,
  },
})
export default class ProgressBar extends Vue {
  @Prop({ default: "normal" }) themes?: string; // normal：青色 warning：黄色 terrible：红色
  @Prop({ default: "16px" }) bgHeight?: string;
  @Prop({ default: "8px" }) barHeight?: string;
  @Prop({ default: "20px" }) barFontSize?: string;
  @Prop({ default: "- - - -" }) emptyText?: string;
  @Prop({ default: "" }) unit?: string;
  @Prop({ default: "" }) rackedUpUint: any;
  @Prop({ default: 2 }) decimals?: number;
  @Prop({ default: false }) isPerson: any;
  @Prop({
    default: () => {
      return { targetValue: 0, accumulatedValue: 0 };
    },
  })
  data?: any;

  get barWidth() {
    const data = this.data;
    let width: any = data.progressValue;
    width = width && !isNaN(width) ? Number(width) : 0;
    return numberTransition(width, "", "ratio");
  }

  get offsetLeft() {
    if (this.barWidth == null) {
      return "auto";
    }
    let result = `calc(${this.barWidth}% - 30px)`;
    const percent = parseFloat(this.barWidth);
    if (percent < 10) {
      result = "0";
    }
    if (percent > 85) {
      result = "auto";
    }
    return result;
  }

  get offsetRight() {
    return 0;
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.my-progress {
  width: 100%;
  padding-top: 48px !important;
  .progress-bg {
    width: 100%;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    border-radius: 100px;
    position: relative;
  }
  .progress-bar {
    border-radius: 100px;
    width: 0;
    transition: all 0.3s linear;
  }
  .progress-value {
    position: absolute;
    top: -30px;
    font-size: 20px;
    font-weight: bold;
  }
}
.progress-text {
  width: 100%;
  display: flex;
  justify-content: space-between;
  span {
    color: @label-text-color;
  }
  > div {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    strong {
      color: @value-text-color;
      font-weight: normal;
      font-size: 18px;
      i {
        font-style: normal;
        font-size: 16px;
      }
    }
  }
}
.my-progress.normal {
  .progress-bg {
    background: rgba(0, 255, 209, 0.2);
  }
  .progress-bar {
    background: linear-gradient(90deg, rgba(37, 252, 193, 0.1), #25fcc1);
  }
  .progress-value {
    color: rgba(37, 252, 193, 1);
  }
}
.my-progress.warning {
  .progress-bg {
    background: rgba(#faf475, 0.2);
  }
  .progress-bar {
    background: linear-gradient(90deg, rgba(#faf475, 0.1), #faf475);
  }
  .progress-value {
    color: #faf475;
  }
}
.my-progress.terrible {
  .progress-bg {
    background: rgba(220, 75, 70, 0.2);
  }
  .progress-bar {
    background: linear-gradient(90deg, rgba(220, 75, 70, 0.1), #dc4b46);
  }
  .progress-value {
    color: #dc4b46;
  }
}
.textl {
  text-align: left;
}
.textr {
  text-align: right;
}
</style>
