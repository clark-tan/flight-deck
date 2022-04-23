<template>
  <div class="left-block pointer-events-none">
    <inpatient-person :showBox="subPanelShow" />
    <div class="circle" v-if="subPanelShow"></div>
    <svg v-if="svgPathShow" class="svg-line" width="80px" height="535px">
      <path
        d="M52 535 L52 15 L80 0"
        stroke-width="2"
        fill="transparent"
        stroke="rgba(32,144,148,0.6)"
        class="line-copy"
      />
    </svg>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import InpatientPerson from "../components/inpatient-person.vue";

@Component({
  components: {
    InpatientPerson,
  },
})
export default class LeftBlock extends Vue {
  svgPathShow: any = false;
  subPanelShow: any = false;
  mounted() {
    this.timeOut(async () => {
      this.svgPathShow = true;
      this.timeOut(() => {
        this.subPanelShow = true;
      }, 500);
    }, 1000);
  }
  // 定时器
  timeOut(callback: any, time: any) {
    const dateTime = Date.now();
    const run: any = () => {
      requestAnimationFrame(() => {
        const newTime = Date.now();
        if (newTime - dateTime >= time) {
          callback();
        } else {
          run();
        }
      });
    };
    run();
  }
}
</script>

<style lang="less" scoped>
@keyframes dash {
  from {
    stroke-dashoffset: 600px;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.left-block {
  position: absolute;
  z-index: 9;
  left: 0;
  top: 0;
  width: calc(513 / 1920 * 100%);
  height: 100%;
  .circle {
    position: absolute;
    width: 14px;
    height: 14px;
    background: rgba(19, 89, 93, 0.54);
    border-radius: 50%;
    left: 148px;
    top: 220px;
    &::after {
      content: "";
      position: absolute;
      width: 6px;
      height: 6px;
      background: #287f84;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
    }
  }
  .svg-line {
    position: absolute;
    left: 76px;
    top: 226px;
    .line-copy {
      stroke-dasharray: 600px;
      stroke-dashoffset: 0;
      animation: dash 0.5s linear;
    }
  }
}
</style>
