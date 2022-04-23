<template>
  <DisplayPanel class="resource" :iconName="'icon-resource'" :text="'资源效率'">
    <div>
      <div class="flex-box">
        <div class="mini-number-pabel">
          <img src="@/assets/images/svg/icon-bed-num.svg" />
          <div class="value">
            <number-increase
              :endVal="pageData.DAY_BEDNUM"
              color="#fff"
              fontSize="36px"
              :emptyText="'- - -'"
              :isPerson="true"
              :decimals="2"
            />
            <p>开放床位数</p>
          </div>
        </div>
        <div class="mini-number-pabel">
          <img src="@/assets/images/svg/icon-ip-day.svg" />
          <div class="value">
            <number-increase
              :endVal="pageData.YEAR_AVG_BEDDAY"
              color="#fff"
              fontSize="36px"
              :emptyText="'- - -'"
              :decimals="1"
            />
            <p>平均住院日</p>
          </div>
        </div>
      </div>
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
          v-if="activeTabKey == 'key_1'"
          class="ranking-charts"
          :chartData="chartData"
          :markLineShow="true"
          :valueLabelShow="true"
          :lineValue="chartLine"
          :markValueDecim="1"
          @echartHover="openOrcloseTimer"
          :series="[{ name: '床位周转次数' }]"
        />
        <MultiLine
          v-if="activeTabKey == 'key_2'"
          class="ranking-charts"
          :data="chartData"
          :showLegend="false"
          :showYAxis="false"
          :isRadio="true"
          :showMark="true"
          @echartHover="openOrcloseTimer"
          :guideValue="chartLine"
        />
      </div>
    </div>
  </DisplayPanel>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DisplayPanel from "@/components/DisplayPanel.vue";
import NumberIncrease from "@/components/NumberIncrease.vue";
import BarPanel from "@/components/chart-panel/BarPanel.vue";
import MultiLine from "@/components/chart-panel/MultiLine.vue";
import TimerMixins from "@/mixins/timerMixins";
import { numberTransition } from "@/utils/NumberTransition";
import { PageCode } from "@/store/page-code";
@Component({
  components: {
    DisplayPanel,
    NumberIncrease,
    BarPanel,
    MultiLine,
  },
  mixins: [TimerMixins],
})
export default class ResourceEfficient extends Vue {
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

  @Watch("timerChange")
  timerChangeChange() {
    this.changeFun();
  }

  PageCode = PageCode;
  codes: any = ["DAY_BEDNUM", "YEAR_AVG_BEDDAY"];
  bedCodes: any = ["MONTH_BED_TURNOVER_TIMES", "YEAR_BED_TURNOVER_TIMES_GUIDE"];
  bedUseCode: any = ["MONTH_BEDUSE_RATIO", "YEAR_BEDUSE_RATIO_GUIDE"];

  get pageData() {
    return this.PageCode.pageData;
  }
  get tabCodes() {
    if (this.activeTabKey === "key_1") {
      return this.bedCodes;
    }
    return this.bedUseCode;
  }

  get chartLine() {
    const data = this.pageData;
    const chartLine = this.tabCodes[1];
    const value = null == data[chartLine] ? "-" : data[chartLine];
    return this.activeTabKey == "key_1" ? value : value * 100;
  }
  get chartData() {
    const dataKey = this.tabCodes[0];
    const benChartData = this.pageData[dataKey] || [];
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
  mounted() {
    this.getViewData();
  }

  getViewData() {
    const tabCodes = this.bedCodes.concat(this.bedUseCode);
    const codes = tabCodes.concat(this.codes);
    PageCode.setCurrentPageCodes(codes);
    PageCode.getCodeData(codes);
  }

  changeFun() {
    const activeTabKey = this.activeTabKey;
    let nextActive = this.department[0];
    this.department.forEach((item: any, index: any) => {
      if (activeTabKey === item.value && this.department[index + 1]) {
        nextActive = this.department[index + 1];
      }
    });
    this.activeTabKey = nextActive.value;
  }

  departmentChange(value: any) {
    this.activeTabKey = value;
  }
}
</script>

<style lang="less" scoped>
.resource {
  padding-bottom: 48px;
  ::v-deep .common-content {
    padding: 0;
    padding-top: 40px;
  }
}
.flex-box {
  display: flex;
  justify-content: space-between;
  padding: 0 32px 24px;
  height: 75px;
}
.mini-number-pabel {
  display: flex;
  align-items: center;
  img {
    width: 54px;
    height: 54px;
    margin-right: 8px;
    transform: translateY(8px);
  }
  p {
    color: rgba(255, 255, 255, 0.6);
  }
}
.revenue-ranking {
  padding: 0 16px;
  height: calc(100% - 100px);
  ::v-deep .ant-tabs-tab {
    color: #fff;
    padding-left: 0;
    padding-right: 0;
    font-size: 20px;
    &.ant-tabs-tab-active,
    &:hover {
      color: #42ecee;
    }
    &::before {
      content: "";
      height: 1px;
      width: 100%;
      background: linear-gradient(270deg, rgba(78, 254, 249, 0.06), #4efef9);
      position: absolute;
      bottom: 0px;
      left: 0;
    }
  }
  ::v-deep .ant-tabs-ink-bar {
    background-color: #42ecee;
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
  height: 170px;
}
</style>
