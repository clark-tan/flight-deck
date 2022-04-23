/*
 * @Autor: clark tan
 * @Date: 2021-08-12 13:48:32
 * @LastEditors: clark tan
 * @LastEditTime: 2021-08-17 11:54:26
 * @Description:
 */
/* eslint-disable */
/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 */
import Vue from "vue";
import {
  Input,
  Button,
  Switch,
  Radio,
  Select,
  Form,
  Row,
  Col,
  Modal,
  Tabs,
  Icon,
  Spin,
  Tree,
  TreeSelect,
  Descriptions,
  FormModel,
  Progress,
  Dropdown,
  Menu,
  Badge,
  Tooltip,
} from "ant-design-vue";

Vue.use(Input);
Vue.use(Button);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Form);
Vue.use(Row);
Vue.use(Col);
Vue.use(Modal);
Vue.use(Tabs);
Vue.use(Icon);
Vue.use(Spin);
Vue.use(Tree);
Vue.use(TreeSelect);
Vue.use(Descriptions);
Vue.use(FormModel);
Vue.use(Progress);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Badge);
Vue.use(Tooltip);
