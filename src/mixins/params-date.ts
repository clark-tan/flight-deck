import { Component, Vue } from "vue-property-decorator";
import moment from "moment";

@Component({
  components: {},
})
export default class ParamsDate extends Vue {
  date: any = new Date();

  get year() {
    return this.date.getFullYear();
  }
  get month() {
    const month = this.date.getMonth() + 1;
    return month > 9 ? month : "0" + month;
  }
  get day() {
    const day = this.date.getDate();
    return day > 9 ? day : "0" + day;
  }

  get currentDay() {
    return moment().format("YYYY-MM-DD");
  }

  get currentMonth() {
    return moment().format("YYYY-MM");
  }

  get lastMonth() {
    const result = moment().subtract(1, "month").format("YYYY-MM");
    return result;
  }

  get latestHalfYear() {
    const num = this.day == 1 ? 6 : 5;
    const result = moment().subtract(num, "month").format("YYYY-MM");
    return result;
  }
}
