<!--
 * @Autor: clark tan
 * @Date: 2021-10-18 19:09:39
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-19 15:13:07
 * @Description: 
-->
<template>
  <div class="display-panel">
    <div class="common-title-box">
      <span
        v-if="iconName"
        class="panel-icon"
        :style="{
          background: `url(${iconPath})  no-repeat`,
          backgroundSize: '100%',
        }"
      ></span>
      <span class="common-title">{{ text }}</span>
    </div>
    <div class="common-content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { AppConfigModule } from "@/store/app-config";
@Component({
  components: {},
})
export default class CommonTitle extends Vue {
  @Prop({ default: 0 }) text: any;
  @Prop() iconName: any;
  AppConfigModule = AppConfigModule;
  get iconLibraryName() {
    return this.AppConfigModule.iconLibrary;
  }
  get iconPath() {
    return require(`@/assets/images/${this.iconLibraryName}/${this.iconName}.svg`);
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.common-title-box {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(
    90deg,
    rgba(78, 254, 249, 0.2),
    rgba(78, 254, 249, 0)
  );
  background: linear-gradient(
    90deg,
    rgba(78, 254, 249, 0.2),
    rgba(78, 254, 249, 0)
  );
  position: relative;
  > .panel-icon {
    position: absolute;
    height: 28px;
    width: 28px;
    margin: 6px 6px 8px 18px;
  }
}
.common-title {
  position: relative;
  padding-left: 52px;
  font-size: 24px;
  font-weight: bold;
}
.display-panel {
  z-index: 10;
  color: #fff;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(0, 43, 58, 0.8),
    rgba(0, 43, 58, 0.4)
  );

  p {
    margin: 0;
  }
}
.common-content {
  padding: 10px 16px;
  height: calc(100% - 40px);
}
</style>
