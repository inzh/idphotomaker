<template>
  <div id="show-img">
    <img :src="currentImgSrc" alt="" v-if="OriginImgData.length != 0" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MainPreviewCard",
  computed: {
    ...mapState([
      "OriginImgData",
      "ModifiedImgData",
      "currentMainPreviewImgName",
    ]),
    currentImgSrc() {
      if (this.OriginImgData) {
        return this.OriginImgData.find(
          (item) => item.imgName === this.currentMainPreviewImgName,
        ).imgSrc;
      }
      return "";
    },
  },
};
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
