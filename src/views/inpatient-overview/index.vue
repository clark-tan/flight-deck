<!--
 * @Author: clark tan
 * @Date: 2021-11-16 14:29:42
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-16 17:58:15
 * @Description: 
-->
<template>
  <div class="container overview">
    <left-block
      class="common-animation-opacity common-animation-opacity-leave"
    />
    <center-block
      class="common-animation-opacity common-animation-opacity-leave"
    />
    <bottom-block
      class="
        common-animation-translate-bottom
        common-animation-translate-bottom-inpatient-leave
      "
    />
    <right-block
      class="
        common-animation-translate-right
        common-animation-translate-right-inpatient-leave
      "
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CenterBlock from "./layout/cencer-block.vue";
import RightBlock from "./layout/right-block.vue";
import BottomBlock from "./layout/bottom-block.vue";
import LeftBlock from "./layout/left-block.vue";

@Component({
  components: {
    CenterBlock,
    RightBlock,
    BottomBlock,
    LeftBlock,
  },
})
export default class InpatientOverview extends Vue {}
</script>

<style lang="less" scoped></style>
