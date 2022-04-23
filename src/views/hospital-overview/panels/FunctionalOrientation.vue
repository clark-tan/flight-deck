<template>
  <DisplayPanel
    class="right-box"
    :text="'功能定位'"
    :iconName="'functional-orientation'"
  >
    <div class="content-box">
      <div class="medical-care">
        <h3 class="sub-title">
          <span class="title-text">医疗总人次</span>
        </h3>
        <div class="medical-care-content">
          <mini-number-panel
            :dimension="dateCnNames.currentText"
            :endVal="medicalPersons.total[1]"
            :decimals="2"
            :isPerson="true"
            :themes="'green'"
          />
          <div class="number-data">
            <p>{{ dateCnNames.prevText }}</p>
            <p>
              <NumberIncrease
                :endVal="medicalPersons.total[0]"
                :emptyText="'- - -'"
                :color="'rgba(255,255,255,0.8)'"
                :isPerson="true"
                :fontSize="'18px'"
              />
              <NumberIncrease
                class="flex-end-align mom"
                :endVal="medicalPersons.ratio"
                :color="'rgba(255,255,255,0.8)'"
                :emptyText="'- - -'"
                :unit="'%'"
                :hasArrow="true"
                :arrowType="medicalPersons.waring"
                :fontSize="'18px'"
              />
            </p>
          </div>
          <ProgressBar
            :data="medicalPersons.data"
            :themes="medicalPersons.themes < 0 ? 'terrible' : 'normal'"
            :isPerson="true"
            :emptyText="'- - -'"
            bgHeight="6px"
            barHeight="6px"
          />
        </div>
        <div class="charts-box">
          <a-tabs v-model="activeTabKey" @change="departmentChange">
            <a-tab-pane
              v-for="item in department"
              :tab="item.label"
              :key="`${item.value}`"
              :name="item.value"
            ></a-tab-pane>
          </a-tabs>
          <div class="trend-proportion">
            <div>
              <p>
                <NumberIncrease
                  :endVal="dynamicTabData.peosons1"
                  :emptyText="'- - -'"
                  :color="'#fff'"
                  :isPerson="true"
                />
                <NumberIncrease
                  class="flex-end-align mom"
                  :endVal="dynamicTabData.ratio1"
                  :emptyText="'- - -'"
                  :color="'rgba(255,255,255, 0.8)'"
                  :fontSize="'18px'"
                  :unit="'%'"
                  :hasArrow="true"
                  :arrowType="dynamicTabData.waring1"
                />
              </p>
              <p>{{ dateCnNames.currentText }}{{ textOp[activeTabKey][0] }}</p>
            </div>
            <div>
              <p>
                <NumberIncrease
                  :endVal="dynamicTabData.peosons2"
                  :color="'#fff'"
                  :emptyText="'- - -'"
                  :isPerson="true"
                />
                <NumberIncrease
                  class="flex-end-align mom"
                  :color="'rgba(255,255,255, 0.8)'"
                  :fontSize="'18px'"
                  :endVal="dynamicTabData.ratio2"
                  :emptyText="'- - -'"
                  :unit="'%'"
                  :hasArrow="true"
                  :arrowType="dynamicTabData.waring2"
                />
              </p>
              <p>{{ dateCnNames.currentText }}{{ textOp[activeTabKey][1] }}</p>
            </div>
          </div>
          <!-- 趋势图 -->
          <MultiLine
            class="trend-chart"
            style="height: 300px"
            :data="dynamicTabData.lineData"
            :color="lineColor"
            @echartHover="openOrcloseTimer"
            :size="'360px 100%'"
            :emptyType="'moreLine'"
            yAxisName="人次"
          />
        </div>
      </div>
      <div class="operation-statistics">
        <h3 class="sub-title">
          <span class="title-text">手术台次数</span>
        </h3>
        <div class="medical-care-content">
          <mini-number-panel
            :dimension="dateCnNames.currentText"
            :endVal="operationNum.total[1]"
            :decimals="2"
            :isPerson="true"
            :themes="'blue'"
          />
          <div class="number-data">
            <p>{{ dateCnNames.prevText }}</p>
            <p>
              <NumberIncrease
                :endVal="operationNum.total[0]"
                :emptyText="'- - -'"
                :isPerson="true"
                :color="'rgba(255,255,255,0.8)'"
                :fontSize="'18px'"
              />
              <NumberIncrease
                class="flex-end-align mom"
                :endVal="operationNum.ratio"
                :emptyText="'- - -'"
                :unit="'%'"
                :hasArrow="true"
                :arrowType="operationNum.waring"
                :fontSize="'18px'"
                :color="'rgba(255,255,255, 0.8)'"
              />
            </p>
          </div>
          <ProgressBar
            :data="operationNum.data"
            :themes="operationNum.themes < 0 ? 'terrible' : 'normal'"
            :isPerson="true"
            :emptyText="'- - -'"
            bgHeight="6px"
            barHeight="6px"
          />
        </div>
      </div>
    </div>
  </DisplayPanel>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DisplayPanel from "@/components/DisplayPanel.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { AppConfigModule } from "@/store/app-config";
