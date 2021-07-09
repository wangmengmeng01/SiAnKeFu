<template>
  <div class="dashboard-container">
    <img src="@/assets/Home/dashboard_bg.png">
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding-top: 100px;
  padding-bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    max-width: 35%;
  }
}
</style>
