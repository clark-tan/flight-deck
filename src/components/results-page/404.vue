<!--
 * @Autor: clark tan
 * @Date: 2021-08-12 19:43:41
 * @LastEditors: clark tan
 * @LastEditTime: 2021-09-17 13:27:27
 * @Description: 
-->
<template>
  <div class="errorPages">
    <pa-error-page type="404"> </pa-error-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class ErrorPage extends Vue {}
</script>

<style scoped lang="less">
.errorPages {
  height: 100vh;
  padding: 0 16px;
  background: #edf1f7;
}
</style>
