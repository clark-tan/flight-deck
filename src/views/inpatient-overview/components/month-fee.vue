<template>
  <DisplayPanel class="h537" :iconName="'icon-fee'" :text="'费用控制'">
    <div>
      <div class="mini-number-pabel">
        <div class="icon">
          <img src="@/assets/images/svg/icon-fee-per-time.svg" />
        </div>
        <div class="value">
          <number-increase
            v-if="monthIpFee != null"
            :endVal="monthIpFee.value"
            :emptyText="'- - -'"
            color="#fff"
            :unit="monthIpFee.unit"
            fontSize="24px"
          />
          <p>当月住院次均费用</p>
        </div>
        <NumberIncrease
          v-if="monthIpFee && monthIpFee.mom != null"
          class="mom"
          :endVal="monthIpFee.mom"
          :unit="'%'"
          :hasArrow="true"
          :arrowType="monthIpFee.ratioWaring"
          :fontSize="'18px'"
        />
      </div>
      <div class="mini-number-pabel">
        <div class="icon">
          <img src="@/assets/images/svg/icon-fee-medicine.svg" />
        </div>
        <div class="value">
          <number-increase
            v-if="monthIpMedicineFee"
            :endVal="monthIpMedicineFee.value"
            :emptyText="'- - -'"
            color="#fff"
            :unit="monthIpMedicineFee.unit"
            fontSize="24px"
          />
          <p>当月住院次均药品费用</p>
        </div>
        <NumberIncrease
          v-if="monthIpMedicineFee && monthIpMedicineFee.mom != null"
          class="mom"
          :endVal="monthIpMedicineFee.mom"
          :unit="'%'"
          :hasArrow="true"
          :arrowType="monthIpMedicineFee.ratioWaring"
          :fontSize="'18px'"
        />
      </div>
      <div class="ratio-group">
        <div class="ratio">
          <h3>
            <strong>住院耗占比</strong>
          </h3>
          <guage-panel
            v-if="!ipConsumableIncomeEmpty"
            :data="ipConsumableIncome"
            radius="70%"
            :center="['50%', '50%']"
            :isShowLegend="false"
            :progressColor="
              ipConsumableIncomeThemes < 0 ? 'terrible' : 'normal'
            "
          ></guage-panel>
          <ChartsEmpty v-else :type="'ratioPieComplete'" />
          <Compare
            :themes="ipConsumableIncomeThemes < 0 ? 'terrible' : 'normal'"
            :compareData="ipConsumableIncome"
            :textFiled="'label'"
            :align="'between'"
            :valueFiled="'ratioValue'"
            :unit="['%', '%']"
          />
        </div>
        <div class="ratio">
          <h3>
            <strong>住院药占比</strong>
          </h3>
          <guage-panel
            v-if="!ipMedicineIncomeEmpty"
            radius="70%"
            :center="['50%', '50%']"
            :data="ipMedicineIncome"
            :isShowLegend="false"
            :progressColor="ipMedicineIncomeThemes < 0 ? 'terrible' : 'normal'"
          ></guage-panel>
          <ChartsEmpty v-else :type="'ratioPieUnfinished'" />
          <Compare
            :compareData="ipMedicineIncome"
            :textFiled="'label'"
            :align="'between'"
            :valueFiled="'ratioValue'"
            :unit="['%', '%']"
            :themes="ipMedicineIncomeThemes < 0 ? 'terrible' : 'normal'"
          />
        </div>
      </div>
    </div>
  </DisplayPanel>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NumberIncrease from "@/components/NumberIncrease.vue";
import GuagePanel from "@/components/chart-panel/GaugePanel.vue";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import DisplayPanel from "@/components/DisplayPanel.vue";
import Compare from "@/components/smaller-module/Compare.vue";
import { numberTransition } from "@/utils/NumberTransition";
import { PageCode } from "@/store/page-code";
@Component({
  components: {
    DisplayPanel,
    NumberIncrease,
    GuagePanel,
    ChartsEmpty,
    Compare,
  },
})
export default class MonthFee extends Vue {
  PageCode = PageCode;

