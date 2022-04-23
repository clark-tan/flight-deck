<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:06:34
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-19 10:37:16
 * @Description: 
-->
<template>
  <div class="map-box">
    <div id="content" class="content" ref="boxModel">
      <Header
        v-if="loading"
        class="
          content-header
          common-animation-translate-top common-animation-translate-top-leave
        "
      />
      <!--overview-->
      <component v-if="loading" :is="activeView"> </component>
      <MapView @changeLoading="changeLoading" />
      <ToolBar />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import OutpatientOverview from "./outpatient-overview/index.vue";
import HospitalOverview from "./hospital-overview/index.vue";
import InpatientOverview from "./inpatient-overview/index.vue";
import MapView from "@/components/map/MapView.vue";
import ToolBar from "@/components/CircleToolBar.vue";
import { ToolBarModule } from "@/store/tool-bar/index";
import { AppConfigModule } from "@/store/app-config/index";
import { api as fullscreen } from "vue-fullscreen";
import { PageCode } from "@/store/page-code";
import { shortNames } from "@/utils/Enumerate";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken, getTokenName } from "@/utils/LocalStorage";

@Component({
  components: {
    Header,
    MapView,
    OutpatientOverview,
    HospitalOverview,
    InpatientOverview,
    ToolBar,
  },
})
export default class App extends Vue {
  PageCode = PageCode;
  stomp = null;
  ToolBarModule = ToolBarModule;
  loading = false;
  activeView: any = null;
  fullscreen = true;
  AppConfigModule = AppConfigModule;

  @Watch("ToolBarModule.activeView")
  async activeViewChange(val: any) {
    AppConfigModule.setPageConfig(val); // 更改页面配置
    PageCode.clearCurrentPageCodes(); // 清空指标数据
    this.commonAnimation(true); // 各个内容模块动画---离开
  }
  @Watch("AppConfigModule.fullscreen")
  fullscreenChange(val: any) {
    this.fullscreenToggle(val);
  }
  async sleep(time: any) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async created() {
    this.stompConnect();
  }

  async mounted() {
    window.addEventListener("resize", this.changeViewStyle);
    this.commonAnimation(false); // 各个内容模块动画---进入
    this.changeViewStyle();
  }

  destroyed() {
    window.removeEventListener("resize", this.changeViewStyle);
  }

  stompConnect() {
    if (!this.stomp) {
      const ws = new SockJS(
        `${
          AppConfigModule?.appConfig["webSocketUrl"] ||
          process.env.VUE_APP_WEBSOCKETURL + "/flight-deck/websocket"
        }`
      );
      const stomp = Stomp.over(ws);
      const name = getTokenName();
      const token = getToken();
      const headers: any = {};
      if (name && token) headers[name] = token;
      stomp.connect(
        headers,
        (evt: any) => {
          console.log(evt);
          stomp.subscribe("/topic/data", (message: { body: string }) => {
            console.log("接收订阅消息/topic/data=" + message.body);
            // 此处根据返回的数组调用updata store变量
            const list = message.body ? JSON.parse(message.body) : [];
            const codes = this.getCommonCodes(list);
            PageCode.getCodeData(codes);
          });
        },
        (err: any) => {
          console.log(err);
          //此处重连
          setTimeout(() => this.stompConnect(), 1000);
        }
      );
    }
  }

  changeViewStyle() {
    // 页面缩放
    let baseWidth = document.documentElement.clientWidth;
    let baseHeight = document.documentElement.clientHeight;
    let appStyle: any = document.getElementById("content")?.style;
    let realRatio = baseWidth / baseHeight;
    let designRatio = 16 / 9;
    let scaleRate = baseWidth / 1920;
    if (realRatio > designRatio) {
      scaleRate = baseHeight / 1080;
    }
    appStyle.transformOrigin = "left top";
    appStyle.transform = `scale(${scaleRate}) translate(-50%, -50%)`;
    appStyle.width = `${baseWidth / scaleRate}px`;
  }
  // 各个内容模块动画方法flag为true时--离开，false时--进入
  async commonAnimation(flag: any) {
    let list = [
      "common-animation-translate-top",
      "common-animation-opacity",
      "common-animation-translate-bottom",
      "common-animation-translate-left",
      "common-animation-translate-right",
    ];
    const animationObj: any = {};
    list.forEach((val: any) => {
      const elList = document.querySelectorAll(`.${val}`);
      animationObj[val] = elList;
    });
    const name = shortNames[this.activeView];
    Object.keys(animationObj).forEach((key: any, index: any) => {
      animationObj[key].forEach(async (item: any) => {
        if (index < 2) {
          if (flag) {
            item.classList.add(`${key}-leave`);
          } else {
            item.classList.remove(`${key}-leave`);
          }
        } else {
          if (flag) {
            item.classList.add(`${key}-${name}-leave`);
          } else {
            item.classList.remove(`${key}-${name}-leave`);
          }
        }
      });
    });
  }
  // 全屏
  fullscreenToggle(val: any) {
    if (val) {
      const box: any = document.getElementById("app");
      fullscreen.request(box, {
        teleport: false,
        pageOnly: false,
      });
    } else {
      fullscreen.exit();
    }
  }
  // 地图加载状态（地图动画是否结束）----flag为true时动画结束
  async changeLoading(flag: any) {
    this.loading = flag;
    if (flag && ToolBarModule.activeView !== this.activeView) {
      PageCode.clearPageData(); // 清空数据
      this.activeView = ToolBarModule.activeView; // 切换页面内容模块
      await this.sleep(10); // 等待dom挂载
      this.$nextTick(() => {
        this.commonAnimation(false);
      });
    }
  }
  get currentPageCodes() {
    return this.PageCode.currentPageCodes;
  }
  // 过滤后台返回的指标，保留属于当前页面的指标
  getCommonCodes(codesList: any) {
    const pageCodes = this.currentPageCodes;
    const commonCodesList = codesList.filter((key: any) => {
      if (pageCodes.includes(key)) {
        return key;
      }
    });
    return commonCodesList;
  }
}
</script>

<style lang="less" scoped>
.map-box {
  height: 100vh;
  width: 100%;
}
.content {
  width: 1920px;
  height: 1080px;
  transform-origin: left top;
  top: 50%;
  left: 50%;
  position: absolute;
  z-index: 20;
  overflow: hidden;
}
.content-header {
  pointer-events: auto;
  z-index: 100;
}
.tool-box {
  z-index: 100;
}
</style>
