import moment from "moment";
import API from "@/api";
// 下面的enumerate属性用来作为key存储数据，日和月的参数key值不同，为了显示取值方便，统一一个枚举
const paramsKeys: any = {
  //********收支情况********statisticsValue**** */
  incomeAndExpenditure: {
    YEAR_OP_ET_MEDICINE_INCOME_RATIO: {
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
  },
  incomeAndExpenditure_tab_ranking: {
    day_key_1: {
      DAY_OP_DEP_INCOME: {
        //日门诊科室收入
        type: "day",
        size: 10,
        order: "desc",
        orderBys: ["statistics_value"],
      },
    },
    day_key_2: {
      DAY_IP_DEP_INCOME: {
        //日住院科室收入
        type: "day",
        size: 10,
        order: "desc",
        orderBys: ["statistics_value"],
      },
    },
    month_key_1: {
      MONTH_OP_DEP_INCOME: {
        //月门诊科室收入
        type: "month",
        size: 10,
        order: "desc",
        orderBys: ["statistics_value"],
      },
    },
    month_key_2: {
      MONTH_IP_DEP_INCOME: {
        //月住院科室收入
        type: "month",
        size: 10,
        order: "desc",
        orderBys: ["statistics_value"],
      },
    },
  },
  // 资源效率
  resourceEfficiency: {
    DAY_BEDNUM: {
      type: "day",
      valueFiled: "statisticsValue",
    }, // 开放床位数 ?? 是否有月数据
    YEAR_AVG_BEDDAY: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 平均住院日
  },
  resourceEfficiency_tab_ben: {
    key_1: {
      MONTH_BED_TURNOVER_TIMES: {
        type: "month",
        enumerate: "chart_data",
        prev: 5,
      },
      YEAR_BED_TURNOVER_TIMES_GUIDE: {
        type: "year",
        enumerate: "chart_line",
        valueFiled: "statisticsValue",
      },
    },
    key_2: {
      MONTH_BEDUSE_RATIO: {
        type: "month",
        enumerate: "chart_data",
        prev: 5,
      },
      YEAR_BEDUSE_RATIO_GUIDE: {
        type: "year",
        enumerate: "chart_line",
        valueFiled: "statisticsValue",
      },
    },
  },
  //中间面板--收入情况--动态（随“天”、“月”时间切换变化）
  incomeStatistics_dynamic: {
    day: {
      DAY_OP_ET_INCOME: {
        type: "day",
        enumerate: "dynamic_1",
        valueFiled: "statisticsValue",
        prev: 1, // 往前推一天
      }, // 日门急诊收入
      DOD_OP_ET_INCOME: {
        type: "day",
        enumerate: "dynamic_1_1",
        valueFiled: "statisticsValue",
      }, //日门急诊收入环比
      DOD_OP_ET_INCOME_WARNING: {
        type: "day",
        enumerate: "ratioWaringOut",
        valueFiled: "statisticsValue",
      }, //日门急诊收入环比预警
      DAY_IP_INCOME: {
        type: "day",
        enumerate: "dynamic_2",
        valueFiled: "statisticsValue",
        prev: 1,
      }, //日住院收入
      DOD_IP_INCOME: {
        type: "day",
        enumerate: "dynamic_2_1",
        valueFiled: "statisticsValue",
      }, //日住院收入环比
      DOD_IP_INCOME_WARNING: {
        type: "day",
        enumerate: "ratioWaringIp",
        valueFiled: "statisticsValue",
      }, //日住院收入环比预警
      DAY_INCOME: {
        type: "day",
        enumerate: "dynamic_3",
        valueFiled: "statisticsValue",
        prev: 1,
      }, // 日收入
      DOD_INCOME: {
        type: "day",
        enumerate: "dynamic_3_1",
        valueFiled: "statisticsValue",
      }, //日收入环比
      DOD_INCOME_WARNING: {
        type: "day",
        enumerate: "ratioWaring",
        valueFiled: "statisticsValue",
      }, //日收入环比预警
    },
    month: {
      MONTH_OP_ET_INCOME: {
        type: "month",
        enumerate: "dynamic_1",
        valueFiled: "statisticsValue",
        prev: 1, // 往前推一天
      }, //月门急诊收入
      MOM_OP_ET_INCOME: {
        type: "month",
        enumerate: "dynamic_1_1",
        valueFiled: "statisticsValue",
      }, //月门急诊收入环比
      MOM_OP_ET_INCOME_WARNING: {
        type: "month",
        enumerate: "ratioWaringOut",
        valueFiled: "statisticsValue",
      }, //月门急诊收入环比预警
      MONTH_IP_INCOME: {
        type: "month",
        enumerate: "dynamic_2",
        valueFiled: "statisticsValue",
        prev: 1, // 往前推一天
      }, // 月住院收入
      MOM_IP_INCOME: {
        type: "month",
        enumerate: "dynamic_2_1",
        valueFiled: "statisticsValue",
      }, //月住院收入环比
      MOM_IP_INCOME_WARNING: {
        type: "month",
        enumerate: "ratioWaringIp",
        valueFiled: "statisticsValue",
      }, //月住院收入环比预警
      MONTH_INCOME: {
        type: "month",
        enumerate: "dynamic_3",
        valueFiled: "statisticsValue",
        prev: 1, // 往前推一天
      }, //月收入
      MOM_INCOME: {
        type: "month",
        enumerate: "dynamic_3_1",
        valueFiled: "statisticsValue",
      }, //月收入环比
      MOM_INCOME_WARNING: {
        type: "month",
        enumerate: "ratioWaring",
        valueFiled: "statisticsValue",
      }, //月收入环比预警
    },
  },
  // 中间面板--收入情况--固定（无需随“天”、“月”时间变化）
  IncomeStatistics: {
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
  },
  // 功能定位---动态（日月切换）
  functionalOrientation_dynamic: {
    day: {
      DAY_PERSONS: {
        // 医疗总人次
        type: "day",
        enumerate: "total",
        valueFiled: "statisticsValue",
        prev: 1,
      },
      DOD_PERSONS: {
        // 对比前一次数据的提升
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "ratio_by_before",
      },
      DOD_PERSONS_WARNING: {
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringPerson",
      }, //日人次环比预警
      DAY_OPERATION_TIMES: {
        // 日手术台数
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "operation_num",
        prev: 1,
      },
      DOD_OPERATION_TIMES: {
        // 对比前一次数据的提升--日手术台数
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "operation_ratio_by_before",
      },
      DOD_OPERATION_TIMES_WARNING: {
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringOpt",
      }, //日手术台数环比预警
    },
    month: {
      MONTH_PERSONS: {
        // 医疗总人次
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "total",
        prev: 1,
      },
      MOM_PERSONS: {
        // 对比前一次数据的提升
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "ratio_by_before",
      },
      MOM_PERSONS_WARNING: {
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringPerson",
      }, //月人次环比预警
      MONTH_OPERATION_TIMES: {
        // 月手术台数
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "operation_num",
        prev: 1,
      },
      MOM_OPERATION_TIMES: {
        // 对比前一次数据的提升
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "operation_ratio_by_before",
      },
      MOM_OPERATION_TIMES_WARNING: {
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringOpt",
      }, //月手术台数环比预警
    },
  },
  functionalOrientation: {
    YEAR_PERSONS: {
      //累计人次
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_PERSONS_TARGET: {
      //累计人次年目标
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_PERSONS_WARNING: {
      //累计人次年目标预警
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_PERSONS_TARGET_YIELD_RATIO: {
      //累计人次年目标达成率
      type: "year",
      valueFiled: "statisticsValue",
    },

    YEAR_OPERATION_TIMES: {
      //累计手术台数
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_OPERATION_TIMES_TARGET: {
      //累计手术台数年目标
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_OPERATION_TIMES_WARNING: {
      //累计手术台数年目标预警
      type: "year",
      valueFiled: "statisticsValue",
    },
    YEAR_OPERATION_TIMES_TARGET_YIELD_RATIO: {
      //累计手术台数年目标达成率
      type: "year",
      valueFiled: "statisticsValue",
    },
  },
  functionalOrientation_tab_persons: {
    day_key_1: {
      /*********     门急诊趋势及出入院趋势均不显示日维度，全部改成月维度       **************/
      // DAY_OP_PERSONS: {
      DAY_ET_PERSONS: {
        // 日急诊人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "current_persons2",
      },
      DAY_OP_PERSONS: {
        // 日门诊人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "current_persons1",
      },
      MONTH_OP_PERSONS: {
        //月门诊人次
        type: "month",
        prev: 5,
        enumerate: "peosons1_chart",
      },
      DOD_OP_PERSONS: {
        // 对比前一次数据的提升--日门诊人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "peosons1_ratio",
      },
      DOD_OP_PERSONS_WARNING: {
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringLeft",
      }, // 日门诊人次环比预警
      MONTH_ET_PERSONS: {
        //月急诊人次
        type: "month",
        prev: 5,
        enumerate: "peosons2_chart",
      },
      DOD_ET_PERSONS: {
        // 对比前一次数据的提升--日急诊人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "peosons2_ratio",
      },
      DOD_ET_PERSONS_WARNING: {
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringRight",
      }, // 日急诊人次环比预警
    },
    day_key_2: {
      DAY_HOSPITALIZED_PERSONS: {
        // 日入院人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "current_persons1",
      },
      DAY_DISCHARGE_PERSONS: {
        // 日出院人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "current_persons2",
      },
      MONTH_DISCHARGE_PERSONS: {
        //日出院人次
        type: "month",
        prev: 5,
        enumerate: "peosons2_chart",
      },
      DOD_DISCHARGE_PERSONS: {
        // 对比前一次数据的提升--日出院人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "peosons2_ratio",
      },
      MONTH_HOSPITALIZED_PERSONS: {
        //日入院人次
        type: "month",
        prev: 5,
        enumerate: "peosons1_chart",
      },
      DOD_HOSPITALIZED_PERSONS: {
        // 对比前一次数据的提升--日入院人次
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "peosons1_ratio",
      },
      DOD_DISCHARGE_PERSONS_WARNING: {
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringRight",
      }, //日出院人次环比预警
      DOD_HOSPITALIZED_PERSONS_WARNING: {
        type: "day",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringLeft",
      }, //日入院人次环比预警
    },
    month_key_1: {
      MONTH_OP_PERSONS: {
        //月门诊人次
        type: "month",
        // valueFiled: "statisticsValue",
        prev: 5,
        enumerate: "peosons1_chart",
      },
      MOM_OP_PERSONS: {
        // 对比前一次数据的提升--月门诊人次
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "peosons1_ratio",
      },
      MOM_OP_PERSONS_WARNING: {
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringLeft",
      }, // 月门诊人次环比预警
      MONTH_ET_PERSONS: {
        //月急诊人次
        type: "month",
        // valueFiled: "statisticsValue",
        prev: 5,
        enumerate: "peosons2_chart",
      },
      MOM_ET_PERSONS: {
        // 对比前一次数据的提升--日急诊人次
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "peosons2_ratio",
      },
      MOM_ET_PERSONS_WARNING: {
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringRight",
      }, // 月急诊人次环比预警
    },
    month_key_2: {
      MONTH_DISCHARGE_PERSONS: {
        //月出院人次
        type: "month",
        // valueFiled: "statisticsValue",
        prev: 5,
        enumerate: "peosons2_chart",
      },
      MOM_DISCHARGE_PERSONS: {
        // 对比前一次数据的提升--月出院人次
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "peosons1_ratio",
      },
      MONTH_HOSPITALIZED_PERSONS: {
        //月入院人次
        type: "month",
        // valueFiled: "statisticsValue",
        prev: 5,
        enumerate: "peosons1_chart",
      },
      MOM_HOSPITALIZED_PERSONS: {
        // 对比前一次数据的提升--月入院人次环比
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "peosons2_ratio",
      },
      MOM_DISCHARGE_PERSONS_WARNING: {
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringRight",
      }, //月出院人次环比预警
      MOM_HOSPITALIZED_PERSONS_WARNING: {
        type: "month",
        valueFiled: "statisticsValue",
        enumerate: "ratioWaringLeft",
      }, //月入院人次环比预警
    },
  },

  outpatient_bottom_view: {
    MONTH_OP_DEP_INCOME: {
      //月门诊科室收入
      type: "month",
      enumerate: "dep_income",
      size: 10,
      order: "desc",
      orderBys: ["statistics_value"],
    },
    YEAR_OP_ET_MEDICINE_INCOME_RATIO: {
      type: "year",
      valueFiled: "statisticsValue",
      enumerate: "ratio_current_value",
      size: 1,
    }, // 门急诊药收入占比（当前值）
    YEAR_OP_ET_MEDICINE_INCOME_RATIO_TARGET: {
      type: "year",
      valueFiled: "statisticsValue",
      enumerate: "ratio_target_value",
      size: 1,
    }, //门急诊药收入占比年目标(年目标)
    YEAR_OP_ET_MEDICINE_INCOME_RATIO_WARNING: {
      type: "year",
      valueFiled: "statisticsValue",
    }, // 门急诊药占比预警
    MONTH_OP_FEE_PER_VISIT: {
      //门诊次均费用
      type: "month",
      valueFiled: "statisticsValue",
      enumerate: "out_average_value",
      prev: 1,
    },
    MOM_OP_FEE_PER_VISIT: {
      // 门诊次均费用环比
      type: "month",
      valueFiled: "statisticsValue",
      enumerate: "out_average_ratio_value",
    },
    MOM_OP_FEE_PER_VISIT_WARNING: {
      type: "month",
      valueFiled: "statisticsValue",
      enumerate: "ratioWaring",
    }, // 门诊次均费用环比预警
  },
  outpatient_bottom_view_tab: {
    key_1: {
      MONTH_OP_INCOME: {
        //月门诊收入
        type: "month",
        prev: 5,
        enumerate: "trend_chart_1",
      },
      MONTH_ET_INCOME: {
        //月急诊收入
        type: "month",
        prev: 5,
        enumerate: "trend_chart_2",
      },
    },
    key_2: {
      MONTH_OP_PERSONS: {
        //月门诊人次
        type: "month",
        prev: 5,
        enumerate: "trend_chart_1",
      },
      MONTH_ET_PERSONS: {
        //月急诊人次
        type: "month",
        prev: 5,
        enumerate: "trend_chart_2",
      },
    },
  },
  outpatient_right_view: {
    MONTH_RESERVE_PERSONS: {
      // 月预约人次
      type: "month",
      valueFiled: "statisticsValue",
      enumerate: "month_appointment",
    },
    YEAR_RESERVE_PERSONS: {
      // 预约累计人次
      type: "year",
      valueFiled: "statisticsValue",
      enumerate: "total_appointment",
    },
    MONTH_WITHDRAW_PERSONS: {
      // 月退号人次
      type: "month",
      valueFiled: "statisticsValue",
      enumerate: "month_back_number",
    },
    YEAR_WITHDRAW_PERSONS: {
      //退号人次累计
      type: "year",
      valueFiled: "statisticsValue",
      enumerate: "total_back_number",
    },
    MONTH_RESERVE_WAY_PERSONS_RATIO: {
      //月预约渠道人次占比
      type: "month",
      noSize: true,
      order: "asc",
      orderBys: ["statistics_value"],
      enumerate: "appointment_ratio",
    },
    MONTH_REGISTER_TYPE_PERSONS_RATIO: {
      //挂号类型占比（原出诊级别占比）
      type: "month",
      noSize: true,
      enumerate: "doctor_ratio",
    },
  },
  outpatient_right_view_tab: {
    key_1: {
      MONTH_RESERVE_PERSONS: {
        // 月预约人次
        type: "month",
        enumerate: "predate_data",
        prev: 5,
      },
      RESERVE_PERSONS_GUIDE: {
        type: "year",
        enumerate: "guide_line",
        valueFiled: "statisticsValue",
      },
    },
    key_2: {
      MONTH_RESERVE_RATIO: {
        // 月预约率
        type: "month",
        enumerate: "predate_data",
        prev: 5,
      },
      RESERVE_RATIO_GUIDE: {
        type: "year",
        enumerate: "guide_line",
        valueFiled: "statisticsValue",
      },
    },
  },
  //门急诊面板
  outpatient_panel_tab: {
    key_1: {
      MONTH_OP_ET_INCOME: {
        type: "month",
        enumerate: "dynamic_1",
        valueFiled: "statisticsValue",
        prev: 1, // 往前推一天
      }, //月门急诊收入
      MOM_OP_ET_INCOME: {
        type: "month",
        enumerate: "dynamic_1_1",
        valueFiled: "statisticsValue",
      }, //月门急诊收入环比
      YEAR_OP_ET_INCOME: {
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "current_total",
      }, // 门急诊累计收入
      YEAR_OP_ET_INCOME_TARGET: {
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "target_total",
      }, //门急诊收入年目标
      YEAR_OP_ET_INCOME_WARNING: {
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "progress_themes",
      }, // 门急诊收入年目标预警
      YEAR_OP_ET_INCOME_TARGET_YIELD_RATIO: {
        //门急诊收入年目标达成率
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "progress_value",
      },
      MONTH_OP_INCOME: {
        //月门诊收入
        type: "month",
        enumerate: "out_dynamic",
        prev: 1, // 往前推一天
        valueFiled: "statisticsValue",
      },
      MOM_OP_INCOME: {
        //月门诊收入环比
        type: "month",
        enumerate: "out_dynamic_ratio",
        valueFiled: "statisticsValue",
      },
      YEAR_OP_INCOME: {
        // 门诊累计收入
        type: "year",
        enumerate: "out_dynamic_total",
        valueFiled: "statisticsValue",
      },
      MONTH_ET_INCOME: {
        //月急诊收入
        type: "month",
        enumerate: "emergency_dynamic",
        prev: 1, // 往前推一天
        valueFiled: "statisticsValue",
      },
      MOM_ET_INCOME: {
        //月急诊收入环比
        type: "month",
        enumerate: "emergency_dynamic_ratio",
        valueFiled: "statisticsValue",
      },
      YEAR_ET_INCOME: {
        // 门诊累计收入
        type: "year",
        enumerate: "emergency_dynamic_total",
        valueFiled: "statisticsValue",
      },
      MOM_OP_ET_INCOME_WARNING: {
        type: "month",
        enumerate: "ratioWaringOut",
        valueFiled: "statisticsValue",
      }, //月门急诊收入环比预警
      MOM_OP_INCOME_WARNING: {
        type: "month",
        enumerate: "ratioWaringUp",
        valueFiled: "statisticsValue",
      }, //月门诊收入环比预警
      MOM_ET_INCOME_WARNING: {
        type: "month",
        enumerate: "ratioWaringDown",
        valueFiled: "statisticsValue",
      }, //月急诊收入环比预警
    },
    key_2: {
      MONTH_OP_ET_PERSONS: {
        // 月门急诊人次
        type: "month",
        enumerate: "dynamic_1",
        valueFiled: "statisticsValue",
        prev: 1, // 往前推一天
      },
      MOM_OP_ET_PERSONS: {
        // 月门急诊人次环比
        type: "month",
        enumerate: "dynamic_1_1",
        valueFiled: "statisticsValue",
      },
      YEAR_OP_ET_PERSONS: {
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "current_total",
      },
      YEAR_OP_ET_PERSONS_TARGET: {
        //累计门急诊人次年目标
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "target_total",
      },
      YEAR_OP_ET_PERSONS_WARNING: {
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "progress_themes",
      }, // 累计门急诊人次年目标预警
      YEAR_OP_ET_PERSONS_TARGET_YIELD_RATIO: {
        //累计门急诊人次年目标达成率
        type: "year",
        valueFiled: "statisticsValue",
        enumerate: "progress_value",
      },
      MONTH_OP_PERSONS: {
        //月门诊人次
        type: "month",
        enumerate: "out_dynamic",
        prev: 1, // 往前推一天
        valueFiled: "statisticsValue",
      },
      MOM_OP_PERSONS: {
        //月门诊人次环比
        type: "month",
        enumerate: "out_dynamic_ratio",
        valueFiled: "statisticsValue",
      },
      YEAR_OP_PERSONS: {
        // 门诊累计人次
        type: "year",
        enumerate: "out_dynamic_total",
        valueFiled: "statisticsValue",
      },
      MONTH_ET_PERSONS: {
        //月急诊人次
        type: "month",
        enumerate: "emergency_dynamic",
        prev: 1, // 往前推一天
        valueFiled: "statisticsValue",
      },
      MOM_ET_PERSONS: {
        //月急诊人次环比
        type: "month",
        enumerate: "emergency_dynamic_ratio",
        valueFiled: "statisticsValue",
      },
      YEAR_ET_PERSONS: {
        // 门诊累计收入
        type: "year",
        enumerate: "emergency_dynamic_total",
        valueFiled: "statisticsValue",
      },
      MOM_OP_ET_PERSONS_WARNING: {
        type: "month",
        enumerate: "ratioWaringOut",
        valueFiled: "statisticsValue",
      }, //月门急诊人次环比预警
      MOM_OP_PERSONS_WARNING: {
        type: "month",
        enumerate: "ratioWaringUp",
        valueFiled: "statisticsValue",
      }, //月门诊人次环比预警
      MOM_ET_PERSONS_WARNING: {
        type: "month",
        enumerate: "ratioWaringDown",
        valueFiled: "statisticsValue",
      }, //月急诊人次环比预警
    },
  },
};

const getParamsData = (paramsKey: any, type?: any) => {
  let _paramsKeys =
    typeof paramsKey === "string" ? paramsKeys[paramsKey] : paramsKey;
  if (type) {
    // 天或月 || tab
    _paramsKeys = _paramsKeys[type];
  }
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
  const paramsList: any = [];
  const keyConfig: any = {};
  const keys = _paramsKeys;
  Object.keys(_paramsKeys).forEach((key: any) => {
    const item = keys[key];
    let time: any = null;
    let startTime: any = null;
    time = getTimeByType(item.type);
    startTime = getTimeByType(item.type, item.prev);
    item.enumerate = item.enumerate || key;
    keyConfig[key] = item;
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
    if (item.size) {
      data.size = item.size;
    } else if (!item.prev && !item.noSize) {
      data.size = 1;
    }
    paramsList.push(data);
  });
  return { params: paramsList, keyConfig: keyConfig };
};
const forEachData = (data: any, valueFiled: any) => {
  const list: any = [];
  data.forEach((item: any) => {
    if (valueFiled) {
      list.push(item[valueFiled]);
      // list.push(null);
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
      list = list.concat(forEachData(item.dataList, config.valueFiled));
    });
    if (config.valueFiled && list.length === 1) {
      dataObj[config.enumerate] = list[0];
    } else {
      dataObj[config.enumerate] = list;
    }
  });
};
const getData = async (paramsName: any, type?: any) => {
  const params = getParamsData(paramsName, type);

  const res = await API.hostipal.getStatisticsData(params.params);
  const dataObj: any = {};
  disposalData(dataObj, res, params.keyConfig);
  const keys = Object.keys(dataObj);
  if (keys.length > 1) {
    return dataObj;
  } else {
    return dataObj[keys[0]];
  }
};

export { getParamsData, paramsKeys, getData };
