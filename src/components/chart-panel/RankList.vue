<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:56:59
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-16 17:17:41
 * @Description: 排行榜
-->
<template>
  <!-- @scroll.prevent="ulScroll" -->
  <div
    class="rankListBox"
    :class="[dataList.length < 6 && 'no-scroll']"
    ref="scrollBox"
    @mousemove="closeScroll"
    @mouseleave="openScroll"
  >
    <ul v-if="!isEmpty">
      <li
        v-for="(item, index) in dataList"
        :key="index"
        :class="{ active: index < 3 }"
      >
        <div class="flex-1">
          <span :class="['numberCss', index < 3 ? 'numberCssBg' : '']">
            {{ index > 8 ? index + 1 : `0${index + 1}` }}
          </span>
          <a-tooltip
            :title="item[textFiled]"
            :mouseEnterDelay="0.3"
            :overlayClassName="'map-tooltip rank-list'"
          >
            <span class="flex-text">
              {{ item[textFiled] }}
            </span>
          </a-tooltip>
        </div>
        <span :class="['moneyCss', index < 3 ? 'top3' : '']">
          <number-increase
            :endVal="item[valueFiled]"
            fontSize="18px"
            :unit="unit"
          />
        </span>
      </li>
    </ul>
    <ChartsEmpty v-else :type="'rankEmpty'" :size="size" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { FormatMoney } from "format-money-js";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ChartsEmpty from "@/components/smaller-module/ChartsEmpty.vue";
import { numberTransition } from "@/utils/NumberTransition";
import { AppConfigModule } from "@/store/app-config";
@Component({
  components: {
    NumberIncrease,
    ChartsEmpty,
  },
})
export default class RankList extends Vue {
  @Prop({
    default: () => [
      {
        label: "耳鼻喉科",
        value: "653893.32",
      },
      {
        label: "神经内科",
        value: "509003.01",
      },
      {
        label: "针灸推拿科",
        value: "492401.55",
      },
      {
        label: "呼吸内科",
        value: "32329.29",
      },
      {
        label: "内分泌科",
        value: "3062.48",
      },
    ],
  })
  dataList: any;
  @Prop({
    default: () => {
      return {
        toFix: 2,
        type: 2, //0 不转换 1位数字，2位金钱
      };
    },
  })
  @Prop({ default: "label" })
  textFiled: any;
  @Prop({ default: "value" }) valueFiled: any;
  @Prop() size: any;
  @Prop({
    default: () => {
      const delayTime = AppConfigModule.commonConfig.scrollTime || 3000;
      return delayTime;
    },
  })
  delayTime: any;
  numberType: any;

  formatMoney = new FormatMoney();
  unit: any = "";
  scrollTime = 0;
  scrollFlag: any = true;
  initStatues: any = false;
  isEmpty: any = false;
  @Watch("dataList")
  dataListChange(data: any) {
    this.unit = "";
    const item = data[0];
    if (item) {
      this.unit = numberTransition(item[this.valueFiled], 5, "unit");
    }
    this.checkDataIsEmty(data, this.valueFiled);
    this.scrollFlag = true;
    this.initAnimation(false);
    this.scrollTime = Date.now();
  }
  mounted() {
    this.scrollTime = Date.now();
    this.scrollAnimation();
  }
  ulScroll() {
    // this.scrollFlag = true;
    this.scrollTime = Date.now();
  }
  fixNumber(value: any) {
    return this.formatMoney.from(Number(value), {
      decimals: this.numberType.toFix,
    });
  }
  initAnimation(type: any) {
    const scrollBox: any = this.$refs.scrollBox;
    if (scrollBox) {
      const boxHeight = scrollBox.offsetHeight;
      scrollBox.scrollTo({
        top: type ? boxHeight : 0,
        behavior: "smooth",
      });
    }
  }
  scrollAnimation() {
    requestAnimationFrame(() => {
      const time = Date.now();
      const subTime = time - this.scrollTime;
      if (this.dataList.length > 5) {
        if (subTime >= this.delayTime) {
          this.initAnimation(this.scrollFlag);
          this.scrollFlag = !this.scrollFlag;
          this.scrollTime = time;
        }
      }
      this.scrollAnimation();
    });
  }
  openScroll() {
    this.scrollTime = Date.now();
    this.$emit("rankingHover", false);
  }
  closeScroll() {
    this.scrollTime = new Date("9999-12-31").getTime();
    this.$emit("rankingHover", true);
  }
  fixMoney(value: any) {
    return this.formatMoney.from(Number(value), {
      symbol: "¥ ",
      decimals: this.numberType.toFix,
    });
  }
  changeFun(value: any) {
    switch (this.numberType?.type) {
      case 0:
        return value;
      case 1:
        return this.fixNumber(value);
      case 2:
        return this.fixMoney(value);
      default:
        return value;
    }
  }
  checkDataIsEmty(data: any, key: any) {
    let isEmpty = true;
    data.forEach((item: any) => {
      const flag = numberTransition(item[key], "isEmpty");
      isEmpty = isEmpty ? flag : false;
    });
    this.isEmpty = isEmpty;
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/less/variable.less";
.rankListBox {
  height: 100%;
  clear: both;
  overflow: auto;
  &.no-scroll {
    overflow: hidden;
  }
  > ul {
    padding: 0 10px;
  }
  li {
    width: 100%;
    display: flex;
    align-items: center;
    height: 38px;
    line-height: 38px;
    font-size: 16px;
    color: @label-text-color;
    .numberCss {
      background: url("../../assets/images/svg/normaltree.svg") center center
        no-repeat;
      color: #4efef9;
      background-size: 100% 100%;
      width: 40px;
      height: 38px;
      line-height: 40px;
      display: inline-block;
      text-align: center;
      margin-right: 16px;
    }
    .numberCssBg {
      background: url("../../assets/images/svg/extree.svg") center center
        no-repeat;
      color: #ffffff;
    }
    .flex-1 {
      display: flex;
      flex: 1;
    }
    .moneyCss {
      display: flex;
    }
    .top3 {
      color: #42ecee;
    }
  }
  li.active {
    span {
      color: #fff;
    }
    ::v-deep .numbers {
      .unit {
        color: @label-text-color;
      }
    }
  }
  .numbers {
    display: inline-block;
  }
  .unit {
    font-size: 12px;
    margin-left: 8px;
    color: #fff;
    opacity: 0.6;
    transform: translateY(3px);
  }
  .flex-text {
    width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style>
.rank-list.map-tooltip .ant-tooltip-inner {
  transform: translateY(15px);
}
</style>
