<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:56:59
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-08 11:01:45
 * @Description: 柱状图
-->
<template>
  <div class="e-charts-box">
    <div class="progress-item-list" v-if="!isEmpty">
      <div class="progress-item">
        <span class="text" v-for="item in chartData" :key="item[textFiled]">
          <a-tooltip
            :title="item[textFiled]"
            :mouseEnterDelay="0.3"
            :overlayClassName="'map-tooltip sort-bar-panel'"
          >
            <!-- :overlayStyle="{ transform: 'translateY(20px)' }" -->
            <span>{{ item[textFiled] }}</span>
          </a-tooltip>
        </span>
      </div>
      <div class="progress-item">
        <div class="bar-bg" v-for="item in chartData" :key="item[textFiled]">
          <div class="progress" :style="calcWidth(item[valueFiled])"></div>
        </div>
      </div>
      <div class="progress-item">
        <strong v-for="item in chartData" :key="item[textFiled]">
          <NumberIncrease :endVal="item[valueFiled]" :unit="unit" />
        </strong>
      </div>
    </div>
    <ChartsEmpty v-else :type="emptyType" :size="size" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { numberTransition } from "@/utils/NumberTransition";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
@Component({
  components: { ChartsEmpty, NumberIncrease },
})
export default class SortBarPanel extends Vue {
  @Prop({
    default: () => [],
  })
  chartData: any; // 地图数据
  @Prop({ default: "sortBar" })
  emptyType?: any;
  @Prop({ default: "dimensionTypeLevel" })
  textFiled?: any;
  @Prop({ default: "statisticsValue" })
  valueFiled?: any;
  @Prop({ default: "%" })
  unit?: any;
  @Prop() size: any;
  isEmpty: any = false;

  @Watch("chartData")
  chartDataChange() {
    this.mountedCharts();
  }
  mounted() {}
  createCharts() {}
  async mountedCharts() {
    this.checkIsEmpty(this.chartData, this.valueFiled);
  }

  calcWidth(curVal: any) {
    const percent = curVal / this.chartData[0][this.valueFiled];
    return {
      width: `${percent * 100}%`,
    };
  }
  checkIsEmpty(data: any, valueFiled: any) {
    let isEmpty = true;
    data.forEach((item: any) => {
      const flag = numberTransition(item[valueFiled], "isEmpty");
      isEmpty = isEmpty ? flag : false;
    });
    this.isEmpty = isEmpty;
  }
}
</script>

<style lang="less" scoped>
.progress-item-list {
  display: flex;
  width: 100%;
  .progress-item {
    align-items: center;
    line-height: 1;
    height: 16px;
    font-size: 14px;
    flex: 1;
    margin: -12px 0;
    strong {
      font-weight: normal;
      font-size: 18px;
    }
    span {
      flex-shrink: 0;
      margin-right: 20px;
      margin-left: 10px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 16px;
    }
    .text {
      max-width: 142px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bar-bg {
      background: rgba(255, 255, 255, 0.15);
      height: 8px;
      border-radius: 4px;
      position: relative;
      margin-right: 10px;
      .progress {
        position: absolute;
        height: 8px;
        background: linear-gradient(90deg, rgba(74, 154, 236, 0), #4a9aec);
        border-radius: 4px;
        left: 0;
      }
    }
    strong {
      flex: 1;
      text-align: right;
      ::v-deep .numbers {
        display: block;
      }
    }
    > * {
      line-height: 16px;
      margin-bottom: 12px;
      margin-top: 12px;
      display: block;
    }
    &:nth-child(1) {
      max-width: 155px;
      flex: none;
    }
    &:last-child {
      max-width: 84px;
      flex: none;
    }
    .bar-bg {
      background: rgba(255, 255, 255, 0.15);
      height: 8px;
      border-radius: 4px;
      position: relative;
      margin: 20px 20px 20px 0;
      &:first-child {
        margin-top: 16px;
      }
      &:last-child {
        margin-bottom: 16px;
      }
    }
  }
}
.progress-item {
  > span:first-child {
    color: #4efef9;
  }
  > strong:first-child {
    color: #42ecee;
  }
  > .bar-bg:first-child {
    .progress {
      background: linear-gradient(90deg, rgba(78, 254, 249, 0.1), #4efef9);
    }
  }
}
</style>
<style>
.sort-bar-panel.map-tooltip .ant-tooltip-inner {
  transform: translateY(5px);
}
</style>
