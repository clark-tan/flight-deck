<!--
 * @Autor: clark tan
 * @Date: 2021-08-12 19:43:41
 * @LastEditors: clark tan
 * @LastEditTime: 2021-09-06 09:41:26
 * @Description: 
-->
<template>
  <div class="errorPages">
    <pa-error-page type="other" :message="desc">
      <template slot="foot">
        <pa-button type="primary" ghost @click="goBack"> 返回上一页 </pa-button>
      </template>
    </pa-error-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class ErrorPage extends Vue {
  title = "对不起，访问失败！";
  desc: any = null;
  mounted() {
    console.log(this.$route.params);
    if (this.$route.params) {
      this.desc = this.$route.params.msg
        ? `${this.$route.params.msg}！（code:${this.$route.params.code}）`
        : "";
    }
  }

  goBack() {
    const replaceUrl = window.location.href.replace(/[/]error*/, "");
    console.log(replaceUrl);
    window.location.href = replaceUrl;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.errorPages {
  height: 100vh;
  padding: 0 16px;
  background: #edf1f7;
}
</style>
