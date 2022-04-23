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
export default {
  // 根据token获取用户信息
  getStatisticsData(bodyData: any) {
    const hospital = AppConfigModule.hospital;
    return request.postWithErrorNotify(
      `${serverPre}statistics/data`,
      bodyData,
      {
        hospitalId: hospital.hospitalId,
        groupId: hospital.groupId,
      }
    );
  },
  // 根据token获取用户信息
  getHospitalList() {
    return request.getWithErrorNotify(`${serverPre}hospital/list`);
  },
  getHospitalById(hospitalId: any) {
    return request.getWithErrorNotify(`${serverPre}hospital/selectById`, {
      hospitalId: hospitalId,
    });
  },
};
