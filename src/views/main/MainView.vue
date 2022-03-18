<template>
  <Layout class="main">
    <Sider class="sider" hide-trigger>
      <PreviewCard></PreviewCard>
    </Sider>
    <Content class="content"> Content </Content>
  </Layout>
</template>

<script>
import PreviewCard from "@/components/main/PreviewCard.vue";
export default {
  components: { PreviewCard },
};
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
.card {
  width: 190px !important;
  margin: 10px auto;
  // padding: 10px !important;
  img {
    height: 105px !important;
  }
}
.content {
  height: 500px;
  background-color: #fff;
  margin: 50px;
}
</style>
