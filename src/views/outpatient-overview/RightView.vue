<template>
  <DisplayPanel
    class="right-view"
    :text="'服务流程'"
    :iconName="'icon-service'"
  >
    <div class="persongs-statistics">
      <div class="appointment">
        <p>预约人次<a-badge count="当月" /></p>
        <p class="persons-num">
          <NumberIncrease
            :endVal="reservePersons"
            :emptyText="'- - -'"
            :unitFontSize="'14px'"
            :color="'rgba(255,255,255,0.9)'"
            :isPerson="true"
          />
        </p>
        <p class="add-up">
          年累计
          <NumberIncrease
            :endVal="pageData.YEAR_RESERVE_PERSONS"
            :emptyText="'- - -'"
            :color="'rgba(255,255,255,0.8)'"
            :isPerson="true"
          />
        </p>
      </div>
      <div class="back-number">
        <p>退号人次<a-badge count="当月" /></p>
        <p class="persons-num">
          <NumberIncrease
            :endVal="pageData.MONTH_WITHDRAW_PERSONS"
            :emptyText="'- - -'"
            :unitFontSize="'14px'"
            :color="'rgba(255,255,255,0.9)'"
            :isPerson="true"
          />
        </p>
        <p class="add-up">
          年累计
          <NumberIncrease
            :endVal="pageData.YEAR_WITHDRAW_PERSONS"
            :emptyText="'- - -'"
            :color="'rgba(255,255,255,0.8)'"
            :isPerson="true"
          />
        </p>
      </div>
    </div>
    <div class="charts-box">
      <a-tabs v-model="activeTabKey" @change="tabActiveChange">
        <a-tab-pane
          v-for="item in tabList"
          :tab="item.label"
          :key="`${item.value}`"
          :name="item.value"
        ></a-tab-pane>
      </a-tabs>
      <MultiLine
        style="height: 230px"
        :data="chartData"
        :showLegend="false"
        :showMark="true"
        :showYAxis="true"
        :guideValue="guideValue"
        :emptyType="'moreLine'"
        :yAxisName="activeTabKey === 'key_2' ? '预约率' : '人次'"
        labelPosition="end"
        :isRadio="activeTabKey === 'key_2'"
        @echartHover="openOrcloseTimer"
      />
    </div>
    <div class="appointment-chart">
      <SubTitle :title="'预约渠道'" />
      <SortBarPanel class="progress-item-list" :chartData="chartRatio" />
    </div>
    <div class="doctor-chart">
      <SubTitle :title="'挂号类型'" />
      <PiePanel
        style="height: 176px"
        :roseType="doctorChartData && doctorChartData.length > 5 ? true : false"
        :isRatio="true"
        :radius="['40%', '75%']"
        :center="['30%', '50%']"
        :data="doctorChartData"
        :color="[
          '#61FDFF',
          '#FAF475',
          '#E3742B',
          '#DC4B46',
          '#B568FF',
          '#00BF8F',
          '#4A9AEC',
        ]"
      />
    </div>
  </DisplayPanel>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DisplayPanel from "@/components/DisplayPanel.vue";
import PiePanel from "@/components/chart-panel/PiePanel.vue";
import SubTitle from "@/components/smaller-module/SubTitle.vue";
import TimerMixins from "@/mixins/timerMixins";
import MultiLine from "@/components/chart-panel/MultiLine.vue";
import NumberIncrease from "@/components/NumberIncrease.vue";
import SortBarPanel from "@/components/chart-panel/SortBarPanel.vue";
import { numberTransition } from "@/utils/NumberTransition";
import { PageCode } from "@/store/page-code";
@Component({
  components: {
    DisplayPanel,
    PiePanel,
    SubTitle,
    MultiLine,
    NumberIncrease,
    SortBarPanel,
  },
  mixins: [TimerMixins],
})
export default class RightView extends Vue {
  PageCode = PageCode;
  activeTabKey = "key_1";
  tabList = [
    {
      label: "预约人次趋势",
      value: "key_1",
    },
    {
      label: "预约率趋势",
      value: "key_2",
    },
  ];

