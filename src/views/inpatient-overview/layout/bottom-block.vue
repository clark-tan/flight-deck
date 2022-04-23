<!--
 * @Author: clark tan
 * @Date: 2021-11-11 19:18:36
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-16 18:01:50
 * @Description: 
-->
<template>
  <div class="bg-bottom pointer-events-none">
    <floating-population />
    <operations />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FloatingPopulation from "../components/floating-population.vue";
import Operations from "../components/operations.vue";

@Component({
  components: {
    FloatingPopulation,
    Operations,
  },
})
export default class BottomBlock extends Vue {}
</script>

<style lang="less" scoped>
.bg-bottom {
  position: absolute;
  left: 0;
  z-index: 9;
  top: calc(1080px - 362px);
  width: calc(1500 / 1920 * 100%);
  height: 362px;
  border-radius: 2px;
  padding: 32px 60px 48px 120px;
  display: flex;
  background: linear-gradient(
    180deg,
    rgba(#123a51, 0.2) 0%,
    rgba(0, 43, 58, 0.8) 98%
  );
}
</style>
