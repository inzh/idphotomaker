<template>
  <div id="show-img">
    <img v-if="ModifiedImgData.length != 0" :src="getCurrentImgSrc" alt="">
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'MainPreviewCard',
  computed: {
    ...mapState(['ModifiedImgData']),
    ...mapGetters(['getCurrentImgSrc']),
  },
}
</script>

<style lang="scss" scoped>
#show-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 650px;
  height: 450px;
  // background-color: aqua;
}
img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>
