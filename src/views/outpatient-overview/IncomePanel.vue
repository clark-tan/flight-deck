<template>
  <div
    class="
      map-panel
      pointer-events-none
      common-animation-opacity common-animation-opacity-leave
    "
  >
    <div class="panel-box pointer-events-none" ref="panelBox">
      <NumberPanel
        class="panel-a"
        :data="panelData"
        :cssType="'card'"
        :isPerson="!isIncome"
        :progressThemes="panelData.themes < 0 ? 'terrible' : 'normal'"
      >
        <PiePanel
          slot="pieChart"
          :data="pieData"
          :emptyType="'pie'"
          :showText="false"
          :labelLine="{
            length: 5,
            length2: 8,
          }"
          :labelTextStyle="{
            fontSize: 11,
          }"
          :radius="['20%', '35%']"
          :center="['50%', '50%']"
          style="
            height: 120px;
            width: 160px;
            position: absolute;
            top: 0;
            right: 0;
          "
          :isShowLabel="true"
          :isShowLegend="false"
          :color="['#4EFEF9', '#F26334']"
        />
        <span slot="footerLabel" class="change-btn" @click="activeChange">
          <img src="@/assets/images/svg/out-tab-change.svg" />
          {{ tab[activeKey].btn }}</span
        >
      </NumberPanel>
    </div>
    <div
      class="sub-panel-box"
      :class="[!subPanelShow && 'sub-panel-box-change']"
    >
      <SubAmountPanel
        class="sub-panel pointer-events-none"
        :text="tab[activeKey]"
        :isPerson="!isIncome"
        :panelData="subPanelData"
      />
    </div>
    <svg class="svg-line pointer-events-none" width="245px" height="35px">
      <g>
        <path
          :class="svgPathShow ? 'stroke-show' : 'stroke-hide'"
          d="M0 35 L10 15 L215 15"
          stroke-width="2"
          fill="transparent"
          stroke="rgba(255,255,255, 0.6)"
        />
      </g>
    </svg>
    <i
      class="circle pointer-events-none"
      :class="[!subPanelShow && 'common-animation-opacity-leave']"
    ></i>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import NumberPanel from "@/components/chart-panel/NumberPanel.vue";
import SubAmountPanel from "@/components/SubAmountPanel.vue";
import PiePanel from "@/components/chart-panel/PiePanel.vue";
import { PageCode } from "@/store/page-code";
import TimerMixins from "@/mixins/timerMixins";
import { AppConfigModule } from "@/store/app-config";
@Component({
  components: { NumberPanel, SubAmountPanel, PiePanel },
  mixins: [TimerMixins],
})
export default class IncomePanel extends Vue {
  PageCode = PageCode;
  viewData: any = { pieData: [] };
  viewDataB: any = { pieData: [] };
  delayTime: any = 40000;
  tab: any = {
    key_1: {
      btn: "门急诊总人次",
      title: "门急诊总收入",
      prevText: "上月",
      subTitle1: "门诊收入",
      subTitle2: "急诊收入",
    },
    key_2: {
      btn: "门急诊总收入",
      title: "门急诊总人次",
      prevText: "上月",
      subTitle1: "门诊人次",
      subTitle2: "急诊人次",
    },
  };
  svgPathShow: any = false;
  subPanelShow: any = false;
  activeKey: any = "key_1";

