/*
 * @Autor: clark tan
 * @Date: 2021-10-18 17:42:53
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-26 14:05:01
 * @Description:
 */
import { Component, Vue, Watch } from "vue-property-decorator";
import { AppConfigModule } from "@/store/app-config";
@Component({
  components: {},
})
export default class TimerMixins extends Vue {
  timer: any = {};
  timerChange: any = false;
  delayTime = 30000;
  defaultOpenTimer = true;
  AppConfigModule = AppConfigModule;
  @Watch("delayTime")
  delayTimeChange() {
    this.clearTimer();
    this.TimerRun();
  }
  mounted() {
    const delayTime = AppConfigModule.commonConfig.tabChangeTime;
    if (delayTime) {
      this.delayTime = delayTime;
    }
    this.defaultOpenTimer && this.TimerRun(this.timer);
  }
  destoryed() {
    this.clearTimer(this.timer.timer);
  }
  clearTimer(timer?: any) {
    const _timer = timer || this.timer.timer;
    _timer && clearTimeout(_timer);
  }
  TimerRun(timerObj?: any, callBack?: any) {
    // 其他vue中调用需传入一个空对象，存储timer，
    timerObj = timerObj || this.timer;
    timerObj.timer = setTimeout(() => {
      if (callBack) {
        callBack();
      } else {
        this.timerChange = !this.timerChange;
        // 全局暂时未用到
        AppConfigModule.setTabChange();
      }
      this.TimerRun(timerObj, callBack);
    }, this.delayTime);
  }
  openOrcloseTimer(flag: any) {
    if (flag) {
      this.clearTimer();
    } else {
      this.TimerRun();
    }
  }
}
