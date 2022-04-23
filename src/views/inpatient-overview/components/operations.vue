<template>
  <div class="panel">
    <h2>手术台次数</h2>
    <div class="panel-content">
      <div class="panel-right">
        <div class="operation">
          <div class="month-total">
            <mini-number-panel
              dimension="当月"
              :endVal="monthOperationTotal"
              :decimals="2"
              :isPerson="true"
            />
          </div>
          <div class="progress">
            <progress-bar
              :data="{
                targetValue: pageData.YEAR_OPERATION_TIMES_TARGET,
                accumulatedValue: pageData.YEAR_OPERATION_TIMES,
                progressValue: pageData.YEAR_OPERATION_TIMES_TARGET_YIELD_RATIO,
              }"
              :themes="
                pageData.YEAR_OPERATION_TIMES_WARNING < 0
                  ? 'terrible'
                  : 'normal'
              "
              :decimals="2"
              :emptyText="'- - -'"
              :isPerson="true"
              bgHeight="6px"
              barHeight="6px"
            ></progress-bar>
          </div>
        </div>
        <div class="operation-ratio">
          <div>
            <template v-if="operationLevelRatio != null">
              <my-guage
                radius="80%"
                :center="['50%', '50%']"
                :data="[{ value: operationLevelRatio, label: '四级手术占比' }]"
              />
              <div class="value">
                <number-increase
                  :endVal="numberTransition(operationLevelRatio, 'ratio')"
                  color="#fff"
                  :emptyText="'- - -'"
                  fontSize="18px"
                />
                <span v-if="operationLevelRatio != null">%</span>
              </div>
              <p>四级手术占比</p>
            </template>
            <template v-else>
              <ChartsEmpty :type="'operationRatio1'" />
            </template>
          </div>
          <div>
            <template v-if="minInvasiveOperation != null">
              <my-guage
                radius="80%"
                :center="['50%', '50%']"
                :data="[{ value: minInvasiveOperation, label: '微创手术占比' }]"
              />
              <div class="value">
                <number-increase
                  :endVal="numberTransition(minInvasiveOperation, 'ratio')"
                  color="#fff"
                  :emptyText="'- - -'"
                  fontSize="18px"
                />
                <span v-if="minInvasiveOperation != null">%</span>
              </div>
              <p>微创手术占比</p>
            </template>
            <template v-else>
              <ChartsEmpty :type="'operationRatio2'" />
            </template>
          </div>
          <div>
            <template v-if="samedayOperation != null">
              <my-guage
                radius="80%"
                :center="['50%', '50%']"
                :data="[{ value: samedayOperation, label: '日间手术占比' }]"
              />
              <div class="value">
                <number-increase
                  :endVal="numberTransition(samedayOperation, 'ratio')"
                  color="#fff"
                  :emptyText="'- - -'"
                  fontSize="18px"
                />
                <span v-if="samedayOperation != null">%</span>
              </div>
              <p>日间手术占比</p>
            </template>
            <template v-else>
              <ChartsEmpty :type="'operationRatio3'" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import MiniNumberPanel from "@/components/chart-panel/MiniNumberPanel.vue";
import MyGuage from "./my-guage.vue";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import { numberTransition } from "@/utils/NumberTransition";
import { PageCode } from "@/store/page-code";

@Component({
  components: {
    NumberIncrease,
    ProgressBar,
    MiniNumberPanel,
    ChartsEmpty,
    MyGuage,
  },
})
export default class Operations extends Vue {
  numberTransition = numberTransition;
  PageCode = PageCode;
  codes: any = [
    "MONTH_OPERATION_TIMES",
    "MOM_OPERATION_TIMES",
    "YEAR_OPERATION_TIMES",
    "YEAR_OPERATION_TIMES_TARGET",
    "YEAR_OPERATION_TIMES_TARGET_YIELD_RATIO",
    "YEAR_OPERATION_TIMES_WARNING",
    "MONTH_OPERATION_LEVEL_TIMES_RATIO",
    "MONTH_MIN_INVASIVE_OPERATION_TIMES_RATIO",
    "MONTH_SAMEDAY_OPERATION_TIMES_RATIO",
  ];
  get pageData() {
    return this.PageCode.pageData;
  }
  get monthOperationTotal() {
    return this.getLastItemValue(this.pageData.MONTH_OPERATION_TIMES);
  }
  get operationLevelRatio() {
    return this.pageData.MONTH_OPERATION_LEVEL_TIMES_RATIO;
  }
  get minInvasiveOperation() {
    return this.pageData.MONTH_MIN_INVASIVE_OPERATION_TIMES_RATIO;
  }
  get samedayOperation() {
    return this.pageData.MONTH_SAMEDAY_OPERATION_TIMES_RATIO;
  }
  mounted() {
    this.getViewData();
  }

  getViewData() {
    PageCode.setCurrentPageCodes(this.codes);
    PageCode.getCodeData(this.codes);
  }
  // 获取数组数据最后一个子集的value值
  getLastItemValue(data: any) {
    if (data) {
      const item = data[data.length - 1] || {};
      const type = typeof item;
      if (type === "object") {
        return item.statisticsValue;
      }
      return item;
    }
    return null;
  }
}
</script>

<style lang="less" scoped>
.panel {
  width: calc(420 / 1500 * 100%);
  h2 {
    margin-bottom: 14px;
    color: #ffffff;
    font-size: 20px;
    line-height: 1;
    position: relative;
    padding-left: 24px;
    &::before {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      border: 1px solid rgba(78, 254, 249, 0.3);
      border-radius: 50%;
      left: 0;
      top: 2px;
    }
    &::after {
      content: "";
      position: absolute;
      width: 8px;
      height: 8px;
      background: #4efef9;
      border-radius: 50%;
      left: 4px;
      top: 6px;
    }
  }
  .panel-content {
    display: flex;
  }
  .panel-right {
    flex: 1;
  }
  .operation {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    .month-total {
      width: 150px;
      margin-right: 20px;
      p {
        color: rgba(255, 255, 255, 0.6);
      }
    }
    .progress {
      flex: 1;
      ::v-deep .my-progress {
        padding-top: 20px !important;
      }
    }
  }
  .operation-ratio {
    display: flex;
    justify-content: space-between;
    min-height: 130px;
    > div {
      text-align: center;
      color: #ffffff;
      width: 100px;
      position: relative;
      width: auto;
      ::v-deep .charts-empty {
        background-size: 102px;
        margin-top: 6px;
      }
      .value {
        position: absolute;
        left: 50%;
        top: 35px;
        transform: translate(-50%, 0);
        display: flex;
        align-items: center;
        font-size: 18px;
      }
      p {
        width: 100px;
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        box-shadow: 0px 0px 6px 0px #007276 inset;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        margin: 0 auto 0;
      }
    }
    ::v-deep .gauge-group {
      height: 90px;
    }
  }
}
</style>
