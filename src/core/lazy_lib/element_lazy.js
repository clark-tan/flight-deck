/*
 * @Autor: clark tan
 * @Date: 2021-08-17 11:50:10
 * @LastEditors: clark tan
 * @LastEditTime: 2021-08-31 18:03:26
 * @Description:
 */
/* eslint-disable */
/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 */
import Vue from 'vue'
//按需引入ElementUI
import {
  Dropdown, 
  DropdownMenu, 
  DropdownItem,
  Select, Option,
  Form, FormItem,
  Cascader,Steps,Step,
  Divider,Card,Switch,
  Popconfirm
} from 'element-ui';
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Cascader);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Divider);
Vue.use(Card);
Vue.use(Switch);
Vue.use(Popconfirm);
