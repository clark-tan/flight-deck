<!--
 * @Autor: clark tan
 * @Date: 2021-10-20 14:07:03
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-20 20:02:55
 * @Description: 
-->
<template>
  <div class="tool-bar" :class="[openStatues && 'tool-bar-open']">
    <div class="hide-box">
      <div
        class="show-and-close-btn"
        v-show="!openStatues"
        @click="changeToolBarStatues"
      >
        <img
          class="tool-bg"
          src="@/assets/images/svg/circle-tool-bar/tool-btn-bg.svg"
        />
        <img
          src="@/assets/images/svg/circle-tool-bar/arrow-up.svg"
          class="btn-up"
        />
      </div>
    </div>

    <div class="content-box">
      <div class="close-btn" @click="changeToolBarStatues">
        <img src="@/assets/images/svg/circle-tool-bar/tool-btn-close.svg" />
      </div>
      <template v-for="item in ToolBarModule.viewList">
        <div
          :class="['conent', { active: activeView == item.view }]"
          :key="item.type"
        >
          <img
            @click="changeView(item)"
            :src="activeView == item.view ? item.iconOn : item.icon"
            class="btn"
          />
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
export default class CircleToolBar extends Vue {
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
  get activeView() {
    return ToolBarModule.activeView;
  }
}
</script>

<style lang="less" scoped>
@tool-height: 99px;
@tool-width: 878px;
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(#35bdbe, 1);
  }
  75% {
    box-shadow: 0 0 0 10px rgba(#35bdbe, 0);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(#35bdbe, 0);
  }
}
@keyframes updown {
  25% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0px);
  }
}
.tool-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: @tool-width;
  margin: 0 auto;
  height: @tool-height;
  transform: translateY(100%);
  transition: transform 0.3s linear;
  z-index: 13;
  background: url("../assets/images/svg/circle-tool-bar/bg-shadow.svg") center -8px
    no-repeat;
  background-size: 100%;
  .hide-box {
    width: 100%;
    height: 42px;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(0, -100%);
    overflow: hidden;
    transition: all 1s linear;
  }
  .show-and-close-btn {
    position: absolute;
    height: 30px;
    width: 60px;
    top: 12px;
    left: 50%;
    transform: translate(-50%, 0);
    cursor: pointer;
    text-align: center;
    .tool-bg {
      width: 60px;
      height: 30px;
    }
    .btn-up {
      position: absolute;
      bottom: 4px;
      left: 25px;
      animation: updown 1s linear infinite;
    }
    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0px;
      top: 2px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) 1s infinite;
    }
    &::after {
      animation: pulse 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) 1.25s infinite;
    }
  }
  > .content-box {
    background: url("../assets/images/svg/circle-tool-bar/tool-bg-open.svg")
      center -8px no-repeat;
    background-size: 100%;
    width: @tool-width;
    height: @tool-height;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 0px 160px 30px;
    position: relative;
    .close-btn {
      position: absolute;
      bottom: 5px;
      z-index: 30;
      img {
        cursor: pointer;
        animation: updown 1s linear infinite;
      }
    }
    > .conent {
      width: 58%;
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      position: relative;
      .btn {
        width: 48%;
        transition: all 0.3s linear;
        position: absolute;
        bottom: -52px;
        transform-origin: bottom center;
        &:hover {
          transform: scale(1.3);
        }
      }
      &:nth-child(3) > .btn {
        transition: all 0.3s linear;
        bottom: -24px;
        transform-origin: center center;
      }
    }
    .active {
      .btn {
        transform: scale(1.3);
        position: absolute;
      }
    }
  }
  &.tool-bar-open {
    transform: translateY(0);
    .hide-box {
      top: auto;
      bottom: 0;
    }
    .conent > .btn {
      bottom: 0;
    }
    .conent:nth-child(3) > .btn {
      bottom: 28px;
    }
    .active {
      .btn {
        transform: scale(1.3);
        bottom: -3px;
        position: absolute;
      }
    }
  }
}
@keyframes identifier {
  from {
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
  to {
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
