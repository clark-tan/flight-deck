<!--
 * @Author: clark tan
 * @Date: 2021-11-11 19:18:36
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-25 09:22:54
 * @Description: 
-->
<template>
  <h3 class="sub-title">
    <span class="title-text">{{ title }}</span
    ><i v-if="hasLine" class="line"></i>
  </h3>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  components: {},
})
export default class Compare extends Vue {
  @Prop({ default: "name" }) title: any; //文本
  @Prop({ default: false }) hasLine: any; //横线
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable.less";
@tips-color: #61fdff;
.sub-title {
  color: #fff;
  margin-bottom: 20px;
  padding-left: 22px;
  position: relative;
  line-height: 1;
  &::before {
    content: "";
    position: absolute;
    line-height: 1;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: @tips-color;
    left: 4px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(78, 254, 249, 0.3);
    border-radius: 50%;
    left: 0px;
  }
  display: flex;
  align-items: center;
  font-size: 20px;
  > .line {
    margin-left: 9px;
    flex: 1;
    height: 1px;
    background: @auxiliary-line;
    border-radius: 2px;
  }
}
</style>
