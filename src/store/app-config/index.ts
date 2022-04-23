/*
 * @Autor: clark tan
 * @Date: 2021-08-23 19:19:45
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-16 17:06:43
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
import API from "@/api/index";
import { dateCnName } from "@/utils/Enumerate";
import { cloneDeep } from "lodash";
import { ToolBarModule } from "@/store/tool-bar/index";

@Module({ dynamic: true, store, name: "appConfig" })
class AppConfig extends VuexModule {
  private _appConfig: any = {};
  public menuCollapse: any = false; // 菜单展开收起
  private _cycleValue: any = "day"; // 头部的数据周期
  private _hospital: any = {};
  private _tabChange: any = false; // tab自动切换
  public iconLibrary: any = "svg";
  public fullscreen: any = false; // 全屏配置
  private _pageConfig: any = {}; // 页面配置（包括地图配置）
  private _commonConfig: any = {}; // 配置数据
  @Mutation
  private INIT_APP_CONFIG(data: any) {
    this._appConfig = data;
  }
  @Mutation
  private SET_CYCLE_VALUE(data: any) {
    this._cycleValue = data;
  }
  @Mutation
  private SET_HOSPITAL(data: any) {
    this._hospital = data;
  }
  @Mutation
  private SET_TAB_CHANGE() {
    this._tabChange = !this._tabChange;
  }
  @Mutation
  private SET_FULL_SCREEN(data: any) {
    this.fullscreen = data;
  }
  @Mutation
  private SET_PAGE_CONFIG(key: any) {
    const list = this._commonConfig.listMap || [];
    const newObj = list.filter((item: any) => {
      return item.id === key;
    });
    this._pageConfig = newObj; // && newObj.length ? newObj[0] : {}
  }
  @Mutation
  private SET_COMMON_CONFIG(data: any) {
    this._commonConfig = data;
  }
  @Action
  async InitAppConfig() {
    try {
      const res = await API.config.initConfig();
      this.INIT_APP_CONFIG(res);
    } catch (error) {
      console.log(error);
    }
  }
  @Action
  async setCycleValue(data: any) {
    this.SET_CYCLE_VALUE(data);
  }
  @Action
  async setHospital(data: any) {
    this.SET_HOSPITAL(data);
  }
  @Action
  async setTabChange() {
    this.SET_TAB_CHANGE();
  }
  @Action
  async setFullscreen(data: any) {
    this.SET_FULL_SCREEN(data);
  }
  @Action
  async setPageConfig(data: any) {
    this.SET_PAGE_CONFIG(data);
  }
  @Action
  async setCommonConfig(data: any) {
    this.SET_COMMON_CONFIG(data);
  }
  //***********医院总览---时间切换***********
  get cycleValue() {
    // 时间类型---天、月
    return this._cycleValue;
  }
  get dateCnNames() {
    // 时间类型-对应的部分文本内容
    return dateCnName[this._cycleValue];
  }

  get hospital() {
    return cloneDeep(this._hospital);
  }

  get appConfig() {
    // 通过深拷贝切断外界对 store 的引用值的直接修改途径
    // 要修改需走 mutaion 或 action
    return cloneDeep(this._appConfig);
  }
  get tabChange() {
    return this._tabChange;
  }
  get commonConfig() {
    return cloneDeep(this._commonConfig);
  }
  get pageConfig() {
    const key = ToolBarModule.activeView;
    const list = this._commonConfig.listMap || [];
    const newObj =
      list.filter((item: any) => {
        return item.id === key;
      }) || [];
    // this._pageConfig = newObj;
    return newObj[0];
    // return this._pageConfig;
  }
}
export const AppConfigModule = getModule(AppConfig);
