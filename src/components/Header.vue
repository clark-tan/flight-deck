<template>
  <header>
    <div class="left-box">
      <div class="left-time">
        <!-- <p>监测数据更新截止时间：</p> -->
        <p>{{ nowTime }}</p>
      </div>
      <template v-if="ToolBarModule.activeView === 'HospitalOverview'">
        <a-radio-group class="cycle-box" :value="cycle" @change="changeCycle">
          <template v-for="(val, key) in dateBtnCnName">
            <a-radio-button :value="key" :key="key"> {{ val }} </a-radio-button>
          </template>
        </a-radio-group>
      </template>
    </div>
    <h2>
      {{ AppConfigModule.pageConfig.pageName }}
    </h2>
    <div class="right-box">
      <a-dropdown class="header-user-dropdown" :trigger="['click']">
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <a-icon type="user" /> {{ userName }} <a-icon type="down" />
        </a>
        <a-menu slot="overlay" @click="onClick">
          <a-menu-item key="1"> 我的工作台 </a-menu-item>
          <a-menu-item key="2"> 退出登录 </a-menu-item>
        </a-menu>
      </a-dropdown>
      <img
        class="fullscreen-btn"
        style="cursor: pointer; margin: 0 16px"
        :title="fullscreen ? '缩小' : '放大'"
        @click="fullscreenToggle"
        :src="
          require(`@/assets/images/svg/${
            fullscreen ? 'exit-full-screen' : 'full-screen'
          }.svg`)
        "
        alt=""
      />
    </div>
  </header>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import API from "@/api/index";
import sso from "@/utils/SSO";
import { setToken, getTokenName } from "@/utils/LocalStorage";
import { AppConfigModule } from "@/store/app-config";
import { ToolBarModule } from "@/store/tool-bar/index";
import { UserModule } from "@/store/user/index";
import { dateBtnCnName } from "@/utils/Enumerate";
import { Modal } from "ant-design-vue";
import moment from "moment";
@Component({
  components: {},
})
export default class Header extends Vue {
  cycle = "day";
  UserModule = UserModule;
  dateBtnCnName = dateBtnCnName;
  AppConfigModule = AppConfigModule;
  ToolBarModule = ToolBarModule;
  nowTime: any = null;
  get userName() {
    const userInfo: any = this.UserModule?.userInfo;
    return userInfo?.displayName;
  }
  get fullscreen() {
    return AppConfigModule.fullscreen;
  }
  mounted() {
    this.getNowTime();
  }
  getNowTime() {
    this.nowTime = moment().format("YYYY-MM-DD dddd HH:mm:ss");
    requestAnimationFrame(() => {
      this.getNowTime();
    });
  }
  changeCycle(e: any) {
    this.cycle = e.target.value;
    AppConfigModule.setCycleValue(e.target.value);
  }

  onClick({ key }: any) {
    if (key == 1) {
      this.goPersonCenter();
    } else {
      this.logoutConfirm();
    }
  }

  logoutConfirm() {
    Modal.confirm({
      title: `确定退出当前账号?`,
      maskClosable: false,
      okText: `退出`,
      cancelText: "取消",
      onOk: () => this.sureLogout(),
    });
  }

  goPersonCenter() {
    const ssoPersonalUrl = AppConfigModule.appConfig["sso.userCenterUrl"];
    location = sso.resolveUrl(ssoPersonalUrl) as any;
  }

  // 退出登录
  async sureLogout() {
    try {
      await API.auth.logout();
      setToken(getTokenName());
      sso.gotoLogin(true);
    } catch (error) {
      console.log(error);
    }
  }
  fullscreenToggle() {
    AppConfigModule.setFullscreen(!AppConfigModule.fullscreen);
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
@cycle-btn-color: #42ecee;
@header-text-color: #35bdbe;
header {
  height: 80px;
  line-height: 60px;
  width: 100%;
  text-align: center;
  //此处使用的svg图片需要在svg标签上加上 preserveAspectRatio="none meet" 属性，横纵才能兼容
  background: url("~@/assets/images/svg/bg-panel/bg-top.svg") center no-repeat;
  background-size: 100% 80px;
  z-index: 2;
  position: absolute;
  display: grid;
  grid: auto / 36% 28% 36%;
  .left-time {
    font-size: 20px;
    font-weight: 400;
    text-align: left;
    color: @header-text-color;
    line-height: 20px;
    margin: 0 16px;
  }
  > div {
    height: 50px;
    display: flex;
    align-items: center;
  }
  > h2 {
    color: #fff;
    font-size: 40px;
    line-height: 68px;
  }
  .cycle-box {
    ::v-deep .ant-radio-button-wrapper {
      width: 60px;
      height: 32px;
      border: 1px solid @cycle-btn-color;
      border-radius: 0px 2px 2px 0px;
      background-color: transparent;
      color: rgba(255, 255, 255, 0.6);
    }
    ::v-deep .ant-radio-button-wrapper:first-child {
      border-left: 1px solid @cycle-btn-color;
      border-radius: 2px 0 0 2px;
    }
    ::v-deep .ant-radio-button-wrapper-checked {
      box-shadow: 0px 0px 22px 0px @cycle-btn-color inset;
      color: @cycle-btn-color;
    }
  }
  .right-box {
    padding-right: 20px;
    flex-direction: row-reverse;
    .ant-dropdown-link {
      color: @header-text-color;
    }
    .fullscreen-btn {
      color: @header-text-color;
    }
  }
}
</style>
