<template>
  <Layout class="main">
    <Sider class="sider" hide-trigger>
      <SiderPreviewCard />
    </Sider>
    <Content class="content">
      <MainPreviewCard />
    </Content>
  </Layout>
</template>

<script>
import SiderPreviewCard from '@/components/main/SiderPreviewCard.vue'
import MainPreviewCard from '@/components/main/MainPreviewCard.vue'
export default {
  components: { SiderPreviewCard, MainPreviewCard },
}
</script>

<style lang="scss" scoped>
.main {
  background-color: #f6f6f6 !important;
}
.sider {
  background-color: #2e3033 !important;
  max-width: 225px !important;
  min-width: 225px !important;
  width: 225px !important;
}
.content {
  display: flex;
  height: 500px;
  background-color: #fff;
  margin: 50px;
  justify-content: center;
  align-items: center;
}
</style>
