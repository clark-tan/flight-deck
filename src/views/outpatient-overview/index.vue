<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:06:34
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-24 15:35:24
 * @Description: 
-->
<template>
  <div class="overview">
    <!--left-charts-->
    <BottomView
      class="
        position
        bottom-view
        common-animation-translate-bottom
        common-animation-translate-bottom-outpatient-leave
      "
      :tabActive="tabActive"
    />
    <IncomePanel class="position panel-view" @activeChange="activeChange" />
    <!--rihgt-charts-->
    <RightView
      class="
        position
        right-view
        common-animation-translate-right
        common-animation-translate-right-outpatient-leave
      "
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BottomView from "./BottomView.vue";
import RightView from "./RightView.vue";
import IncomePanel from "./IncomePanel.vue";
@Component({
  components: {
    BottomView,
    RightView,
    IncomePanel,
  },
})
export default class OutpatientOverview extends Vue {
  tabActive = "key_1";
  activeChange(val: any) {
    this.tabActive = val;
  }
}
</script>

<style lang="less" scoped>
@bottom-view-height: 278px;
@bottom-view-bottom: 0;
@right-view-top: 104px;
@right-view-height: 974px;
@right-view-width: 396px;
.position {
  position: absolute;
  z-index: 2;
}
.panel-view {
  left: 281px;
  top: 145px;
  z-index: 20;
}
.bottom-view {
  width: calc(1500 / 1920 * 100%);
  bottom: @bottom-view-bottom;
  height: @bottom-view-height;
  background: linear-gradient(
    180deg,
    rgba(0, 43, 58, 0),
    rgba(0, 43, 58, 0.8) 98%
  );
  padding-bottom: 48px;
}
.right-view {
  height: @right-view-height;
  top: @right-view-top;
  // width: @right-view-width;
  // width: calc(396 / 1920 * 100%);
  width: 456px;
  // background: linear-gradient(90deg, transparent, black);
  background: linear-gradient(
    90deg,
    rgba(0, 43, 58, 0.4),
    rgba(0, 43, 58, 0.8) 98%
  );
  box-shadow: none;
  right: 0;
}
</style>