  incomeCodes: any = [
    "MONTH_OP_ET_INCOME",
    "MOM_OP_ET_INCOME",
    "YEAR_OP_ET_INCOME",
    "YEAR_OP_ET_INCOME_TARGET",
    "YEAR_OP_ET_INCOME_WARNING",
    "YEAR_OP_ET_INCOME_TARGET_YIELD_RATIO",
    "MOM_OP_ET_INCOME_WARNING",
  ];
  incomeSubCodes: any = [
    "MONTH_OP_INCOME",
    "MONTH_ET_INCOME",
    "MOM_OP_INCOME",
    "MOM_ET_INCOME",
    "YEAR_OP_INCOME",
    "YEAR_ET_INCOME",
    "MOM_OP_INCOME_WARNING",
    "MOM_ET_INCOME_WARNING",
  ];
  personsCodes: any = [
    "MONTH_OP_ET_PERSONS",
    "MOM_OP_ET_PERSONS",
    "YEAR_OP_ET_PERSONS",
    "YEAR_OP_ET_PERSONS_TARGET",
    "YEAR_OP_ET_PERSONS_WARNING",
    "YEAR_OP_ET_PERSONS_TARGET_YIELD_RATIO",
    "MOM_OP_ET_PERSONS_WARNING",
  ];
  personsSubCodes: any = [
    "MONTH_OP_PERSONS",
    "MONTH_ET_PERSONS",
    "MOM_OP_PERSONS",
    "MOM_ET_PERSONS",
    "YEAR_OP_PERSONS",
    "YEAR_ET_PERSONS",
    "MOM_OP_PERSONS_WARNING",
    "MOM_ET_PERSONS_WARNING",
  ];
  get pageData() {
    return this.PageCode.pageData;
  }
  get panelCode() {
    if (this.isIncome) {
      return this.incomeCodes;
    }
    return this.personsCodes;
  }
  get subPanelCode() {
    if (this.isIncome) {
      return this.incomeSubCodes;
    }
    return this.personsSubCodes;
  }
  get panelData() {
    const data = this.pageData;
    const codes = this.panelCode;
    const mainValue = data[codes[0]] || [];
    return {
      itemName: this.tab[this.activeKey].title, // 门急诊总人次
      dimension: "当月",
      itemValue: mainValue[1],
      preDimension: "上月",
      prePeriodValue: mainValue[0],
      momValue: data[codes[1]],
      accumulatedValue: data[codes[2]],
      targetValue: data[codes[3]],
      progressValue: data[codes[5]],
      themes: data[codes[4]],
      ratioWaring: data[codes[6]],
    };
  }
  get currentData() {
    const data = this.pageData;
    const codes = this.subPanelCode;
    const mainValue1 = data[codes[0]];
    const mainValue2 = data[codes[1]];
    return {
      list1: this.getStatisticsValue(mainValue1),
      list2: this.getStatisticsValue(mainValue2),
    };
  }
  get pieData() {
    const data = this.currentData;
    return [
      {
        name: "门诊",
        value: data.list1[1],
      },
      {
        name: "急诊",
        value: data.list2[1],
      },
    ];
  }
  get subPanelData() {
    const data = this.pageData;
    const codes = this.subPanelCode;
    const mainData = this.currentData;
    return {
      currentValue1: mainData.list1[1],
      prevValue1: mainData.list1[0],
      ratioValue1: data[codes[2]],
      ratioWaring1: data[codes[6]],
      totalValue1: data[codes[4]],

      currentValue2: mainData.list2[1],
      prevValue2: mainData.list2[0],
      ratioValue2: data[codes[3]],
      ratioWaring2: data[codes[7]],
      totalValue2: data[codes[5]],
    };
  }
  @Watch("timerChange")
  timerChangeChange() {
    this.activeChange();
  }
  get isIncome() {
    return this.activeKey === "key_1";
  }
  async mounted() {
    const delayTime = AppConfigModule.commonConfig.rotateTime;
    if (delayTime) {
      this.delayTime = delayTime;
    }
    await this.getViewData();
    this.initView();
  }
  getViewData() {
    const panelCodes = this.incomeCodes.concat(this.personsCodes);
    const subPanelCodes = this.incomeSubCodes.concat(this.personsSubCodes);
    const codes = panelCodes.concat(subPanelCodes);
    PageCode.setCurrentPageCodes(codes);
    PageCode.getCodeData(codes);
  }
  // 定时器
  timeOut(callback: any, time: any) {
    const dateTime = Date.now();
    const run: any = () => {
      requestAnimationFrame(() => {
        const newTime = Date.now();
        if (newTime - dateTime >= time) {
          callback();
        } else {
          run();
        }
      });
    };
    run();
  }
  async activeChange() {
    const _this: any = this;
    const panelBox: any = this.$refs.panelBox;
    _this.clearTimer();
    // 改变activeKey并且添加动画class
    if (this.isIncome) {
      this.activeKey = "key_2";
      panelBox.classList.remove("flip-vertical-right-360");
      panelBox.classList.add("flip-vertical-right-180");
    } else {
      this.activeKey = "key_1";
      panelBox.classList.add("flip-vertical-right-360");
      panelBox.classList.remove("flip-vertical-right-180");
    }
    this.svgPathShow = false;
    this.subPanelShow = false;
    await this.initView();
    this.$emit("activeChange", this.activeKey);
    _this.TimerRun();
  }
  async initView() {
    this.timeOut(async () => {
      this.svgPathShow = true;
      this.timeOut(() => {
        this.subPanelShow = true;
      }, 300);
    }, 500);
  }
  getStatisticsValue(data: any) {
    if (data) {
      const item1 = data[data.length - 1] || {};
      const item2 = data[data.length - 2] || {};
      return [item2.statisticsValue, item1.statisticsValue];
    }
    return [];
  }
}
</script>

