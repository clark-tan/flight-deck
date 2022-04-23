/*
 * @Autor: clark tan
 * @Date: 2021-08-23 19:19:45
 * @LastEditors: clark tan
 * @LastEditTime: 2021-08-23 19:36:28
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

export interface IUserInfo {
  userInfo: any;
}

@Module({ dynamic: true, store, name: "userInfo" })
class UserInfo extends VuexModule implements IUserInfo {
  public userInfo = {};

  @Mutation
  private SET_USER_INFO(data: any) {
    this.userInfo = data;
  }

  @Action
  public async getUserInfo() {
    const res = await API.auth.getUserInfo();
    this.SET_USER_INFO(res);
  }
}
export const UserModule = getModule(UserInfo);
