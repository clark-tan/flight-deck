<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:56:59
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-22 17:50:39
 * @Description: 数字看板
-->
<template>
  <div :class="['number-panel', cssType]" v-if="data">
    <div class="panel-title">
      <strong>
        {{ data.itemName }}
        <span>{{ data.dimension }}</span>
      </strong>
    </div>
    <div class="panel-content">
      <div class="number-box">
        <div class="flex-left">
          <number-increase
            v-if="data.itemValue !== undefined"
            :endVal="data.itemValue"
            :color="cssType == 'card' ? '#25FCC1' : '#4A9AEC'"
            :fontSize="cssType == 'card' ? '80px' : '56px'"
            :unit="data.unit"
            :unitFontSize="'22px'"
            :isPerson="isPerson"
          />
        </div>
        <div>
          <slot name="pieChart" />
        </div>
      </div>

      <div class="last-term">
        <div>
          <span>{{ data.preDimension }}</span>
          <NumberIncrease
            class="last-value"
            :endVal="data.prePeriodValue"
            :unit="data.unit"
            :isPerson="isPerson"
          />
        </div>
        <div class="flex-box">
          <NumberIncrease
            class="mom"
            :endVal="data.momValue"
            :color="'rgba(255,255,255,0.9)'"
            :unit="'%'"
            :hasArrow="true"
            :arrowType="data.ratioWaring"
          />
        </div>
      </div>
      <progress-bar
        :data="{
          targetValue: data.targetValue,
          accumulatedValue: data.accumulatedValue,
          progressValue: data.progressValue,
        }"
        :themes="progressThemes"
        :barFontSize="'24px'"
        :unit="progressUnit"
        :rackedUpUint="data.rackedUpUint"
        :decimals="progressDecimals"
        :isPerson="isPerson"
      />
      <slot name="footerLabel" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ProgressBar from "@/components/ProgressBar.vue";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ArrowIcon from "@/components/ArrowIcon.vue";
import { numberTransition } from "@/utils/NumberTransition";

@Component({
  components: {
    ProgressBar,
    NumberIncrease,
    ArrowIcon,
  },
})
export default class NumberPanel extends Vue {
  @Prop({ default: "normal" }) cssType?: string; //normal：无背景样式  card：卡片样式
  @Prop({ default: "normal" }) themes?: string; //  normal： 青色 带边框背景
  @Prop({ default: 2 }) progressDecimals?: number;
  @Prop({ default: "" }) progressUnit: any;
  @Prop({ default: false }) isPerson: any;
  @Prop({ default: "normal" }) progressThemes?: string; // normal：青色  error：红色 warning：黄色

  @Prop({
    default: () => {
      return {};
    },
  })
  data?: any;

  get momPercent() {
    const val = numberTransition(this.data.momValue, "", "ratio");
    return isNaN(val) || typeof val !== "number"
      ? null //Math.abs
      : val;
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.flex-box {
  display: flex;
  align-items: center;
  ::v-deep img {
    width: 16px;
    height: 16px;
  }
}
.number-panel {
  border-radius: 10px;
  position: relative;
  z-index: 99;
  .panel-title {
    padding: 0 24px;
    strong {
      color: @menu-title-color;
      font-size: 24px;
      font-weight: normal;
      position: relative;
    }
    span {
      width: 60px;
      height: 30px;
      line-height: 28px;
      background: rgba(67, 210, 255, 0.2);
      border-radius: 18px;
      font-size: 20px;
      color: @primary-blue-color;
      position: absolute;
      text-align: center;
      right: -64px;
      top: -10px;
    }
  }

  .panel-content {
    padding: 0 24px;
    position: relative;
    ::v-deep .my-progress {
      padding-top: 0 !important;
    }
    .number-box {
      display: flex;
      align-items: baseline;
      color: #4a9aec;
      font-size: 16px;
      .flex-left {
        display: flex;
        align-items: baseline;
        ::v-deep .unit {
          margin-left: 4px;
        }
      }
    }
    .last-term {
      display: flex;
      justify-content: space-between;
      color: @label-text-color;
      margin-bottom: 44px;
      font-size: 16px;
      > div {
        display: flex;
        align-items: center;
      }
      span {
        margin-right: 8px;
        line-height: 1;
      }
      span.mom {
        margin-right: 4px;
        color: @value-text-color;
      }
      .last-value {
        font-size: 18px;
        margin-right: 0;
        color: @value-text-color;
      }
    }
  }
}
.number-panel.card {
  width: 100%;
  height: 440px;
  background: url("../../assets/images/svg/bg-panel/bg-panel-main.svg")
    no-repeat center;
  background-size: cover;
  padding: 30px 10px;

  .panel-title {
    height: 68px;
    display: flex;
    align-items: center;
    strong {
      font-size: 36px;
    }
    span {
      background: rgba(242, 99, 52, 0.7);
      color: rgba(255, 255, 255, 0.7);
      top: -2px;
    }
  }
  .panel-content {
    padding-bottom: 16px;
    .number-box {
      color: #25fcc1;
    }
    .last-term {
      font-size: 20px;
      .last-value {
        font-size: 22px;
      }
    }
    ::v-deep .progress-text {
      > div {
        font-size: 20px;
      }
    }
  }
}
::v-deep .progress-text {
  > div {
    strong {
      font-weight: normal;
      font-size: 22px;
      i {
        font-style: normal;
        font-size: 20px;
      }
    }
  }
}
</style>
