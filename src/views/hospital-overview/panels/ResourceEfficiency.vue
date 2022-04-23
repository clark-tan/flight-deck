<template>
  <DisplayPanel class="resource" :text="'资源效率'" :iconName="'icon-resource'">
    <div class="content-box">
      <!--饼图-->
      <div class="dispaly-num">
        <div>
          <img
            :src="
              require(`@/assets/images/${iconLibraryName}/icon-bed-num.svg`)
            "
          />
          <div class="number-text">
            <number-increase
              :endVal="pageData.DAY_BEDNUM"
              color="#fff"
              fontSize="36px"
              :decimals="2"
              :isPerson="true"
              :emptyText="'- - -'"
            />
            <p>开放床位数</p>
          </div>
        </div>
        <div>
          <img
            :src="require(`@/assets/images/${iconLibraryName}/icon-ip-day.svg`)"
          />
          <div class="number-text">
            <number-increase
              :endVal="pageData.YEAR_AVG_BEDDAY"
              color="#fff"
              fontSize="36px"
              :decimals="1"
              :emptyText="'- - -'"
            />
            <p>平均住院日</p>
          </div>
        </div>
      </div>
      <!--排行-->
      <div class="revenue-ranking">
        <a-tabs v-model="activeTabKey" @change="departmentChange">
          <a-tab-pane
            v-for="item in department"
            :tab="item.label"
            :key="`${item.value}`"
            :name="item.value"
          ></a-tab-pane>
        </a-tabs>
        <BarPanel
          :style="{ width: '100%' }"
          class="ranking-charts"
          :chartData="chartData"
          v-if="activeTabKey == 'key_1'"
          :lineValue="chartLine"
          :markLineShow="true"
          :valueLabelShow="true"
          :markValueDecim="1"
          :decimals="1"
          :yAxisName="'次数'"
          @echartHover="openOrcloseTimer"
          :series="[{ name: '床位周转次数' }]"
        />
        <MultiLine
          v-if="activeTabKey == 'key_2'"
          class="ranking-charts"
          :data="chartData"
          :showLegend="false"
          :showYAxis="false"
          :showMark="true"
          :isRadio="true"
          :guideValue="chartLine"
          @echartHover="openOrcloseTimer"
        />
      </div>
    </div>
  </DisplayPanel>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DisplayPanel from "@/components/DisplayPanel.vue";
import BarPanel from "@/components/chart-panel/BarPanel.vue";
import TimerMixins from "@/mixins/timerMixins";
import { unique } from "@/utils/Common";
import { AppConfigModule } from "@/store/app-config";
import NumberIncrease from "@/components/NumberIncrease.vue";
import MultiLine from "@/components/chart-panel/MultiLine.vue";
import { PageCode } from "@/store/page-code";
import { numberTransition } from "@/utils/NumberTransition";
@Component({
  components: {
    DisplayPanel,
    BarPanel,
    NumberIncrease,
    MultiLine,
  },
  mixins: [TimerMixins],
})
export default class ResourceEfficiency extends Vue {
  PageCode = PageCode;
  activeTabKey = "key_1";
  department = [
    {
      label: "床位周转次数",
      value: "key_1",
    },
    {
      label: "床位使用率",
      value: "key_2",
    },
  ];
  AppConfigModule = AppConfigModule;
  get iconLibraryName() {
    return this.AppConfigModule.iconLibrary;
  }
  codes: any = ["DAY_BEDNUM", "YEAR_AVG_BEDDAY"];
  tabCodes: any = {
    key_1: ["MONTH_BED_TURNOVER_TIMES", "YEAR_BED_TURNOVER_TIMES_GUIDE"],
    key_2: ["MONTH_BEDUSE_RATIO", "YEAR_BEDUSE_RATIO_GUIDE"],
  };
  get pageData() {
    return this.PageCode.pageData;
  }
  get dynamicCode() {
    return this.tabCodes[this.activeTabKey];
  }
  get chartLine() {
    const data = this.pageData;
    const chartLine = this.dynamicCode[1];
    const value = null == data[chartLine] ? "-" : data[chartLine];
    return this.activeTabKey == "key_1" ? value : value * 100;
  }
  get chartData() {
    const dataKey = this.dynamicCode[0];
    const benChartData = unique(this.pageData[dataKey] || [], "dataDt");
    let chartData: any = [];
    if (this.activeTabKey == "key_1") {
      const dataList: any = benChartData.map((item: any) => {
        return [
          item.dataDt,
          null !== item.statisticsValue ? item.statisticsValue.toFixed(1) : "-",
        ];
      });
      chartData = dataList.length ? [["date", "value"]].concat(dataList) : [];
    } else if (this.activeTabKey == "key_2") {
      const _data = benChartData.map((v: any) => {
        return {
          dataDt: v.dataDt,
          value:
            null !== v.statisticsValue
              ? numberTransition(parseFloat(v.statisticsValue), "", "ratio")
              : "-",
        };
      });
      chartData = [
        {
          name: "床位使用率",
          data: _data,
        },
      ];
    }
    return chartData;
  }
  @Watch("timerChange")
  timerChangeChange() {
    const activeTabKey = this.activeTabKey;
    let nextActive = this.department[0];
    this.department.forEach((item: any, index: any) => {
      if (activeTabKey === item.value && this.department[index + 1]) {
        nextActive = this.department[index + 1];
      }
    });
    this.activeTabKey = nextActive.value;
  }
  mounted() {
    this.getViewData();
  }
  getViewData() {
    const tabCodes = this.tabCodes.key_1.concat(this.tabCodes.key_2);
    const codes = tabCodes.concat(this.codes);
    PageCode.setCurrentPageCodes(codes);
    PageCode.getCodeData(codes);
  }
  departmentChange(value: any) {
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
.resource {
  padding-bottom: 48px;
}
.content-box {
  height: 100%;
}
.dispaly-num {
  display: grid;
  grid: auto / 50% 50%;
  text-align: center;
  margin: 15px 0;
  > div {
    display: grid;
    grid: auto / 84px auto;
    align-items: center;
    ::v-deep .numbers {
      line-height: 1;
    }
  }
  img {
    width: 54px;
    height: 54px;
    transform: translateY(4px);
    margin: 0px 15px;
  }
}
.number-text {
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  > p {
    height: 18px;
    opacity: 0.6;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    line-height: 18px;
  }
  > p:first-child {
    margin-top: 6px;
    height: 36px;
    opacity: 1;
    font-size: 36px;
    color: #ffffff;
    line-height: 36px;
  }
}
.revenue-ranking {
  height: calc(100% - 100px);
  ::v-deep .ant-tabs-tab {
    color: #fff;
    padding-left: 0;
    padding-right: 0;
    font-size: 20px;
    &.ant-tabs-tab-active,
    &:hover {
      color: @tabs-active-color;
    }
    &::before {
      content: "";
      height: 1px;
      width: 100%;
      background: linear-gradient(
        90deg,
        rgba(0, 43, 58, 0.8) 0%,
        rgba(0, 43, 58, 0.4) 98%
      );
      position: absolute;
      bottom: 0px;
      left: 0;
    }
  }
  ::v-deep .ant-tabs-ink-bar {
    background-color: @tabs-active-color;
  }
  ::v-deep .ant-tabs-bar {
    border-bottom: 1px solid @auxiliary-line;
  }
  > ul > li {
    display: grid;
    grid: auto / 50% 50%;
    > span:last-child {
      text-align: right;
    }
  }
}
.ranking-charts {
  height: 150px;
}
</style>
