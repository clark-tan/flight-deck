<template>
  <div v-if="showBox" class="mini-panel">
    <h2><img src="@/assets/images/svg/icon-ip-num.svg" />住院人次</h2>
    <div class="progress">
      <progress-bar
        :data="{
          targetValue: pageData.YEAR_HOSPITALIZED_PERSONS_TARGET,
          accumulatedValue: pageData.YEAR_HOSPITALIZED_PERSONS,
          progressValue: pageData.YEAR_HOSPITALIZED_PERSONS_TARGET_YIELD_RATIO,
        }"
        :themes="
          pageData.YEAR_HOSPITALIZED_PERSONS_WARNING < 0 ? 'terrible' : 'normal'
        "
        :decimals="2"
        :emptyText="'- - -'"
        :isPerson="true"
        bgHeight="6px"
        barHeight="6px"
      ></progress-bar>
    </div>
    <div class="mini-panel-content">
      <div class="ip-patient">
        <number-increase
          :endVal="pageData.DAY_IN_HOSPITAL_PERSON"
          color="#F26334"
          fontSize="56px"
          :decimals="2"
          :isPerson="true"
        />
        <p>当前在院人数</p>
      </div>
      <div class="patient-list">
        <div class="patient-item">
          <number-increase
            :endVal="pageData.MONTH_IP_MT_60_DAY_PERSONS"
            color="#fff"
            fontSize="24px"
            :decimals="2"
            :isPerson="true"
          />
          <p>住院超60天患者</p>
        </div>
        <div class="patient-item">
          <number-increase
            :endVal="pageData.MONTH_SPECIAL_CARE_PERSONS"
            color="#fff"
            fontSize="24px"
            :decimals="2"
            :isPerson="true"
          />
          <p>特级护理患者</p>
        </div>
        <div class="patient-item">
          <number-increase
            :endVal="pageData.MONTH_CRITICAL_PATIENT_PERSONS"
            color="#fff"
            fontSize="24px"
            :decimals="2"
            :isPerson="true"
          />
          <p>病危患者</p>
        </div>
        <div class="patient-item">
          <number-increase
            :endVal="pageData.MONTH_RESCUE_PATIENT_PERSONS"
            color="#fff"
            fontSize="24px"
            :decimals="2"
            :isPerson="true"
          />
          <p>抢救患者</p>
        </div>
        <div class="patient-item">
          <number-increase
            :endVal="pageData.MONTH_DEAD_PATIENT_PERSONS"
            color="#fff"
            fontSize="24px"
            :decimals="2"
            :isPerson="true"
          />
          <p>死亡患者</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { PageCode } from "@/store/page-code";
@Component({
  components: {
    NumberIncrease,
    ProgressBar,
  },
})
export default class InpatientPerson extends Vue {
  @Prop({ default: false }) showBox: any;
  PageCode = PageCode;
  codes: any = [
    "MONTH_IP_MT_60_DAY_PERSONS",
    "MONTH_SPECIAL_CARE_PERSONS",
    "MONTH_CRITICAL_PATIENT_PERSONS",
    "MONTH_RESCUE_PATIENT_PERSONS",
    "MONTH_DEAD_PATIENT_PERSONS",
    "DAY_IN_HOSPITAL_PERSON",
    "YEAR_HOSPITALIZED_PERSONS",
    "YEAR_HOSPITALIZED_PERSONS_TARGET",
    "YEAR_HOSPITALIZED_PERSONS_TARGET_YIELD_RATIO",
    "YEAR_HOSPITALIZED_PERSONS_WARNING",
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
}
</script>

<style lang="less" scoped>
@panel-padding: 20px 70px;
@keyframes box-show {
  0% {
    transform: scale(0);
    transform-origin: 40px 40px;
  }
  100% {
    transform: scale(1);
    transform-origin: 40px 40px;
  }
}
.mini-panel {
  opacity: 1;
  width: 396px;
  height: 525px;
  background: url("../../../assets/images/svg/bg-panel/bg-ip-mini-panel.svg")
    no-repeat center top;
  background-size: contain;
  padding: @panel-padding;
  position: absolute;
  left: 120px;
  top: 189px;
  overflow: hidden;
  animation: box-show 0.3s linear;
  &::after {
    content: "";
    position: absolute;
    width: 300px;
    height: 1px;
    background: #39e5ea;
    opacity: 0.5;
    left: 49px;
    top: 155px;
  }
  ::v-deep .my-progress {
    padding-top: 25px !important;
  }
  h2 {
    color: #ffffff;
    font-size: 20px;
    display: flex;
    align-items: center;
    img {
      width: 34px;
      height: 34px;
    }
  }

  .mini-panel-content {
    padding: 15px 0;
    ::v-deep .numbers {
      line-height: 1;
    }
    .ip-patient {
      margin-bottom: 12px;
      .num-unit {
        transform: translateY(17px);
        color: #f26334;
      }
      ::v-deep .unit {
        margin-left: 4px;
      }
    }
  }
  p {
    color: rgba(255, 255, 255, 0.6);
    padding-top: 8px;
  }
}
.patient-list {
  display: flex;
  flex-wrap: wrap;
  width: 252px;
  .patient-item {
    width: 50%;
    padding: 12px 0;

    p {
      color: rgba(255, 255, 255, 0.6);
    }
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    .num-unit {
      transform: translateY(4px);
    }
  }
  .patient-item:nth-child(2n) {
    padding-left: 20px;
  }
  .patient-item:last-child {
    border: none;
  }
}
</style>
