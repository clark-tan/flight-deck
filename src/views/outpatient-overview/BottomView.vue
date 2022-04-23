<template>
  <div class="bottom-view">
    <div>
      <SubTitle
        :title="tabActive === 'key_1' ? '门急诊收入趋势' : '门急诊人次趋势'"
      />
      <BarPanel
        class="bar-panel"
        :yAxisLabelShow="true"
        :emptyType="'stackBar'"
        :chartData="trendChartData"
        :splitLineShow="true"
        :yAxisName="tabActive === 'key_1' ? '收入' : '人次'"
        :integer="tabActive === 'key_1' ? false : true"
        :series="[
          { stack: 'persons', barColor: barColor[0], name: '门诊' },
          { stack: 'persons', barColor: barColor[1], name: '急诊' },
        ]"
      />
    </div>
    <div>
      <SubTitle :title="'门诊科室收入排行'" />
      <RankList
        class="ranking-box"
        :dataList="pageData.MONTH_OP_DEP_INCOME"
        :textFiled="'dimensionTypeLevel'"
        :valueFiled="'statisticsValue'"
      />
    </div>
    <div>
      <SubTitle :title="'门急诊药占比'" />
      <div class="ratio-box">
        <div class="chart-content">
          <!--图-->
          <GaugePanel
            v-if="!pieIsEmpty"
            :data="pieData"
            :progressColor="
              pageData.YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING < 0
                ? 'terrible'
                : 'normal'
            "
            :radius="'100%'"
            :center="['50%', '50%']"
            :isShowLegend="false"
          />
          <ChartsEmpty
            v-else
            class="chart-content"
            :type="'ratioPieComplete'"
          />
          <Compare
            :themes="
              pageData.YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING < 0
                ? 'terrible'
                : 'normal'
            "
            :compareData="JSON.parse(JSON.stringify(pieData))"
            :unit="['%', '%']"
          />
        </div>
      </div>
    </div>
    <div>
      <SubTitle :title="'门诊次均费用'" />
      <MiniNumberPanel
        class="boot-box"
        :dimension="'当月'"
        :endVal="feePerVisit[1]"
        :decimals="2"
        :themes="'green'"
        :fontSize="'36px'"
      />
      <Compare class="mom-compare" :compareData="boothCompareData" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SubTitle from "@/components/smaller-module/SubTitle.vue";
import BarPanel from "@/components/chart-panel/BarPanel.vue";
import RankList from "@/components/chart-panel/RankList.vue";
import GaugePanel from "@/components/chart-panel/GaugePanel.vue";
import Compare from "@/components/smaller-module/Compare.vue";
import MiniNumberPanel from "@/components/chart-panel/MiniNumberPanel.vue";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import { PageCode } from "@/store/page-code";
import { numberTransition } from "@/utils/NumberTransition";
@Component({
  components: {
    SubTitle,
    BarPanel,
    RankList,
    GaugePanel,
    Compare,
    MiniNumberPanel,
    ChartsEmpty,
  },
})
export default class BottomView extends Vue {
  PageCode = PageCode;
  @Prop({ default: "key_1" }) tabActive: any;
  barColor = ["#61fdff", "#f26334"];

  codes: any = [
    "MONTH_OP_DEP_INCOME", //月门诊科室收入
    "YEAR_OP_ET_MEDICINE_INCOME_RATIO", // 门急诊药收入占比（当前值）
    "YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET", //门急诊药收入占比年目标(年目标)
    "YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING", // 门急诊药占比预警
    "MONTH_OP_FEE_PER_VISIT", //门诊次均费用
    "MOM_OP_FEE_PER_VISIT", // 门诊次均费用环比
    "MOM_OP_FEE_PER_VISIT_WARNING", // 门诊次均费用环比预警
  ];
  incomeCodes: any = [
    "MONTH_OP_INCOME", //月门诊收入
    "MONTH_ET_INCOME", //月急诊收入
  ];
  personsCodes: any = [
    "MONTH_OP_PERSONS", //月门诊人次
    "MONTH_ET_PERSONS", //月急诊人次
  ];
  get pageData() {
    return this.PageCode.pageData;
  }
  get chartCodes() {
    if (this.tabActive === "key_1") {
      return this.incomeCodes;
    }
    return this.personsCodes;
  }
  // 门急诊就诊人次趋势
  get trendChartData() {
    const data = this.pageData;
    const codes = this.chartCodes;
    const chart1 = data[codes[0]] || [];
    const chartData = chart1.concat(data[codes[1]] || []);
    const keys: any = {};
    chartData.forEach((item: any) => {
      if (!keys[item.dataDt]) {
        keys[item.dataDt] = [];
      }
      keys[item.dataDt].push(item.statisticsValue);
    });
    const list: any = [["date", "value1", "value2"]];
    Object.keys(keys).forEach((key: any) => {
      list.push([key].concat(keys[key]));
    });
    return list;
  }
  // 获取门急诊药占比
  get pieData() {
    const data = this.pageData;
    return [
      {
        name: "当前值",
        value: data.YEAR_OP_ET_MEDICINE_INCOME_RATIO,
      },
      {
        name: "年目标",
        value: data.YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET,
      },
    ];
  }
  get pieIsEmpty() {
    const data = this.pieData;
    const value1 = data[0].value;
    const value2 = data[1].value;
    const isEmpty1 = numberTransition(value1, "isEmpty");
    const isEmpty2 = numberTransition(value2, "isEmpty");
    return isEmpty1 && isEmpty2 ? true : false;
  }
  get feePerVisit() {
    const data = this.pageData;
    return data.MONTH_OP_FEE_PER_VISIT || [];
  }
  // 获取门诊均次费用
  get boothCompareData() {
    const data = this.pageData;
    return [
      {
        name: "上月",
        value: this.feePerVisit[0],
      },
      {
        name: "环比",
        value: data.MOM_OP_FEE_PER_VISIT,
        unit: "%",
        hasArrow: true,
        ratioWaring: data.MOM_OP_FEE_PER_VISIT_WARNING,
      },
    ];
  }
  mounted() {
    this.getViewData();
  }
  getViewData() {
    const panelCodes = this.incomeCodes.concat(this.personsCodes);
    const codes = panelCodes.concat(this.codes);
    PageCode.setCurrentPageCodes(codes);
    PageCode.getCodeData(codes);
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.bottom-view {
  display: grid;
  grid: ~"230px / 470px 470px 280px 280px";
  justify-content: space-between;
  color: #fff;
  > div {
    display: inline-block;
    height: 100%;
    padding: 0 24px 0;
  }
  ::v-deep .rankListBox {
    margin-right: 10px;
    height: calc(100% - 40px);
  }
}
.bar-panel {
  height: calc(100% - 40px);
}
.ratio-charts-box {
  > p {
    height: 18px;
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    line-height: 18px;
  }
}
.ratio-box {
  height: calc(100% - 40px);
}

.chart-content {
  height: 100%;
  ::v-deep .gauge-group {
    height: 110px;
    margin: 35px 0 20px 0;
  }
  &::v-deep.charts-empty {
    background-size: 100px;
    height: 145px;
  }
}
.boot-box {
  margin: 40px auto 14px auto;
}
::v-deep .booth-data > p:first-child {
  margin-bottom: 14px;
}
</style>
