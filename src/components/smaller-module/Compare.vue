<template>
  <div class="ratio-text" :class="[align]">
    <template v-for="(item, index) in compareData">
      <div :key="item[textFiled]">
        <p
          :style="{
            color:
              (!checkValue(item[valueFiled]) && textColorList[index]) ||
              normalColor,
          }"
        >
          {{ item[textFiled] }}
        </p>
        <p :style="{ color: valueColor[index] }">
          <NumberIncrease
            class="numbers"
            :endVal="filter ? filter(item[valueFiled]) : item[valueFiled]"
            fontSize="18px"
            :unit="item[unitFiled] || unit[index]"
            :hasArrow="item.hasArrow"
            :arrowType="item.ratioWaring"
            :isPerson="item.isPerson"
            :color="valueColorList[index] || 'rgba(255, 255, 255, 0.8)'"
          ></NumberIncrease>
        </p>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import NumberIncrease from "@/components/NumberIncrease.vue";
import ArrowIcon from "@/components/ArrowIcon.vue";
import { numberTransition } from "@/utils/NumberTransition";
@Component({
  components: {
    NumberIncrease,
    ArrowIcon,
  },
})
export default class Compare extends Vue {
  @Prop({
    default: () => {
      return [
        {
          name: "当前值",
          value: null,
        },
        {
          name: "目标值",
          value: null,
        },
      ];
    },
  })
  compareData: any;
  @Prop({ default: "name" }) textFiled: any; //文本取值
  @Prop({ default: "value" }) valueFiled: any; //文本取值
  @Prop({ default: "unit" }) unitFiled: any; //文本取值
  @Prop({
    default: () => [],
  })
  unit: any; // 单位
  @Prop() filter: any; // 数据处理
  @Prop()
  textColor: any;
  @Prop({ default: () => [] }) valueColor: any;
  @Prop() themes: any;
  @Prop({ default: "center" }) align: any;

  normalColor = "rgba(255,255,255,0.6)";
  colorList: any = {
    normal: ["#25fcc1"],
    warnning: ["#faf475"],
    terrible: ["#dc4b46"],
  };

  get textColorList() {
    let color = ["rgba(255,255,255,0.6)", "rgba(255,255,255,0.6)"];
    if (this.themes) {
      color = this.colorList[this.themes];
    } else if (this.textColor) {
      color = this.textColor;
    }
    return color;
  }

  get valueColorList() {
    let color = ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.8)"];
    if (this.themes) {
      color = this.colorList[this.themes];
    } else if (this.valueColor) {
      color = this.valueColor;
    }
    return color;
  }

  checkValue(val: any) {
    return numberTransition(val, "isEmpty");
  }
}
</script>
<style lang="less" scoped>
.ratio-text {
  display: grid;
  grid: auto / 50% 50%;
  font-size: 12px;
  > div {
    &:first-child {
      text-align: left;
    }
    &:last-child {
      text-align: right;
    }
  }
  > div > p {
    height: 18px;
    font-size: 16px;
    font-weight: 400;
    line-height: 18px;
    &:first-child {
      margin-bottom: 8px;
    }
  }
  .numbers {
    width: calc(100% - 12px);
    display: inline-block;
  }
  .arrow-icon {
    float: right;
    transform: translate(-12px, -16px);
  }
}
.between {
  > div {
    > p {
      text-align: left;
    }
    &:last-child > p {
      text-align: right;
    }
  }
}
</style>