import TimerMixins from "@/mixins/timerMixins";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ArrowIcon from "@/components/ArrowIcon.vue";
import MultiLine from "@/components/chart-panel/MultiLine.vue";
import MiniNumberPanel from "@/components/chart-panel/MiniNumberPanel.vue";
import { dateNames } from "@/utils/Enumerate";
import { PageCode } from "@/store/page-code";

@Component({
  components: {
    DisplayPanel,
    ProgressBar,
    NumberIncrease,
    MultiLine,
    ArrowIcon,
    MiniNumberPanel,
  },
  mixins: [TimerMixins],
})
export default class FunctionalOrientation extends Vue {
  PageCode = PageCode;
  activeTabKey = "key_1";
  department = [
    {
      label: "门急诊人次",
      value: "key_1",
    },
    {
      label: "入出院人次",
      value: "key_2",
    },
  ];
  textOp = {
    key_1: ["门诊", "急诊"],
    key_2: ["入院", "出院"],
  };

  AppConfigModule = AppConfigModule;
  lineColor: any = [];

  personsCodes: any = {
    codes: [
      "YEAR_PERSONS",
      "YEAR_PERSONS_TARGET",
      "YEAR_PERSONS_TARGET_YIELD_RATIO",
      "YEAR_PERSONS_WARNING",
    ],
    dayCodes: ["DAY_PERSONS", "DOD_PERSONS", "DOD_PERSONS_WARNING"],
    monthCodes: ["MONTH_PERSONS", "MOM_PERSONS", "MOM_PERSONS_WARNING"],
  };
  operationCodes: any = {
    codes: [
      "YEAR_OPERATION_TIMES",
      "YEAR_OPERATION_TIMES_TARGET",
      "YEAR_OPERATION_TIMES_TARGET_YIELD_RATIO",
      "YEAR_OPERATION_TIMES_WARNING",
    ],
    dayCodes: [
      "DAY_OPERATION_TIMES",
      "DOD_OPERATION_TIMES",
      "DOD_OPERATION_TIMES_WARNING",
    ],
    monthCodes: [
      "MONTH_OPERATION_TIMES",
      "MOM_OPERATION_TIMES",
      "MOM_OPERATION_TIMES_WARNING",
    ],
  };
  outCodes: any = {
    dayCodes: [
      "MONTH_OP_PERSONS",
      "MONTH_ET_PERSONS",
      "DOD_OP_PERSONS",
      "DOD_ET_PERSONS",
      "DOD_OP_PERSONS_WARNING",
      "DOD_ET_PERSONS_WARNING",
      "DAY_OP_PERSONS",
      "DAY_ET_PERSONS",
    ],
    monthCodes: [
      "MONTH_OP_PERSONS",
      "MONTH_ET_PERSONS",
      "MOM_OP_PERSONS",
      "MOM_ET_PERSONS",
      "MOM_OP_PERSONS_WARNING",
      "MOM_ET_PERSONS_WARNING",
    ],
  };
  ipCodes: any = {
    dayCodes: [
      "MONTH_HOSPITALIZED_PERSONS",
      "MONTH_DISCHARGE_PERSONS",
      "DOD_HOSPITALIZED_PERSONS",
      "DOD_DISCHARGE_PERSONS",
      "DOD_HOSPITALIZED_PERSONS_WARNING",
      "DOD_DISCHARGE_PERSONS_WARNING",
      "DAY_HOSPITALIZED_PERSONS",
      "DAY_DISCHARGE_PERSONS",
    ],

    monthCodes: [
      "MONTH_HOSPITALIZED_PERSONS",
      "MONTH_DISCHARGE_PERSONS",
      "MOM_HOSPITALIZED_PERSONS",
      "MOM_DISCHARGE_PERSONS",
      "MOM_HOSPITALIZED_PERSONS_WARNING",
      "MOM_DISCHARGE_PERSONS_WARNING",
    ],
  };
  get pageData() {
    return this.PageCode.pageData;
  }
  get dynamicKey() {
    const cycleValue = this.AppConfigModule.cycleValue;
    if (dateNames.Name_2 === cycleValue) {
      return "monthCodes";
    }
    return "dayCodes";
  }
  //医疗人次累计和目标--目标进度
  get medicalPersons() {
    const pageData = this.pageData;
    const dynamicCodes = this.personsCodes[this.dynamicKey];
    const codes = dynamicCodes.concat(this.personsCodes.codes);
    const newData = this.getOperationOrPersonsData(pageData, codes);
    return newData;
  }
  //手术台数--目标进度
  get operationNum() {
    const pageData = this.pageData;
    const dynamicCodes = this.operationCodes[this.dynamicKey];
    const codes = dynamicCodes.concat(this.operationCodes.codes);
    const newData = this.getOperationOrPersonsData(pageData, codes);
    return newData;
  }
  // 门急诊、入出院人数
  get dynamicTabData() {
    const key = this.dynamicKey;
    const codes =
      this.activeTabKey === "key_1" ? this.outCodes[key] : this.ipCodes[key];
    return this.getOutOrIpPersonsData(this.pageData, codes);
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

  departmentChange(value: any) {
    const _this: any = this;
    _this.clearTimer();
    _this.TimerRun();
    this.activeTabKey = value;
  }
  get dateCnNames() {
    return this.AppConfigModule.dateCnNames;
  }
  mounted() {
    this.getViewData();
  }
  getViewData() {
    const codes = this.getCodes([
      this.personsCodes,
      this.operationCodes,
      this.outCodes,
      this.ipCodes,
    ]);
    PageCode.setCurrentPageCodes(codes);
    PageCode.getCodeData(codes);
  }
  getCodes(codesList: Array<any>) {
    let list: any = [];
    codesList.forEach((item: any) => {
      Object.keys(item).forEach((key: any) => {
        list = list.concat(item[key]);
      });
    });
    return list;
  }
  getOperationOrPersonsData(data: any, list: any) {
    const [
      totalKey,
      ratioKey,
      waringKey,
      currentKey,
      targetKey,
      progressKey,
      themesKey,
    ] = list;
    const newObj: any = {
      total: data[totalKey] || [],
      ratio: data[ratioKey],
      waring: data[waringKey],
      themes: data[themesKey],
      data: {
        accumulatedValue: data[currentKey],
        targetValue: data[targetKey],
        progressValue: data[progressKey],
      },
    };
    return Object.assign(newObj, JSON.parse(JSON.stringify(data)));
  }
  getOutOrIpPersonsData(data: any, list: any) {
    const [
      chart1Key,
      chart2Key,
      ratio1Key,
      ratio2Key,
      waring1Key,
      waring2Key,
      current1Key,
      current2Key,
    ] = list;
    const pageData = JSON.parse(JSON.stringify(data));
    const chart_1 = pageData[chart1Key] || []; // 出院
    const chart_2 = pageData[chart2Key] || []; // 入院
    const peosons1 = this.getPersonsNum(current1Key, chart_1);
    const peosons2 = this.getPersonsNum(current2Key, chart_2);
    const peosons1_chart = chart_1.map((v: any) => {
      v.name = v.dataDt;
      v.value = v.statisticsValue;
      return v;
    });
    const seriesName =
      this.activeTabKey == "key_1" ? ["门诊", "急诊"] : ["入院", "出院"];
    this.lineColor =
      this.activeTabKey == "key_1"
        ? ["#4EFEF9", "#F27834"]
        : ["#4EFEF9", "#4A9AEC"];
    const peosons2_chart = chart_2.map((v: any) => {
      v.name = v.dataDt;
      v.value = v.statisticsValue;
      return v;
    });
    // 门急诊人次｜｜出入院人次
    return {
      peosons1: peosons1,
      peosons2: peosons2,
      ratio1: pageData[ratio1Key],
      ratio2: pageData[ratio2Key],
      waring1: pageData[waring1Key],
      waring2: pageData[waring2Key],
      chartData: chart_1.concat(chart_2),
      lineData: [
        {
          name: seriesName[0],
          data: peosons1_chart,
        },
        {
          name: seriesName[1],
          data: peosons2_chart,
        },
      ],
    };
  }
  getPersonsNum(key: any, chartData: any) {
    const cycleValue = AppConfigModule.cycleValue;
    return "day" === cycleValue
      ? this.pageData[key]
      : chartData[chartData.length - 1]
      ? chartData[chartData.length - 1].statisticsValue
      : null;
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
@tips-color: #61fdff;
@text-opacity: 0.6;
.right-box {
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 43, 58, 0.4),
    rgba(0, 43, 58, 0.8) 98%
  );
}
.charts-box {
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
        rgba(0, 43, 58, 0.4) 0%,
        rgba(0, 43, 58, 0.8) 98%
      );
      position: absolute;
      bottom: 0px;
      left: 0;
    }
  }
  ::v-deep .ant-tabs-ink-bar {
    background-color: #42ecee;
  }
}
.content-box {
  height: 100%;
}
.sub-title {
  color: #fff;
  position: relative;
  &::before {
    content: "";
    position: relative;
    display: inline-block;
    line-height: 1;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: @tips-color;
    left: -8px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(78, 254, 249, 0.3);
    border-radius: 50%;
    left: -12px;
  }
  display: flex;
  align-items: center;
  font-size: 20px;
}
.medical-care-content {
  display: grid;
  grid: auto auto/ 170px 178px;
  grid-auto-flow: row dense;
  align-items: center;
  > div:first-child {
    grid-area: ~"1 / 1 / 3 / 1";
    align-content: center;
    text-align: center;
    > p:first-child {
      color: @text-color-1;
      font-size: 36px;
    }
    > p:last-child {
      opacity: @text-opacity;
    }
  }
}
.operation-statistics {
  padding-top: 45px;
  padding-left: 16px;
}
.number-data {
  > p:first-child {
    margin: 13px 0 8px 0;
    opacity: @text-opacity;
  }
  > p:last-child {
    display: grid;
    grid: auto/ auto auto;
    line-height: 1;
  }
}
.medical-care {
  h3,
  .medical-care-content {
    padding-left: 16px;
  }
  h3::after {
    left: 4px !important;
  }
  ::v-deep .ant-tabs-tab {
    color: #fff;
    &.ant-tabs-tab-active,
    &:hover {
      color: @tabs-active-color;
    }
  }
  ::v-deep .ant-tabs-ink-bar {
    background-color: @tabs-active-color;
  }
  ::v-deep .ant-tabs-bar {
    border-bottom: 1px solid @auxiliary-line;
    margin: 0;
  }
}
.trend-proportion {
  display: grid;
  grid: 60px / auto auto;
  margin: 20px -7px 0 -7px;
  > div {
    margin: 0 7px;
    border-radius: 2px;
    box-shadow: 0px 0px 6px 0px #007276 inset;
    align-content: center;
    display: grid;
    padding: 0 12px;
    > p:first-child {
      font-size: 24px;
      font-weight: 700;
      color: @text-color-1;
      line-height: 24px;
      display: grid;
      grid: auto / auto auto;
      margin-bottom: 4px;
      > span:first-child {
        color: #ffffff;
      }
      > span:last-child {
        opacity: 0.8;
        font-size: 18px;
        font-weight: 400;
        text-align: right;
        color: #ffffff;
      }
    }
    > p:last-child {
      opacity: 0.68;
    }
  }
}
.trend-chart {
  margin: 0 -10px;
}
</style>
