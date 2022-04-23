/*
 * @Autor: clark tan
 * @Date: 2021-08-23 19:19:45
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-20 18:51:22
 * @Description:
 */
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";

@Module({ dynamic: true, store, name: "toolBar" })
class ToolBarClass extends VuexModule {
  public activeView: any = "HospitalOverview";
  public viewList: any = [
    {
      view: "OutpatientOverview",
      type: "门诊概况",
      // icon: require("../../assets/images/svg/circle-tool-bar/out-off.svg"),
      // iconOn: require("../../assets/images/svg/circle-tool-bar/out-on.svg"),
      icon: require("../../assets/images/svg/circle-tool-bar/out-normal.svg"),
      iconOn: require("../../assets/images/svg/circle-tool-bar/out-active.svg"),
    },
    {
      view: "HospitalOverview",
      type: "医院总览",
      // icon: require("../../assets/images/svg/circle-tool-bar/summary-off.svg"),
      // iconOn: require("../../assets/images/svg/circle-tool-bar/summary-on.svg"),
      icon: require("../../assets/images/svg/circle-tool-bar/summary-normal.svg"),
      iconOn: require("../../assets/images/svg/circle-tool-bar/summary-active.svg"),
    },
    {
      view: "InpatientOverview",
      type: "住院概况",
      // icon: require("../../assets/images/svg/circle-tool-bar/ip-off.svg"),
      // iconOn: require("../../assets/images/svg/circle-tool-bar/ip-on.svg"),
      icon: require("../../assets/images/svg/circle-tool-bar/ip-normal.svg"),
      iconOn: require("../../assets/images/svg/circle-tool-bar/ip-active.svg"),
    },
  ]; // 菜单展开收起

  @Mutation
  private ACTIVE_VIEW(data: any) {
    this.activeView = data;
  }
  @Mutation
  private VIEW_LIST(data: any) {
    this.viewList = data;
  }
  @Action
  async setActiveView(data: any) {
    this.ACTIVE_VIEW(data);
  }
  @Action
  async setViewList(data: any) {
    this.VIEW_LIST(data);
  }
}
export const ToolBarModule = getModule(ToolBarClass);
