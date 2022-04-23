<!--
 * @Autor: clark tan
 * @Date: 2021-08-18 15:56:42
 * @LastEditors: clark tan
 * @LastEditTime: 2021-08-18 15:57:12
 * @Description: 
-->
<template>
  <div class="no-permission">
    <div class="info-container">
      <img src="@/assets/images/noPermission.png" alt="" />
      <span class="text">暂无权限</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccessDenied",
};
</script>

<style lang="less" scoped>
.no-permission {
  background-color: #fff;
  height: 100%;
  margin: 0 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .info-container {
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .text {
      margin-top: 16px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      letter-spacing: 2px;
    }
  }
}
</style>
