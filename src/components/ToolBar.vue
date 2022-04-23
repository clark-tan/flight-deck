<template>
  <div class="tool-bar" :class="[openStatues && 'tool-bar-open']">
    <!--tool-bar-->
    <div class="show-and-close-btn" @click="changeToolBarStatues">
      <img src="@/assets/images/svg/circle-tool-bar/tool-btn.svg" class="btn" />
    </div>
    <div class="content-box">
      <template v-for="item in ToolBarModule.viewList">
        <div class="conent" @click="changeView(item)" :key="item.type">
          {{ item.type }}
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ToolBarModule } from "@/store/tool-bar/index";
@Component({
  components: {},
})
export default class ToolBar extends Vue {
  openStatues = false;
  ToolBarModule = ToolBarModule;
  changeToolBarStatues() {
    this.$set(this, "openStatues", !this.openStatues);
    // this.openStatues = !this.openStatues;
  }
  changeView(item: any) {
    ToolBarModule.setActiveView(item.view);
    this.changeToolBarStatues();
  }
}
</script>

<style lang="less" scoped>
.tool-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: #ffffff3a;
  transform: translateY(100%);
  transition: transform 0.3s linear;
  z-index: 13;
  > .show-and-close-btn {
    position: absolute;
    height: 50px;
    width: 100px;
    border-top-left-radius: 70px;
    border-top-right-radius: 70px;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    background: radial-gradient(
      at 50% 100%,
      red 50%,
      transparent 50%,
      rgba(53, 189, 190, 0.45) 80%,
      transparent 60%
    );
    cursor: pointer;
    animation: identifier 1s ease-in-out infinite;
    text-align: center;
    .btn {
      transform: scale(0.9);
      transform-origin: 50% 140px;
    }
  }
  > .content-box {
    margin: 0 -8px;
    padding: 16px;
    height: 100%;
    overflow-x: auto;
    white-space: nowrap;
    text-align: center;
    > .conent {
      height: 100%;
      background: red;
      color: #fff;
      margin: 0 8px;
      display: inline-block;
      width: calc(20% - 16px);
      cursor: pointer;
    }
  }
  &.tool-bar-open {
    transform: translateY(0);
  }
}
@keyframes identifier {
  0% {
    background: radial-gradient(
      at 50% 100%,
      red 50%,
      transparent 50%,
      rgba(53, 189, 190, 0.45) 50%,
      transparent 60%
    );
  }
  25% {
    background: radial-gradient(
      at 50% 100%,
      red 50%,
      transparent 50%,
      rgba(53, 189, 190, 0.45) 55%,
      transparent 60%
    );
  }
  50% {
    background: radial-gradient(
      at 50% 100%,
      red 50%,
      transparent 50%,
      rgba(53, 189, 190, 0.45) 60%,
      transparent 60%
    );
  }
  75% {
    background: radial-gradient(
      at 50% 100%,
      red 50%,
      transparent 50%,
      rgba(53, 189, 190, 0.45) 65%,
      transparent 60%
    );
  }
  100% {
    background: radial-gradient(
      at 50% 100%,
      red 50%,
      transparent 50%,
      rgba(53, 189, 190, 0.45) 70%,
      transparent 60%
    );
  }
}
</style>
