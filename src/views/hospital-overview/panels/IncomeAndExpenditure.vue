<template>
  <DisplayPanel :iconName="'icon-fee'" :text="'收支情况'">
    <div class="income-exp-box">
      <!--饼图-->
      <div class="ratio-charts-box">
        <div>
          <h3><strong>门急诊药占比</strong></h3>
          <div class="chart-content">
            <!--图-->
            <GaugePanel
              class="charts-box"
              v-if="!pieData.pie1IsEmpty"
              :data="pieData.pie1"
              :radius="'86%'"
              :center="['50%', '45%']"
              :progressColor="
                pieData.progressColorPie1 < 0 ? 'terrible' : 'normal'
              "
              :isShowLegend="false"
            />
            <ChartsEmpty
              v-else
              class="chart-content"
              :type="'ratioPieComplete'"
            />
            <Compare
              :themes="pieData.progressColorPie1 < 0 ? 'terrible' : 'normal'"
              :compareData="compareData.pie1"
              :unit="['%', '%']"
            />
          </div>
        </div>
        <div>
          <h3><strong>住院药占比</strong></h3>
          <div class="chart-content">
            <!--图-->
            <GaugePanel
              v-if="!pieData.pie2IsEmpty"
              class="charts-box"
              :data="pieData.pie2"
              :radius="'86%'"
              :center="['50%', '45%']"
              :isShowLegend="false"
              :progressColor="
                pieData.progressColorPie2 < 0 ? 'terrible' : 'normal'
              "
            />
            <ChartsEmpty
              v-else
              class="chart-content"
              :type="'ratioPieUnfinished'"
            />
            <Compare
              :themes="pieData.progressColorPie2 < 0 ? 'terrible' : 'normal'"
              :compareData="compareData.pie2"
              :unit="['%', '%']"
            />
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
        <div class="rankCss">
          <RankList
            :dataList="rankingData"
            :textFiled="'dimensionTypeLevel'"
            :valueFiled="'statisticsValue'"
            @rankingHover="openOrcloseTimer"
          />
        </div>
      </div>
    </div>
  </DisplayPanel>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DisplayPanel from "@/components/DisplayPanel.vue";
