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
import moment from "moment";
import API from "@/api/index";

import { cloneDeep } from "lodash";
import { ToolBarModule } from "@/store/tool-bar/index";
import { shortNames } from "@/utils/Enumerate";

@Module({ dynamic: true, store, name: "pageCode" })
class PageCodeModule extends VuexModule {
  private codes: any = {
    //********收支情况********statisticsValue**** */
    YEAR_OP_ET_MEDICINE_INCOME_RATIO: {
      belongTo: [],
      type: "year",
      valueFiled: "statisticsValue",
      size: 1,
    }, // 门急诊药收入占比（当前值）
    YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
      size: 1,
    }, //门急诊药收入占比年目标(年目标)
    YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门急诊药占比预警
    YEAR_IP_MEDICINE_INCOME_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
      size: 1,
    }, // 住院药收入占比
    YEAR_IP_MEDICINE_INCOME_RATIO_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
      size: 1,
    }, //住院药收入占比年目标
    YEAR_IP_MEDICINE_INCOME_RATIO_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 住院药收入占比预警
    //----------门诊，住院收入排行-----------------
    DAY_OP_DEP_INCOME: {
      //日门诊科室收入
      type: "day",
      size: 10,
      order: "desc",
      orderBys: ["statistics_value"],
    },
    DAY_IP_DEP_INCOME: {
      //日住院科室收入
      type: "day",
      size: 10,
      order: "desc",
      orderBys: ["statistics_value"],
    },
    MONTH_OP_DEP_INCOME: {
      //月门诊科室收入
      type: "month",
      size: 10,
      order: "desc",
      orderBys: ["statistics_value"],
    },
    MONTH_IP_DEP_INCOME: {
      //月住院科室收入
      type: "month",
      size: 10,
      order: "desc",
      orderBys: ["statistics_value"],
    },
    //***************资源效率***************
    DAY_BEDNUM: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 开放床位数 ?? 是否有月数据
    YEAR_AVG_BEDDAY: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 平均住院日
    MONTH_BED_TURNOVER_TIMES: {
      type: "month",
      prev: 5,
    }, // 床位周转次数
    YEAR_BED_TURNOVER_TIMES_GUIDE: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 床位周转次数（预警线）
    MONTH_BEDUSE_RATIO: {
      type: "month",
      prev: 5,
    }, // 床位使用率
    YEAR_BEDUSE_RATIO_GUIDE: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 床位使用率（预警线）
    //**************中间面板--收入情况--动态（随“天”、“月”时间切换变化）*************
    //--------------日收入-------------------
    DAY_OP_ET_INCOME: {
      type: "day",
      valueFiled: "statisticsValue",
      prev: 1, // 往前推一天
    }, // 日门急诊收入
    DOD_OP_ET_INCOME: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日门急诊收入环比
    DOD_OP_ET_INCOME_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日门急诊收入环比预警
    DAY_IP_INCOME: {
      type: "day",
      valueFiled: "statisticsValue",
      prev: 1,
    }, //日住院收入
    DOD_IP_INCOME: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日住院收入环比
    DOD_IP_INCOME_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日住院收入环比预警
    DAY_INCOME: {
      type: "day",
      valueFiled: "statisticsValue",
      prev: 1,
    }, // 日收入
    DOD_INCOME: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日收入环比
    DOD_INCOME_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日收入环比预警
    //-----------------月收入----------------
    MONTH_OP_ET_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
      prev: 1, // 往前推一天
    }, //月门急诊收入
    MOM_OP_ET_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月门急诊收入环比
    MOM_OP_ET_INCOME_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月门急诊收入环比预警
    MONTH_IP_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
      prev: 1, // 往前推一天
    }, // 月住院收入
    MOM_IP_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月住院收入环比
    MOM_IP_INCOME_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月住院收入环比预警
    MONTH_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
      prev: 1, // 往前推一天
    }, //月收入
    MOM_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月收入环比
    MOM_INCOME_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月收入环比预警
    // *************中间面板--收入情况--固定（无需随“天”、“月”时间变化）********
    YEAR_OP_ET_INCOME: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门急诊累计收入
    YEAR_OP_ET_INCOME_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //门急诊收入年目标
    YEAR_OP_ET_INCOME_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门急诊收入年目标预警
    YEAR_OP_ET_INCOME_TARGET_YIELD_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //门急诊收入年目标达成率
    YEAR_IP_INCOME: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //住院累计收入
    YEAR_IP_INCOME_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //住院收入年目标
    YEAR_IP_INCOME_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 住院收入年目标达预警
    YEAR_IP_INCOME_TARGET_YIELD_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //住院收入年目标达成率
    YEAR_INCOME: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计收入
    YEAR_INCOME_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //收入年目标
    YEAR_INCOME_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //收入年预警
    YEAR_INCOME_TARGET_YIELD_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //收入年目标达成率

    //*********************** 功能定位---动态（日月切换）*************
    //----------日-----------
    DAY_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
      prev: 1,
    }, // 医疗总人次
    DOD_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升
    DOD_PERSONS_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日人次环比预警
    DAY_OPERATION_TIMES: {
      type: "day",
      valueFiled: "statisticsValue",
      prev: 1,
    }, // 日手术台数
    DOD_OPERATION_TIMES: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--日手术台数
    DOD_OPERATION_TIMES_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日手术台数环比预警
    //------------月-----------
    MONTH_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
      prev: 1,
    }, // 医疗总人次
    MOM_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升
    MOM_PERSONS_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月人次环比预警
    MONTH_OPERATION_TIMES: {
      type: "month",
      valueFiled: "statisticsValue",
      prev: 1,
    }, // 月手术台数
    MOM_OPERATION_TIMES: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升
    MOM_OPERATION_TIMES_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月手术台数环比预警
    YEAR_PERSONS: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计人次
    YEAR_PERSONS_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计人次年目标
    YEAR_PERSONS_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计人次年目标预警

    YEAR_PERSONS_TARGET_YIELD_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计人次年目标达成率

    YEAR_OPERATION_TIMES: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计手术台数
    YEAR_OPERATION_TIMES_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计手术台数年目标
    YEAR_OPERATION_TIMES_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计手术台数年目标预警
    YEAR_OPERATION_TIMES_TARGET_YIELD_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计手术台数年目标达成率
    //---------------门急诊和出入院人次-----------------------
    //----------------------日--门急诊---------------
    DAY_ET_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 日急诊人次
    DAY_OP_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 日门诊人次
    MONTH_OP_PERSONS: {
      type: "month",
      prev: 5,
      // outpatient: {
      //   prev: 1, // 往前推一天
      //   valueFiled: "statisticsValue",
      // },
    }, //月门诊人次
    DOD_OP_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--日门诊人次
    DOD_OP_PERSONS_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 日门诊人次环比预警
    MONTH_ET_PERSONS: {
      type: "month",
      prev: 5,
      // outpatient: {
      //   prev: 1, // 往前推一天
      //   valueFiled: "statisticsValue",
      // },
    }, //月急诊人次
    DOD_ET_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--日急诊人次
    DOD_ET_PERSONS_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 日急诊人次环比预警
    //---------------------日--出入院---------------
    DAY_HOSPITALIZED_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 日入院人次
    DAY_DISCHARGE_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 日出院人次
    MONTH_DISCHARGE_PERSONS: {
      type: "month",
      prev: 5,
    }, //月出院人次
    DOD_DISCHARGE_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--日出院人次
    MONTH_HOSPITALIZED_PERSONS: {
      type: "month",
      prev: 5,
    }, //月入院人次
    DOD_HOSPITALIZED_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--日入院人次
    DOD_DISCHARGE_PERSONS_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日出院人次环比预警
    DOD_HOSPITALIZED_PERSONS_WARNING: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //日入院人次环比预警
    MOM_OP_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--月门诊人次
    MOM_OP_PERSONS_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 月门诊人次环比预警
    MOM_ET_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--日急诊人次
    MOM_ET_PERSONS_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 月急诊人次环比预警
    MOM_DISCHARGE_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--月出院人次
    MOM_HOSPITALIZED_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 对比前一次数据的提升--月入院人次环比
    MOM_DISCHARGE_PERSONS_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月出院人次环比预警
    MOM_HOSPITALIZED_PERSONS_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月入院人次环比预警
    // *********************门急诊（页面）*************************
    // MONTH_OP_DEP_INCOME/YEAR_OP_ET_MEDICINE_INCOME_RATIO/YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET
    // YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING
    MONTH_OP_FEE_PER_VISIT: {
      type: "month",
      valueFiled: "statisticsValue",
      prev: 1,
    }, //门诊次均费用
    MOM_OP_FEE_PER_VISIT: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 门诊次均费用环比
    MOM_OP_FEE_PER_VISIT_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 门诊次均费用环比预警
    MONTH_OP_INCOME: {
      type: "month",
      prev: 5,
    }, //月门诊收入
    MONTH_ET_INCOME: {
      type: "month",
      prev: 5,
    }, //月急诊收入
    //------------------服务流程------------------------
    MONTH_RESERVE_PERSONS: {
      type: "month",
      // valueFiled: "statisticsValue",
      prev: 5,
    }, // 月预约人次
    YEAR_RESERVE_PERSONS: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 预约累计人次
    MONTH_WITHDRAW_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 月退号人次
    YEAR_WITHDRAW_PERSONS: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //退号人次累计
    MONTH_RESERVE_WAY_PERSONS_RATIO: {
      type: "month",
      size: 6,
      order: "desc",
      orderBys: ["statistics_value"],
    }, //月预约渠道人次占比
    MONTH_REGISTER_TYPE_PERSONS_RATIO: {
      type: "month",
      noSize: true,
      order: "desc",
      orderBys: ["statistics_value"],
    }, //挂号类型占比（原出诊级别占比）
    RESERVE_PERSONS_GUIDE: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 月预约人次(辅助线)
    MONTH_RESERVE_RATIO: {
      type: "month",
      prev: 5,
    }, // 月预约率
    RESERVE_RATIO_GUIDE: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 月预约率(辅助线)

    //---------------------门急诊面板--------------------
    // MONTH_OP_ET_INCOME/MOM_OP_ET_INCOME/YEAR_OP_ET_INCOME/YEAR_OP_ET_INCOME_TARGET
    // YEAR_OP_ET_INCOME_WARNING/YEAR_OP_ET_INCOME_TARGET_YIELD_RATIO/MONTH_OP_INCOME
    // MONTH_ET_INCOME/MOM_OP_ET_INCOME_WARNING
    MOM_OP_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月门诊收入环比
    YEAR_OP_INCOME: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门诊累计收入
    MOM_ET_INCOME: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月急诊收入环比
    YEAR_ET_INCOME: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门诊累计收入
    MOM_OP_INCOME_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月门诊收入环比预警
    MOM_ET_INCOME_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月急诊收入环比预警
    // MONTH_OP_PERSONS/MOM_OP_PERSONS/MONTH_ET_PERSONS/MOM_ET_PERSONS/
    // MOM_OP_PERSONS_WARNING/MOM_OP_PERSONS_WARNING
    MONTH_OP_ET_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
      prev: 1, // 往前推一天
    }, // 月门急诊人次
    MOM_OP_ET_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 月门急诊人次环比
    YEAR_OP_ET_PERSONS: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计门急诊人次
    YEAR_OP_ET_PERSONS_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计门急诊人次年目标
    YEAR_OP_ET_PERSONS_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 累计门急诊人次年目标预警
    YEAR_OP_ET_PERSONS_TARGET_YIELD_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //累计门急诊人次年目标达成率
    YEAR_OP_PERSONS: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门诊累计人次
    YEAR_ET_PERSONS: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门诊累计收入
    MOM_OP_ET_PERSONS_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月门急诊人次环比预警
    //*******************住院************************ */
    //-----------------中心面板-------------------
    // MONTH_IP_INCOME、MOM_IP_INCOME、YEAR_IP_INCOME、YEAR_IP_INCOME_TARGET、YEAR_IP_INCOME_TARGET_YIELD_RATIO
    //YEAR_IP_INCOME_WARNING、MOM_IP_INCOME_WARNING
    //-----------------左侧面板-------------------
    MONTH_IP_MT_60_DAY_PERSONS: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //住院超60天人次
    MONTH_SPECIAL_CARE_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //特级护理人次
    MONTH_CRITICAL_PATIENT_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //危重患者人次
    MONTH_RESCUE_PATIENT_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //抢救患者人次
    MONTH_DEAD_PATIENT_PERSONS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //死亡患者人次
    DAY_IN_HOSPITAL_PERSON: {
      type: "day",
      valueFiled: "statisticsValue",
    }, //在院人数
    YEAR_HOSPITALIZED_PERSONS: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //入院累计人次进度预警
    YEAR_HOSPITALIZED_PERSONS_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 入院累计人次年目标
    YEAR_HOSPITALIZED_PERSONS_TARGET_YIELD_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //入院累计人次目标达成率
    YEAR_HOSPITALIZED_PERSONS_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, //入院累计人次进度预警
    //--------------底部-------------------
    //MONTH_HOSPITALIZED_PERSONS、MOM_HOSPITALIZED_PERSONS、MOM_DISCHARGE_PERSONS_WARNING
    //MONTH_DISCHARGE_PERSONS、MOM_DISCHARGE_PERSONS、MOM_HOSPITALIZED_PERSONS_WARNING
    MONTH_IP_BACK_PERSONS_IN_24_HOURS: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //住院24小时内重返人次数
    MONTH_IP_BACK_PERSONS_IN_15_DAY: {
      type: "month",
      valueFiled: "statisticsValue",
    }, // 住院15天内重返人次数
    //MONTH_OPERATION_TIMES、MOM_OPERATION_TIMES、YEAR_OPERATION_TIMES、YEAR_OPERATION_TIMES_TARGET
    //YEAR_OPERATION_TIMES_TARGET_YIELD_RATIO、YEAR_OPERATION_TIMES_WARNING
    MONTH_OPERATION_LEVEL_TIMES_RATIO: {
      type: "month",
      valueFiled: "statisticsValue",
      outpatient: {
        dimensionTypeLevel: "四级",
      },
    }, //月各级手术人次数占比
    MONTH_MIN_INVASIVE_OPERATION_TIMES_RATIO: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月微创手术人次占比
    MONTH_SAMEDAY_OPERATION_TIMES_RATIO: {
      type: "month",
      valueFiled: "statisticsValue",
    }, //月日间手术人次占比
    //---------------右侧---------------------
    // YEAR_IP_MEDICINE_INCOME_RATIO、YEAR_IP_MEDICINE_INCOME_RATIO_TARGET、YEAR_IP_MEDICINE_INCOME_RATIO_WARNING
    MONTH_IP_FEE_PER_TIMES: {
      type: "month",
      valueFiled: "statisticsValue",
    },
    MOM_IP_FEE_PER_TIMES: {
      type: "month",
      valueFiled: "statisticsValue",
    },
    MOM_IP_FEE_PER_TIMES_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    },
    MONTH_IP_MEDICINE_FEE_PER_TIMES: {
      type: "month",
      valueFiled: "statisticsValue",
    },
    MOM_IP_MEDICINE_FEE_PER_TIMES: {
      type: "month",
      valueFiled: "statisticsValue",
    },
    MOM_IP_MEDICINE_FEE_PER_TIMES_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
    },
    YEAR_IP_CONSUMABLE_INCOME_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_IP_CONSUMABLE_INCOME_RATIO_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_IP_CONSUMABLE_INCOME_RATIO_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    },
  };
  @Action({ rawError: true })
  public async getCodeData(paramsName: any) {
    const getParamsCode = (paramsKeys: any) => {
      // 通过传入的指标名获取指标配置
      const codes = this.codes;
      if (typeof paramsKeys === "string") {
        return codes[paramsKeys];
      } else if (Array.isArray(paramsKeys)) {
        const list: any = {};
        paramsKeys.forEach((key: any) => {
          list[key] = codes[key];
        });
        return list;
      }
      return {};
    };
    const getTimeByType = (type: any, prev = 0) => {
      const _newDate = moment().subtract(prev, type);
      let time: any = null;
      switch (type) {
        case "day":
          time = _newDate.format("YYYY-MM-DD");
          break;
        case "month":
          time = _newDate.format("YYYY-MM");
          break;
        case "year":
          time = _newDate.format("YYYY");
          break;
      }
      return time;
    };
    const getParamsData = (paramsKey: any) => {
      // 通过指标名获取参数
      let keys: any = getParamsCode(paramsKey);
      keys = JSON.parse(JSON.stringify(keys));
      const pageKey = shortNames[ToolBarModule.activeView];
      const paramsList: any = [];
      const keysList = Object.keys(keys);
      keysList.forEach(async (key: any) => {
        const item: any = keys[key];
        if (!item) {
          return;
        }
        Object.assign(item, item[pageKey]);
        let time: any = null;
        let startTime: any = null;
        time = getTimeByType(item.type);
        startTime = getTimeByType(item.type, item.prev);
        item.enumerate = item.enumerate || key;
        const data: any = {
          code: key,
          startTime: startTime,
          endTime: time,
        };
        if (item.order) {
          data.order = item.order;
        }
        if (item.orderBys) {
          data.orderBys = item.orderBys;
        }
        if (item.dimensionTypeLevel) {
          data.dimensionTypeLevel = item.dimensionTypeLevel;
        }
        if (item.size) {
          data.size = item.size;
        } else if (!item.prev && !item.noSize) {
          data.size = 1;
        }
        paramsList.push(data);
      });
      return { params: paramsList, keyConfig: keys };
    };
    const forEachData = (data: any, valueFiled: any) => {
      const list: any = [];
      data.forEach((item: any) => {
        if (valueFiled) {
          list.push(item[valueFiled]);
        } else {
          list.push(item);
        }
      });
      return list;
    };
    const disposalData = (dataObj: any, res: any, keyConfig: any) => {
      Object.keys(res).forEach((key: any) => {
        const config = keyConfig[key];
        let list: any = [];
        res[key].forEach((item: any) => {
          const data = forEachData(item.dataList, config.valueFiled);
          list = list.concat(data);
        });
        if (config.valueFiled && list.length === 1) {
          dataObj[config.enumerate] = list[0];
        } else {
          dataObj[config.enumerate] = list;
        }
      });
    };
    const params: any = getParamsData(paramsName);
    const res = await API.hostipal.getStatisticsData(params.params);
    const dataObj: any = {};
    disposalData(dataObj, res, params.keyConfig);
    await this.setPageData(dataObj);
  }
  private _pageData: any = {};
  get pageData() {
    return cloneDeep(this._pageData);
  }
  @Mutation
  private SET_PAGE_DATA(data: any) {
    this._pageData = data;
  }
  @Action
  async setPageData(data: any) {
    const newPageData = Object.assign(this.pageData, data);
    this.SET_PAGE_DATA(newPageData);
  }
  @Action
  async clearPageData() {
    this.SET_PAGE_DATA({});
  }
  // 当前页面所有的指标
  private _currentPageCodes: any = [];
  @Mutation
  private SET_CURRENT_PAGE_CODES(data: any) {
    this._currentPageCodes = data;
  }
  @Action
  async setCurrentPageCodes(data: Array<string>) {
    const newPageCodes = this._currentPageCodes.concat(data);
    this.SET_CURRENT_PAGE_CODES(newPageCodes);
  }
  @Action
  async clearCurrentPageCodes() {
    this.SET_CURRENT_PAGE_CODES([]);
  }
  get currentPageCodes() {
    return cloneDeep(this._currentPageCodes);
  }
}
export const PageCode = getModule(PageCodeModule);
