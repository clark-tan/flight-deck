<!--
 * @Author: clark tan
 * @Date: 2021-11-08 19:05:48
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-09 10:19:35
 * @Description: 
-->
<template>
  <img
    v-if="momValue && Number(momValue) != 0"
    :src="
      require(`../assets/images/svg/${this.arrowColor}-${this.direction}.svg`)
    "
    class="ratio-arrow-icon"
  />
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class ArrowIcon extends Vue {
  @Prop({ default: 0 }) momValue?: any; // mom值
  @Prop() arrowType: any;

  get arrowColor() {
    return this.arrowType < 0 ? "terrible" : "normal";
  }
  get direction() {
    return this.momValue > 0 ? "up" : "down";
  }
}
</script>

<style lang="less" scoped>
.ratio-arrow-icon {
  transform: translateY(1px);
  display: inline-block;
  width: 16x;
  height: 16px;
}
</style>
