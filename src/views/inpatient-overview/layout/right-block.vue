<!--
 * @Author: clark tan
 * @Date: 2021-10-29 10:20:22
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-16 17:58:32
 * @Description: 
-->
<template>
  <div class="right-block">
    <div class="mt-16">
      <month-fee />
    </div>
    <div class="flex-1">
      <resource-efficient />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MonthFee from "../components/month-fee.vue";
import ResourceEfficient from "../components/resource-efficient.vue";

@Component({
  components: {
    MonthFee,
    ResourceEfficient,
  },
})
export default class RightBlock extends Vue {}
</script>

<style lang="less" scoped>
.right-block {
  position: absolute;
  z-index: 9;
  right: 0;
  top: 107px;
  // width: calc(396 / 1920 * 100%);
  width: 456px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 107px);
  .mt-16 {
    margin-bottom: 16px;
  }
  .flex-1 {
    min-height: 420px;
  }
}
</style>
