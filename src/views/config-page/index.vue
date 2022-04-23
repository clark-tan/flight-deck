<!--
 * @Author: clark tan
 * @Date: 2021-11-16 16:13:40
 * @LastEditors: clark tan
 * @LastEditTime: 2021-11-16 16:21:50
 * @Description: 
-->
<!--
 * @Autor: clark tan
 * @Date: 2021-10-08 10:06:34
 * @LastEditors: clark tan
 * @LastEditTime: 2021-10-08 11:18:48
 * @Description: 
-->
<template>
  <div class="overview">
    <a-card>
      <div class="pa-table-top">
        <a-button type="primary" @click="keepSetting"> 保存设置 </a-button>
      </div>
      <a-descriptions class="descriptions-container" bordered :column="2">
        <a-descriptions-item label="密码长度" span="2">
          <a-input-number
            :value.sync="securityData.pwdMinLength"
            controls-position="right"
            :min="1"
            :max="Number(securityData.pwdMaxLength)"
          />
          <span class="divider-line">-</span>
          <a-input-number
            :value.sync="securityData.pwdMaxLength"
            controls-position="right"
            :min="Number(securityData.pwdMinLength)"
            :max="20"
          />
        </a-descriptions-item>
        <a-descriptions-item label="必须包含大写字母">
          <a-switch
            checked-children="开"
            un-checked-children="关"
            :checked="securityData.includeUpper"
            @click="() => choice('includeUpper')"
            :loading="isLoad"
          />
        </a-descriptions-item>
        <a-descriptions-item label="必须包含小写字母">
          <a-switch
            checked-children="开"
            un-checked-children="关"
            :checked="securityData.includeLower"
            @click="() => choice('includeLower')"
            :loading="isLoad"
          />
        </a-descriptions-item>
        <a-descriptions-item label="必须包含数字">
          <a-switch
            checked-children="开"
            un-checked-children="关"
            :checked="securityData.includeNumber"
            @click="() => choice('includeNumber')"
            :loading="isLoad"
          />
        </a-descriptions-item>
        <a-descriptions-item label="必须包含特殊符号">
          <a-switch
            checked-children="开"
            un-checked-children="关"
            :checked="securityData.includeSpecial"
            @click="() => choice('includeSpecial')"
            :loading="isLoad"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class OutpatientOverview extends Vue {}
</script>

<style lang="less" scoped>
.pa-table-top {
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.divider-line {
  padding: 0 10px;
}
.descriptions-container {
  padding: 0 !important;
}
</style>
