<template>
  <div class="center-block pointer-events-none">
    <month-income />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MonthIncome from "../components/month-income.vue";

@Component({
  components: {
    MonthIncome,
  },
})
export default class CenterBlock extends Vue {}
</script>

<style lang="less" scoped>
.center-block {
  position: absolute;
  left: calc(620 / 1920 * 100%);
  top: 180px;
  width: 486px;
  height: 459px;
  z-index: 9;
}
</style>
