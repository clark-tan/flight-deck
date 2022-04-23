<template>
  <div class="amount-panel">
    <div class="title">
      <img v-if="isPerson" src="@/assets/images/svg/icon-ip-num.svg" />
      <img v-else src="@/assets/images/svg/out-income.svg" />
      <span>{{ text.subTitle1 }}</span>
    </div>
    <div class="number-data">
      <div class="number-text-box">
        <NumberIncrease
          class="number-text"
          :color="'#4efef9'"
          :fontSize="'50px'"
          :unitFontSize="'16px'"
          :endVal="panelData.currentValue1"
          :unit="unit"
          :isPerson="isPerson"
        />
      </div>
      <p class="prev-ratio">
        <span
          >{{ text.prevText }}
          <NumberIncrease
            :endVal="panelData.prevValue1"
            :isPerson="isPerson"
            :unit="unit"
            color="rgba(255, 255, 255, 0.9)"
          />
        </span>
        <NumberIncrease
          class="mom"
          :endVal="panelData.ratioValue1"
          :unit="'%'"
          :hasArrow="true"
          :arrowType="panelData.ratioWaring1"
        />
      </p>
      <p class="accumulative">
        年累计
        <NumberIncrease
          :endVal="panelData.totalValue1"
          :isPerson="isPerson"
          :unit="unit"
          color="rgba(255, 255, 255, 0.9)"
        />
      </p>
    </div>
    <div class="title title-2">
      <img v-if="isPerson" src="@/assets/images/svg/icon-ip-num.svg" />
      <img v-else src="@/assets/images/svg/out-income.svg" />
      <span>{{ text.subTitle2 }}</span>
    </div>
    <div class="number-data">
      <div class="number-text-box">
        <NumberIncrease
          class="number-text"
          :color="'#F27834'"
          :endVal="panelData.currentValue2"
          :fontSize="'50px'"
          :unitFontSize="'16px'"
          :unit="unit"
          :isPerson="isPerson"
        />
      </div>
      <p class="prev-ratio">
        <span
          >{{ text.prevText }}
          <NumberIncrease
            :endVal="panelData.prevValue2"
            :isPerson="isPerson"
            :unit="unit"
            color="rgba(255, 255, 255, 0.9)"
          />
        </span>
        <NumberIncrease
          class="mom"
          :endVal="panelData.ratioValue2"
          :unit="'%'"
          :hasArrow="true"
          :arrowType="panelData.ratioWaring2"
        />
      </p>
      <p class="accumulative">
        年累计
        <NumberIncrease
          :endVal="panelData.totalValue2"
          :isPerson="isPerson"
          :unit="unit"
          color="rgba(255, 255, 255, 0.9)"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import PiePanel from "@/components/chart-panel/PiePanel.vue";
import ArrowIcon from "@/components/ArrowIcon.vue";
@Component({
  components: { NumberIncrease, ProgressBar, PiePanel, ArrowIcon },
})
export default class AmountPanel extends Vue {
  @Prop({ default: () => {} }) panelData: any;
  @Prop({
    default: () => {
      return {
        prevText: "上月",
        subTitle1: "门诊收入",
        subTitle2: "急诊收入",
      };
    },
  })
  text: any;
  @Prop({ default: "" }) unit: any;
  @Prop({ default: false }) isPerson: any;
  // get outDynamicData() {
  //   return this.panelData.out_dynamic || [];
  // }
  get emergencyDynamicData() {
    return this.panelData.emergency_dynamic || [];
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
@cycle-btn-color: #42ecee;
@header-text-color: #35bdbe;
@number-text-color: #3ae0e0;
@number-text-color-8: rgba(99, 255, 212, 0.08);
@sub-number-color: #f26334;
.amount-panel {
  height: 100%;
  width: 291px;
  // border-radius: 10px;
  // box-shadow: 0px 1px 4px 0px #59e6bf inset;
  // background: radial-gradient(rgb(0 0 0 / 15%), rgb(67 255 203 / 15%));
  font-size: 24px;
  padding: 0;
  > div {
    padding: 0 24px;
  }
  // .title:first-child {
  //   background: radial-gradient(@number-text-color-8, rgba(67, 255, 203, 0.08));
  //   border: 1px solid @number-text-color-8;
  //   border-radius: 10px 10px 0px 0px;
  //   box-shadow: 0px 1px 4px 0px rgb(89 230 191 / 8%) inset;
  // }
  .title {
    padding: 0 24px 0 14px;
    display: grid;
    grid: auto / 40px auto;
    align-items: center;
    height: 56px;
    line-height: 56px;
    font-size: 36px;
    > img {
      width: 40px;
    }
    .date-tips {
      top: -15px;
      font-size: 20px;
      position: relative;
      background: red;
      border-radius: 10px;
      padding: 0px 4px;
      top: -6px;
      left: 3px;
    }
    > span:last-child {
      font-size: 18px;
    }
  }
  .number-text-box {
    display: flex;
    align-items: center;
    height: 75px;
    > span {
      transform: translateY(12px);
      margin-left: 8px;
      font-size: 16px;
    }
    ::v-deep .unit {
      margin-left: 4px;
    }
  }
  .title-2 {
    margin-top: 42px;
    .number-data {
      > .number-text {
        color: @number-text-color !important;
      }
    }
  }
  .target {
    padding-top: 24px;
    ::v-deep .ant-progress-text {
      font-size: 24px;
      top: -42px;
    }
  }
  .target-data {
    font-size: 20px;
  }
}
.prev-ratio {
  display: flex;
  opacity: 0.9;
  font-size: 18px;
  font-weight: 400;
  .mom {
    color: #fff;
    opacity: 0.9;
  }
  > span:first-child {
    display: flex;
    align-items: center;
    flex: 1;
    // opacity: 0.6;
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    text-align: left;
    ::v-deep .numbers {
      margin-left: 4px;
    }
    > span {
      // opacity: 0.9;
      margin-left: 4px;
      color: rgba(255, 255, 255, 0.8);
      &:not(.num-unit) {
        font-size: 18px;
      }
    }
  }
  img {
    margin: 6px 0;
  }
}
.accumulative {
  // opacity: 0.6;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
  ::v-deep .numbers {
    margin-left: 4px;
  }
  > span {
    // opacity: 0.9;
    color: rgba(255, 255, 255, 0.8);
    font-size: 18px;
    margin-left: 4px;
  }
}
</style>
