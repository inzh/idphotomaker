<template>
  <Card class="card" :padding="5">
    <div style="text-align: center">
      <img src="../../assets/images/1.jpeg" />
    </div>
  </Card>
</template>

<script>
export default {
  name: "PreviewCard",
};
</script>

<style lang="scss" scoped>
.card {
  width: 190px !important;
  margin: 10px auto;
  // padding: 10px !important;
  img {
    height: 105px !important;
  }
}
</style>
