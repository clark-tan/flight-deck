<template>
  <div class="common-title-box" :class="[!hasBorder && 'border-none']">
    <span class="common-title">{{ text }}</span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {},
})
export default class CommonTitle extends Vue {
  @Prop({ default: 0 }) text: any;
  @Prop({ default: true }) hasBorder: any;
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.common-title-box {
  width: 100%;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}
.common-title {
  position: relative;
  bottom: -1px;
  display: inline-block;
  padding-bottom: 2px;
  padding-left: 25px;
  border-bottom: 3px solid @primary-color;
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  &::before {
    position: absolute;
    left: 0;
    bottom: 6px;
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    border: 2px solid @primary-color;
  }

  &::after {
    position: absolute;
    left: 6px;
    bottom: 12px;
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: @primary-color;
  }
}
.border-none {
  border: none;
  .common-title {
    border: none;
  }
}
</style>
