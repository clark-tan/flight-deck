import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "@/store";

@Module({ dynamic: true, store, name: "inpatient" })
class Inpatient extends VuexModule {
  public income: any = null;
  public monthIpFee: any = {
    mom: null,
    value: null,
  };
  public monthIpMedicineFee: any = {
    mom: null,
    value: null,
  };
  public ipConsumableIncome: any = {
    mom: null,
    value: null,
  };
  public ipMedicineIncome: any = [];

  @Mutation
  MONTH_INCOME(data: any) {
    this.income = data;
  }

  @Mutation
  MONTH_IP_FEE(data: any) {
    this.monthIpFee = data;
  }

  @Mutation
  MONTH_IP_MEDICINE_FEE(data: any) {
    this.monthIpMedicineFee = data;
  }

  @Mutation
  MONTH_IP_CONSUMABLE_INCOME(data: any) {
    this.ipConsumableIncome = data;
  }

  @Mutation
  MONTH_IP_MEDICINE_INCOME(data: any) {
    this.ipMedicineIncome = data;
  }

  @Action
  setMonthIncome(data: any) {
    this.MONTH_INCOME(data);
  }

  @Action
  setMonthIpFee(data: any) {
    this.MONTH_IP_FEE(data);
  }

  @Action
  setMonthIpMedicineFee(data: any) {
    this.MONTH_IP_MEDICINE_FEE(data);
  }

  @Action
  setIpConsumableIncome(data: any) {
    this.MONTH_IP_CONSUMABLE_INCOME(data);
  }

  @Action
  setIpMedicineIncome(data: any) {
    this.MONTH_IP_MEDICINE_INCOME(data);
  }
}
export const InpatientModule = getModule(Inpatient);