  codes: any = [
    // "MONTH_RESERVE_PERSONS", // 月预约人次
    "YEAR_RESERVE_PERSONS", // 预约累计人次
    "MONTH_WITHDRAW_PERSONS", // 月退号人次
    "YEAR_WITHDRAW_PERSONS", //退号人次累计
    "MONTH_RESERVE_WAY_PERSONS_RATIO", //月预约渠道人次占比
    "MONTH_REGISTER_TYPE_PERSONS_RATIO", //挂号类型占比（原出诊级别占比）
  ];
  personsCodes: any = [
    "MONTH_RESERVE_PERSONS", // 月预约人次
    "RESERVE_PERSONS_GUIDE",
  ];
  ratioCodes: any = [
    "MONTH_RESERVE_RATIO", // 月预约率
    "RESERVE_RATIO_GUIDE",
  ];
  get pageData() {
    return this.PageCode.pageData;
  }
  get tabCodes() {
    if (this.activeTabKey === "key_1") {
      return this.personsCodes;
    }
    return this.ratioCodes;
  }
  @Watch("timerChange")
  timerChangeChange() {
    const activeTabKey = this.activeTabKey;
    let nextActive = this.tabList[0];
    this.tabList.forEach((item: any, index: any) => {
      if (activeTabKey === item.value && this.tabList[index + 1]) {
        nextActive = this.tabList[index + 1];
      }
    });
    this.activeTabKey = nextActive.value;
  }
  mounted() {
    this.getViewData();
  }
  getViewData() {
    const tabCodes = this.personsCodes.concat(this.ratioCodes);
    const codes = this.codes.concat(tabCodes);
    PageCode.setCurrentPageCodes(codes);
    PageCode.getCodeData(codes);
  }
  get chartCode() {
    // 图表指标
    return this.tabCodes[0];
  }
  get guideCode() {
    // 辅助线指标
    return this.tabCodes[1];
  }
  get reservePersons() {
    // 预约人次
    const data = this.pageData.MONTH_RESERVE_PERSONS || [];
    const newData = data[data.length - 1];
    return newData ? newData.statisticsValue : null;
  }
  get chartData() {
    // 折线图
    const pageData = JSON.parse(JSON.stringify(this.pageData));
    const data = pageData[this.chartCode] || [];
    const _data = data.map((v: any) => {
      return {
        dataDt: v.dataDt,
        value: numberTransition(
          v.statisticsValue,
          "",
          this.activeTabKey == "key_1" ? "integer" : "ratio"
        ),
      };
    });
    return [
      {
        name: this.activeTabKey == "key_1" ? "预约人次" : "预约率",
        data: _data,
      },
    ];
  }
  get guideValue() {
    // 折线图辅助线
    const data = this.pageData;
    const codes = this.guideCode;
    const value =
      this.activeTabKey == "key_1"
        ? data[codes]
        : numberTransition(data[codes], "", "ratio");
    return value;
  }
  get chartRatio() {
    // 预约渠道
    const data = this.pageData.MONTH_RESERVE_WAY_PERSONS_RATIO || [];
    return data;
  }
  get doctorChartData() {
    // 挂号类型
    const data = this.pageData.MONTH_REGISTER_TYPE_PERSONS_RATIO || [];
    const list: any = [];
    data.forEach((item: any) => {
      list.push({
        name: item.dimensionTypeLevel,
        value: item.statisticsValue,
      });
    });
    return list;
  }
  tabActiveChange(value: any) {
    const _this: any = this;
    _this.clearTimer();
    _this.TimerRun();
    this.activeTabKey = value;
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
@sub-label-font-size: @font-size-12;
.right-view {
  > div {
    padding: 24px 15px;
  }
  .num-unit {
    font-size: 12px;
    margin-left: 5px;
  }
}
.persongs-statistics {
  display: grid;
  grid: ~"116px / 50% 50%";
  > div {
    margin: 0 7px;
    border-radius: 2px;
    box-shadow: 0px 0px 6px 0px #007276 inset;
    align-content: center;
    display: grid;
    padding: 0 12px;
    font-size: 16px;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    > .persons-num {
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      margin: 8px 0;
      opacity: 1;
    }
    > p:last-child > span {
      opacity: 0.9;
    }
  }
  ::v-deep .ant-badge {
    margin-top: -3px;
    margin-left: 4px;
    > .ant-badge-count {
      background: ~"rgb(78 254 249 / 20%)";
      color: rgb(78 254 249);
      box-shadow: none;
    }
  }
}
.appointment-chart {
  // padding: 36px 0px 40px 8px;
  padding: 36px 0px 20px 8px;
  height: 249px;
  > .progress-item-list {
    min-height: 133px;
    height: calc(100% - 40px);
  }
  ::v-deep .charts-empty {
    min-height: 133px;
  }
}
.doctor-chart {
  padding-left: 8px;
}
.appointment,
.back-number {
  .add-up {
    ::v-deep .numbers {
      display: inline-block;
    }
  }
  p {
    color: rgba(255, 255, 255, 0.6);
    span {
      margin-left: 4px;
    }
  }
}
</style>
