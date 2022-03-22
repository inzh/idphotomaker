<template>
  <div id="app">
    <div class="layout">
      <Layout>
        <HeaderView />
        <MainView />
      </Layout>
    </div>
  </div>
</template>

<script>
import HeaderView from '@/views/header/HeaderView.vue'
import MainView from '@/views/main/MainView.vue'
export default {
  components: {
    HeaderView,
    MainView,
  },
}
</script>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.layout {
  width: 1024px;
  // margin: auto auto;
}
</style>