import RankList from "@/components/chart-panel/RankList.vue";
import GaugePanel from "@/components/chart-panel/GaugePanel.vue";
import { AppConfigModule } from "@/store/app-config";
import TimerMixins from "@/mixins/timerMixins";
import Compare from "@/components/smaller-module/Compare.vue";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import { PageCode } from "@/store/page-code";
import { dateNames } from "@/utils/Enumerate";
import { numberTransition } from "@/utils/NumberTransition";
@Component({
  components: {
    DisplayPanel,
    RankList,
    GaugePanel,
    Compare,
    ChartsEmpty,
  },
  mixins: [TimerMixins],
})
export default class IncomeAndExpenditure extends Vue {
  PageCode = PageCode;
  activeTabKey = "key_1";
  department = [
    {
      label: "门诊日收入排行",
      value: "key_1",
    },
    {
      label: "住院日收入排行",
      value: "key_2",
    },
  ];
  AppConfigModule = AppConfigModule;
  codes: any = [
    "YEAR_OP_ET_MEDICINE_INCOME_RATIO",
    "YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET",
    "YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING",
    "YEAR_IP_MEDICINE_INCOME_RATIO",
    "YEAR_IP_MEDICINE_INCOME_RATIO_TARGET",
    "YEAR_IP_MEDICINE_INCOME_RATIO_WARNING",
  ];
  dayCodes: any = ["DAY_OP_DEP_INCOME", "DAY_IP_DEP_INCOME"];
  monthCodes: any = ["MONTH_OP_DEP_INCOME", "MONTH_IP_DEP_INCOME"];
  get pageData() {
    return this.PageCode.pageData;
  }
  get dynamicCode() {
    const cycleValue = this.AppConfigModule.cycleValue;
    if (dateNames.Name_2 === cycleValue) {
      return this.monthCodes;
    }
    return this.dayCodes;
  }
  get compareData() {
    const data = this.pageData;
    const pie1IsEmpty = this.checkDataIsEmpty(data, [
      "YEAR_OP_ET_MEDICINE_INCOME_RATIO",
      "YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET",
    ]);
    const pie2IsEmpty = this.checkDataIsEmpty(data, [
      "YEAR_IP_MEDICINE_INCOME_RATIO",
      "YEAR_IP_MEDICINE_INCOME_RATIO_TARGET",
    ]);
    return {
      pie1: [
        {
          name: "当前值",
          value: data.YEAR_OP_ET_MEDICINE_INCOME_RATIO,
        },

        {
          name: "年目标",
          value: data.YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET,
        },
      ],
      pie1IsEmpty: pie1IsEmpty,
      progressColorPie1: data.YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING,
      pie2: [
        {
          name: "当前值",
          value: data.YEAR_IP_MEDICINE_INCOME_RATIO,
        },
        {
          name: "年目标",
          value: data.YEAR_IP_MEDICINE_INCOME_RATIO_TARGET,
        },
      ],
      pie2IsEmpty: pie2IsEmpty,
      progressColorPie2: data.YEAR_IP_MEDICINE_INCOME_RATIO_WARNING,
    };
  }
  get pieData() {
    return JSON.parse(JSON.stringify(this.compareData));
  }
  get rankingData() {
    const activeTabKey = this.activeTabKey;
    const index = activeTabKey === "key_1" ? 0 : 1;
    const key = this.dynamicCode[index];
    return this.pageData[key];
  }
  @Watch("AppConfigModule.dateCnNames")
  dateCnNamesChange(data: any) {
    this.textChange(data);
    // 时间类型切换后，重新请求排行数据
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
  get dateCnNames() {
    return AppConfigModule.dateCnNames;
  }
  mounted() {
    this.textChange(this.dateCnNames);
    this.getViewData();
  }
  async getViewData() {
    const dateCodes = this.dayCodes.concat(this.monthCodes);
    const codes = dateCodes.concat(this.codes);
    await PageCode.setCurrentPageCodes(codes);
    await PageCode.getCodeData(codes);
  }

  textChange(data: any) {
    const text = data.text;
    const list = ["门诊", "住院"];
    this.department.forEach((item: any, index: any) => {
      this.$set(item, "label", `${list[index]}${text}收入排行`);
    });
  }
  departmentChange(value: any) {
    const _this: any = this;
    _this.clearTimer();
    _this.TimerRun();
    this.activeTabKey = value;
  }
  checkDataIsEmpty(data: any, list: any) {
    // 使用 同一个对象下的不同key值（list为key数组）判断是否全部为null
    let flag = true;
    Object.keys(data).forEach((key: any) => {
      if (list.includes(key)) {
        const value: any = data[key];
        const isEmpty = numberTransition(value, "isEmpty");
        flag = flag ? isEmpty : false;
      }
    });
    return flag;
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
@sub-label-font-size: @font-size-12;
.income-exp-box {
  height: 100%;
}
.ratio-charts-box {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin: 17px 0 22px 0;
  height: 230px;
  > div {
    width: 46%;
  }
  h3 {
    font-size: 20px;
    color: #ffffff;
    text-align: left;
    margin-bottom: 10px;
    padding-left: 22px;
    strong {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        border: 1px solid #4efef9;
        border-radius: 50%;
        left: -20px;
        top: 4px;
      }
      &::after {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background: #4efef9;
        border-radius: 50%;
        left: -16px;
        top: 8px;
      }
    }
  }
  .chart-content {
    height: calc(100% - 40px);
    &::v-deep.charts-empty {
      background-size: 105px 100px;
      margin-top: -4px;
    }
  }
}
.charts-box {
  height: 115px;
  margin: 25px 0 5px 0;
}
.revenue-ranking {
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
    background-color: #42ecee;
  }
  .rankCss {
    padding: 16px 16px 16px 0;
    height: 218px;
  }
}
</style>
