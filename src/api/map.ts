/*
 * @Autor: clark tan
 * @Date: 2021-10-09 11:39:08
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-11 20:04:23
 * @Description:
 */
import request from "../request/index";
const serverPre = "/flight-deck/";
import { AppConfigModule } from "@/store/app-config";
import { getUrlParam } from "@/utils/Common";

export default {
  // 获取地图配置
  getMapConfig() {
    const hospitalId = getUrlParam(window.location.href, "hospitalId");
    // hospitalId参数（暂时获取url上的Id，如果没有，取接口返回的第一条数据医院ID）
    const hospital = AppConfigModule.hospital;
    return request.getWithErrorNotify(
      `${serverPre}config/web/getByHospitalId`,
      {
        hospitalId: hospitalId || hospital.hospitalId,
      }
    );
  },
  // 更新地图配置
  updateMapConfig(params: any) {
    const hospital = AppConfigModule.hospital;
    return request.postWithErrorNotify(`${serverPre}config/web/save`, {
      hospitalId: hospital.hospitalId,
      mapConfig: JSON.stringify(params),
    });
  },
};