<style lang="less" scoped>
@map-width: 481px;
@svg-top: 100px;
@svg-width: 235px;
@bg-padding: 120px;
@panel-padding: 55px;
.map-panel {
  color: #fff;
  width: @map-width;
  .sub-panel {
    width: 305px;
    height: 460px;
  }
  .sub-panel-box {
    position: absolute;
    left: calc(@map-width + 62px);
    width: 396px;
    height: 525px;
    background: url("../../assets/images/svg/bg-panel/bg-panel-mini.svg")
      no-repeat;
    background-size: 105%;
    padding: @panel-padding;
    top: 35px;
    transform: scale(1);
    transition: transform 300ms cubic-bezier(0.39, 0.575, 0.565, 1);
    transform-origin: @panel-padding @panel-padding;
    overflow: hidden;
  }
  .sub-panel-box-change {
    opacity: 0;
    padding: 0;
    transform: scale(0);
  }
  .svg-line {
    position: absolute;
    top: @svg-top;
    left: calc(@map-width - 85px);
    width: @svg-width;
    path {
      stroke-dashoffset: 1000;
    }
  }
  .circle {
    width: 8px;
    height: 8px;
    opacity: 0.9;
    background: #ffffff;
    border-radius: 50%;
    position: absolute;
    top: @svg-top + 11px;
    left: calc(@map-width + @svg-width - 112px);
    box-shadow: 0 0 8px 3px #fff;
    transition: opacity 0.3s ease-in-out;
  }
  .common-animation-opacity-leave {
    opacity: 0;
  }
}
.map-panel {
  ::v-deep .number-panel.card {
    height: 460px;
  }
  .change-btn {
    position: absolute;
    bottom: -23px;
    //此处使用的svg图片需要在svg标签上加上 preserveAspectRatio="none meet" 属性，横纵才能兼容
    background: url("~@/assets/images/svg/change-base-icon.svg") no-repeat;
    background-size: 100% 100%;
    width: 154px;
    height: 25px;
    right: 3px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
    z-index: 100;
    pointer-events: auto;
    > img {
      width: 14px;
      margin-top: -2px;
      margin-right: 8px;
    }
  }
  ::v-deep .panel-content > .number-box {
    height: 120px;
    line-height: 120px;
    > .flex-left {
      flex: 1;
    }
    .numbers {
      font-size: 58px !important;
    }
  }
}
.panel-box {
  position: relative;
  ::v-deep .number-panel .panel-content .last-term {
    height: 30px;
  }
  ::v-deep .charts-empty.pie {
    background-size: 100px 56px;
    background-position-x: 48px;
  }
  ::v-deep .e-charts-box {
    pointer-events: auto;
  }
}
</style>
