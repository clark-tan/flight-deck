<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:06:34
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-08 10:01:42
 * @Description: 
-->
<template>
  <div class="hospital-overview overview">
    <!--页面中间 收入统计面板-->
    <IncomeStatistics class="position newset-data" />
    <!--左侧  收支情况-->
    <div
      class="
        position
        left-view-box
        common-animation-translate-left
        common-animation-translate-left-hospital-leave
      "
    >
      <IncomeAndExpenditure class="revenue-and-expenditure" />
      <!--左侧  资源效率-->
      <ResourceEfficiency class="resource-efficiency" />
    </div>
    <!--右侧  功能定位-->
    <FunctionalOrientation
      class="
        position
        functional-positioning
        common-animation-translate-right
        common-animation-translate-right-hospital-leave
      "
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import IncomeAndExpenditure from "./panels/IncomeAndExpenditure.vue";
import ResourceEfficiency from "./panels/ResourceEfficiency.vue";
import IncomeStatistics from "./panels/IncomeStatistics.vue";
import FunctionalOrientation from "./panels/FunctionalOrientation.vue";

@Component({
  components: {
    IncomeAndExpenditure,
    ResourceEfficiency,
    IncomeStatistics,
    FunctionalOrientation,
  },
})
export default class App extends Vue {}
</script>

<style lang="less" scoped>
@left-and-right-panel-width: 396px;
@first-row-top: 105px;
@revenue-and-expenditure-height: 589px;
@resource-efficiency-height: 368px;
@functional-positioning-height: 973px;
.position {
  position: absolute;
  z-index: 2;
  overflow: hidden;
  &.left-view-box {
    top: @first-row-top;
    left: 0;
  }
}
.newset-data {
  width: calc(100% - @left-and-right-panel-width * 2 - 70px * 2);
  left: 50%;
  transform: translateX(-50%);
  top: calc(80px + 32px);
}
.hospital-overview {
  color: #fff;
}
.revenue-and-expenditure {
  height: @revenue-and-expenditure-height;
  width: @left-and-right-panel-width;
}
.resource-efficiency {
  height: @resource-efficiency-height;
  width: @left-and-right-panel-width;
  margin-top: 16px;
}
.functional-positioning {
  height: @functional-positioning-height;
  width: @left-and-right-panel-width;
  top: @first-row-top;
  right: 0;
}
</style>