  codes: any = [
    "MONTH_IP_FEE_PER_TIMES",
    "MOM_IP_FEE_PER_TIMES",
    "MOM_IP_FEE_PER_TIMES_WARNING",

    "MONTH_IP_MEDICINE_FEE_PER_TIMES",
    "MOM_IP_MEDICINE_FEE_PER_TIMES",
    "MOM_IP_MEDICINE_FEE_PER_TIMES_WARNING",

    "YEAR_IP_CONSUMABLE_INCOME_RATIO",
    "YEAR_IP_CONSUMABLE_INCOME_RATIO_TARGET",
    "YEAR_IP_CONSUMABLE_INCOME_RATIO_WARNING",

    "YEAR_IP_MEDICINE_INCOME_RATIO",
    "YEAR_IP_MEDICINE_INCOME_RATIO_TARGET",
    "YEAR_IP_MEDICINE_INCOME_RATIO_WARNING",
  ];
  get pageData() {
    return this.PageCode.pageData;
  }
  // 住院耗占比
  get ipConsumableIncome() {
    const yearValue = this.pageData.YEAR_IP_CONSUMABLE_INCOME_RATIO;
    const targetValue = this.pageData.YEAR_IP_CONSUMABLE_INCOME_RATIO_TARGET;
    const yearValueStatue = numberTransition(yearValue, "isEmpty");
    const targetValueStatue = numberTransition(targetValue, "isEmpty");
    return [
      {
        value: yearValue,
        label: "当前值",
        ratioValue: yearValue,
        isEmpty: yearValueStatue,
      },
      {
        value: targetValue,
        label: "年目标",
        ratioValue: targetValue,
        isEmpty: targetValueStatue,
      },
    ];
  }
  get ipConsumableIncomeEmpty() {
    const data = this.ipConsumableIncome;
    return data[0].isEmpty && data[1].isEmpty ? true : false;
  }
  get ipConsumableIncomeThemes() {
    return this.pageData.YEAR_IP_CONSUMABLE_INCOME_RATIO_WARNING;
  }

  // 住院药占比
  get ipMedicineIncome() {
    const yearValue = this.pageData.YEAR_IP_MEDICINE_INCOME_RATIO;
    const targetValue = this.pageData.YEAR_IP_MEDICINE_INCOME_RATIO_TARGET;
    const yearValueStatue = numberTransition(yearValue, "isEmpty");
    const targetValueStatue = numberTransition(targetValue, "isEmpty");
    return [
      {
        value: yearValue,
        label: "当前值",
        ratioValue: yearValue,
        isEmpty: yearValueStatue,
      },
      {
        value: targetValue,
        label: "年目标",
        ratioValue: targetValue,
        isEmpty: targetValueStatue,
      },
    ];
  }
  get ipMedicineIncomeEmpty() {
    const data = this.ipMedicineIncome;
    return data[0].isEmpty && data[1].isEmpty ? true : false;
  }
  get ipMedicineIncomeThemes() {
    return this.pageData.YEAR_IP_MEDICINE_INCOME_RATIO_WARNING;
  }

  //住院次均费用
  get monthIpFee() {
    const data = this.pageData;
    return {
      value: data.MONTH_IP_FEE_PER_TIMES,
      mom: data.MOM_IP_FEE_PER_TIMES,
      ratioWaring: data.MOM_IP_FEE_PER_TIMES_WARNING,
    };
  }
  //住院次均药品费用
  get monthIpMedicineFee() {
    const data = this.pageData;
    return {
      value: data.MONTH_IP_MEDICINE_FEE_PER_TIMES,
      mom: data.MOM_IP_MEDICINE_FEE_PER_TIMES,
      ratioWaring: data.MOM_IP_MEDICINE_FEE_PER_TIMES_WARNING,
    };
  }

  mounted() {
    this.getViewData();
  }

  async getViewData() {
    await PageCode.setCurrentPageCodes(this.codes);
    await PageCode.getCodeData(this.codes);
  }
}
</script>

<style lang="less" scoped>
.h537 {
  height: 537px;
  ::v-deep .common-content {
    padding: 0;
    padding-top: 40px;
  }
}
.mini-number-pabel {
  width: 100%;
  padding: 0 32px 32px;
  display: flex;
  align-items: center;

  .icon {
    width: 66px;
    height: 66px;
    margin-right: 26px;
    img {
      width: 100%;
    }
  }

  .value {
    flex: 1;
    p {
      color: rgba(255, 255, 255, 0.6);
    }
    .num-unit {
      transform: translateY(4px);
    }
  }

  .mom {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.8);
    align-self: start;
    display: flex;
    align-items: center;
    margin-top: 15px;
    img {
      margin-left: 4px;
    }
  }
}
.ratio-group {
  display: flex;
  .ratio {
    padding: 0 17px 0 35px;
    text-align: center;
  }
  > div {
    width: 50%;
  }
  h3 {
    font-size: 20px;
    color: #ffffff;
    text-align: left;
    padding-left: 22px;
    margin-bottom: 10px;
    strong {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        border: 1px solid rgba(78, 254, 249, 0.3);
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
  .ratio-label {
    display: flex;
    justify-content: space-between;
    padding: 0 28px;
    color: rgba(255, 255, 255, 0.8);
    text-align: right;
    .active {
      color: #25fcc1;
      text-align: left;
    }
  }
  ::v-deep .gauge-group {
    height: 150px;
  }

  ::v-deep .charts-empty {
    height: 140px;
    background-size: 117px 117px;
    margin-top: 20px;
  }
}
.mom {
  ::v-deep .ratio-arrow-icon {
    transform: initial;
  }
}
</style>
