<template>
  <div class="panel">
    <h2>入出院及住院重返人次</h2>
    <div class="panel-content">
      <div class="panel-left">
        <div class="left-item">
          <div>
            <number-increase
              :endVal="inHospitalPerson"
              color="#fff"
              fontSize="24px"
              :emptyText="'- - -'"
              :isPerson="true"
              :decimals="2"
            />
            <NumberIncrease
              class="mom"
              :endVal="pageData.MOM_HOSPITALIZED_PERSONS"
              :unit="'%'"
              :hasArrow="true"
              :arrowType="pageData.MOM_DISCHARGE_PERSONS_WARNING"
              :fontSize="'18px'"
            />
          </div>
          <p>当月入院人次</p>
        </div>
        <div class="left-item">
          <div>
            <number-increase
              :endVal="dischargePerson"
              color="#fff"
              fontSize="24px"
              :emptyText="'- - -'"
              :isPerson="true"
              :decimals="2"
            />
            <NumberIncrease
              class="mom"
              :endVal="pageData.MOM_DISCHARGE_PERSONS"
              :unit="'%'"
              :hasArrow="true"
              :arrowType="pageData.MOM_HOSPITALIZED_PERSONS_WARNING"
              :fontSize="'18px'"
            />
          </div>
          <p>当月出院人次</p>
        </div>
        <div class="left-item">
          <div>
            <div class="inner-flex">
              <number-increase
                :endVal="pageData.MONTH_IP_BACK_PERSONS_IN_24_HOURS"
                color="#fff"
                fontSize="24px"
                :emptyText="'- - -'"
                :isPerson="true"
                :decimals="2"
              />
              <span>24h</span>
            </div>
            <div class="inner-flex">
              <number-increase
                :endVal="pageData.MONTH_IP_BACK_PERSONS_IN_15_DAY"
                color="#fff"
                fontSize="24px"
                :emptyText="'- - -'"
                :isPerson="true"
                :decimals="2"
              />
              <span>15d</span>
            </div>
          </div>
          <p>住院重返人次</p>
        </div>
      </div>
      <div class="panel-bar">
        <chart-bar class="bar-chart" :data="chartData" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ParamsDate from "@/mixins/params-date";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ChartBar from "./chart-bar.vue";
import { PageCode } from "@/store/page-code";
@Component({
  components: {
    NumberIncrease,
    ChartBar,
  },
  mixins: [ParamsDate],
})
export default class FloatingPopulation extends Vue {
  PageCode = PageCode;
  codes: any = [
    // 出院人次及环比
    "MONTH_HOSPITALIZED_PERSONS",
    "MOM_HOSPITALIZED_PERSONS",
    "MOM_DISCHARGE_PERSONS_WARNING",
    // 入院人次及环比
    "MONTH_DISCHARGE_PERSONS",
    "MOM_DISCHARGE_PERSONS",
    "MOM_HOSPITALIZED_PERSONS_WARNING",
    // 出入院趋势图
    "MONTH_HOSPITALIZED_PERSONS",
    "MONTH_DISCHARGE_PERSONS",
    // 住院重返人数
    "MONTH_IP_BACK_PERSONS_IN_24_HOURS",
    "MONTH_IP_BACK_PERSONS_IN_15_DAY",
  ];
  get pageData() {
    return this.PageCode.pageData;
  }
  get inHospitalPerson() {
    return this.getLastItemValue(this.pageData.MONTH_HOSPITALIZED_PERSONS);
  }
  get dischargePerson() {
    return this.getLastItemValue(this.pageData.MONTH_DISCHARGE_PERSONS);
  }
  // 出入院趋势图
  get chartData() {
    const data = this.pageData;
    const inList = data.MONTH_HOSPITALIZED_PERSONS || [];
    const outList = data.MONTH_DISCHARGE_PERSONS || [];
    let x: any = [],
      inData: any = [],
      outData: any = [];
    inList.map((v: any) => {
      x.push(v.dataDt);
    });
    outList.map((v: any) => {
      x.push(v.dataDt);
    });
    x = Array.from(new Set(x));
    inList.map((v: any) => {
      if (x.includes(v.dataDt)) {
        inData.push(null == v.statisticsValue ? "-" : v.statisticsValue);
      } else {
        inData.push("-");
      }
    });
    outList.map((v: any) => {
      if (x.includes(v.dataDt)) {
        outData.push(null == v.statisticsValue ? "-" : v.statisticsValue);
      } else {
        outData.push("-");
      }
    });

    return {
      x,
      inData,
      outData,
    };
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
      return item.statisticsValue;
    }
    return null;
  }
}
</script>

<style lang="less" scoped>
.panel {
  width: calc(950 / 1500 * 100%);
  h2 {
    margin-bottom: 32px;
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
  .panel-left {
    margin-right: 45px;
    .left-item {
      width: 250px;
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 2px;
      box-shadow: 0px 0px 6px 0px #007276 inset;
      margin-bottom: 22px;
      padding: 6px 12px;
      ::v-deep .numbers {
        line-height: 1;
      }
      > div {
        display: flex;
        align-items: center;
        height: 25px;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .inner-flex {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        .number-num {
          display: flex;
        }
        span {
          color: rgba(255, 255, 255, 0.8);
        }
        &:first-child {
          padding-right: 20px;
        }
        &:last-child {
          padding-left: 20px;
          &::after {
            content: "";
            width: 1px;
            height: 15px;
            background: rgba(255, 255, 255, 0.3);
            position: absolute;
            left: 0;
            top: 4px;
          }
        }
      }
      .num-unit {
        transform: translateY(4px);
      }
      .mom {
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        img {
          margin-left: 4px;
        }
      }
      p {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .panel-bar {
    width: calc(350 / 800 * 100%);
    height: 240px;
    pointer-events: auto;
    .bar-chart {
      height: 100%;
    }
  }
}
.mom {
  ::v-deep .ratio-arrow-icon {
    transform: initial;
  }
}
</style>
