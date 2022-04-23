<template>
  <number-panel
    v-if="panelData"
    :data="panelData"
    :cssType="'card'"
    :progressThemes="panelData.themes < 0 ? 'terrible' : 'normal'"
  ></number-panel>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NumberPanel from "@/components/chart-panel/NumberPanel.vue";
import { PageCode } from "@/store/page-code";
@Component({
  components: {
    NumberPanel,
  },
})
export default class MonthIncome extends Vue {
  PageCode = PageCode;
  codes: any = [
    "MONTH_IP_INCOME",
    "MOM_IP_INCOME",
    "YEAR_IP_INCOME",
    "YEAR_IP_INCOME_TARGET",
    "YEAR_IP_INCOME_TARGET_YIELD_RATIO",
    "YEAR_IP_INCOME_WARNING",
    "MOM_IP_INCOME_WARNING",
  ];
  get pageData() {
    return this.PageCode.pageData;
  }
  mounted() {
    this.getViewData();
  }

  getViewData() {
    PageCode.setCurrentPageCodes(this.codes);
    PageCode.getCodeData(this.codes);
  }

  get ipIncome() {
    return this.pageData.MONTH_IP_INCOME || [];
  }
  // 月住院收入
  get panelData() {
    const data = this.pageData;
    return {
      prePeriodValue: this.ipIncome[0],
      itemValue: this.ipIncome[1],
      itemName: "住院总收入",
      momValue: data.MOM_IP_INCOME,
      accumulatedValue: data.YEAR_IP_INCOME,
      targetValue: data.YEAR_IP_INCOME_TARGET,
      preDimension: "上月",
      dimension: "当月",
      progressValue: data.YEAR_IP_INCOME_TARGET_YIELD_RATIO,
      themes: data.YEAR_IP_INCOME_WARNING,
      ratioWaring: data.MOM_IP_INCOME_WARNING,
    };
  }
}
</script>

<style></style>
