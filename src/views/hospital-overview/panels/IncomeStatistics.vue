<template>
  <div class="newset-data pointer-events-none">
    <div class="common-animation-opacity common-animation-opacity-leave">
      <number-panel
        :progressThemes="panelIp.themes < 0 ? 'terrible' : 'normal'"
        class="ip-panel"
        :data="panelIp"
      />
    </div>
    <div class="common-animation-opacity common-animation-opacity-leave">
      <number-panel
        class="income-panel"
        :data="panelIncome"
        :cssType="'card'"
        :progressThemes="panelIncome.themes < 0 ? 'terrible' : 'normal'"
      />
    </div>
    <div class="common-animation-opacity common-animation-opacity-leave">
      <number-panel
        :progressThemes="panelOut.themes < 0 ? 'terrible' : 'normal'"
        class="out-panel"
        :data="panelOut"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NumberPanel from "@/components/chart-panel/NumberPanel.vue";
import { AppConfigModule } from "@/store/app-config";
import { dateNames } from "@/utils/Enumerate";
import { PageCode } from "@/store/page-code";
@Component({
  components: {
    NumberPanel,
  },
})
export default class IncomeStatistics extends Vue {
  AppConfigModule = AppConfigModule;
  PageCode = PageCode;
  totalCodes: any = {
    codes: [
      "YEAR_INCOME",
      "YEAR_INCOME_TARGET",
      "YEAR_INCOME_WARNING",
      "YEAR_INCOME_TARGET_YIELD_RATIO",
    ],
    dayCodes: ["DAY_INCOME", "DOD_INCOME", "DOD_INCOME_WARNING"],
    monthCodes: ["MONTH_INCOME", "MOM_INCOME", "MOM_INCOME_WARNING"],
  };
  outCodes: any = {
    codes: [
      "YEAR_OP_ET_INCOME",
      "YEAR_OP_ET_INCOME_TARGET",
      "YEAR_OP_ET_INCOME_WARNING",
      "YEAR_OP_ET_INCOME_TARGET_YIELD_RATIO",
    ],
    dayCodes: [
      "DAY_OP_ET_INCOME",
      "DOD_OP_ET_INCOME",
      "DOD_OP_ET_INCOME_WARNING",
    ],
    monthCodes: [
      "MONTH_OP_ET_INCOME",
      "MOM_OP_ET_INCOME",
      "MOM_OP_ET_INCOME_WARNING",
    ],
  };
  ipCodes: any = {
    codes: [
      "YEAR_IP_INCOME",
      "YEAR_IP_INCOME_TARGET",
      "YEAR_IP_INCOME_WARNING",
      "YEAR_IP_INCOME_TARGET_YIELD_RATIO",
    ],
    dayCodes: ["DAY_IP_INCOME", "DOD_IP_INCOME", "DOD_IP_INCOME_WARNING"],
    monthCodes: ["MONTH_IP_INCOME", "MOM_IP_INCOME", "MOM_IP_INCOME_WARNING"],
  };

  get pageData() {
    return this.PageCode.pageData;
  }
  get dynamicCode() {
    const cycleValue = this.AppConfigModule.cycleValue;
    if (dateNames.Name_2 === cycleValue) {
      return "monthCodes";
    }
    return "dayCodes";
  }
  get dateCnNames() {
    return this.AppConfigModule.dateCnNames;
  }
  get panelIncome() {
    const data = this.pageData;
    const codes = this.totalCodes[this.dynamicCode];
    const INCOME = data[codes[0]];
    return {
      prePeriodValue: INCOME ? INCOME[0] : null,
      itemValue: INCOME ? INCOME[1] : null,
      itemName: "总收入",
      momValue: data[codes[1]],
      accumulatedValue: data.YEAR_INCOME,
      targetValue: data.YEAR_INCOME_TARGET,
      preDimension: this.dateCnNames.prevText,
      dimension: this.dateCnNames.currentText,
      progressValue: data.YEAR_INCOME_TARGET_YIELD_RATIO,
      themes: data.YEAR_INCOME_WARNING,
      ratioWaring: data[codes[2]],
    };
  }

  get panelIp() {
    const data = this.pageData;
    const codes = this.ipCodes[this.dynamicCode];
    const IP_INCOME = data[codes[0]];
    return {
      prePeriodValue: IP_INCOME ? IP_INCOME[0] : null,
      itemValue: IP_INCOME ? IP_INCOME[1] : null,
      itemName: "住院",
      momValue: data[codes[1]],
      accumulatedValue: data.YEAR_IP_INCOME,
      targetValue: data.YEAR_IP_INCOME_TARGET,
      preDimension: this.dateCnNames.prevText,
      dimension: this.dateCnNames.currentText,
      progressValue: data.YEAR_IP_INCOME_TARGET_YIELD_RATIO,
      themes: data.YEAR_IP_INCOME_WARNING,
      ratioWaring: data[codes[2]],
    };
  }

  get panelOut() {
    const data = this.pageData;
    const codes = this.outCodes[this.dynamicCode];
    const OP_ET_INCOME = data[codes[0]];
    return {
      prePeriodValue: OP_ET_INCOME ? OP_ET_INCOME[0] : null,
      itemValue: OP_ET_INCOME ? OP_ET_INCOME[1] : null,
      itemName: "门急诊",
      momValue: data[codes[1]],
      accumulatedValue: data.YEAR_OP_ET_INCOME,
      targetValue: data.YEAR_OP_ET_INCOME_TARGET,
      preDimension: this.dateCnNames.prevText,
      dimension: this.dateCnNames.currentText,
      progressValue: data.YEAR_OP_ET_INCOME_TARGET_YIELD_RATIO,
      themes: data.YEAR_OP_ET_INCOME_WARNING,
      ratioWaring: data[codes[2]],
    };
  }

  mounted() {
    this.getViewData();
  }
  getViewData() {
    const codes = this.getCodes([this.totalCodes, this.outCodes, this.ipCodes]);
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
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.newset-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  .income-panel {
    width: 450px;
  }
  .out-panel,
  .ip-panel {
    width: 280px;
    ::v-deep .progress-text {
      strong {
        font-size: 18px;
        i {
          font-size: 16px;
        }
      }
    }
    ::v-deep .last-term {
      .last-value {
        font-size: 18px !important;
      }
      .flex-box {
        img {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
}
</style>
