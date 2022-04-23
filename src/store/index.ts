/*
 * @Autor: clark tan
 * @Date: 2021-09-29 16:59:17
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-09 11:34:56
 * @Description:
 */
import Vue from "vue";
import Vuex from "vuex";
// import { IAppState } from './modules/app'
// import { IUserState } from './modules/user'

Vue.use(Vuex);

/*eslint-disable */
export interface IRootState {
  // app: IAppState
  // user: IUserState
}

// // Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
