<template>
  <div>
    <Card
      v-for="img in OriginImgData"
      :key="img.imgName"
      class="card"
      :padding="5"
    >
      <div
        class="preview-img"
        style="text-align: center"
        @click="changeMainPreview(img.imgName)"
      >
        <img :src="img.imgSrc">
      </div>
      <Tooltip
        class="remove-img"
        content="点击删除此照片"
        placement="right"
        theme="light"
      >
        <Button
          type="text"
          size="large"
          icon="ios-trash"
          @click="removeImg(img.imgName)"
        />
      </Tooltip>
      <!-- <div class="remove-img">
        <Button type="dashed" size="small"><Icon type="ios-trash" /></Button>
      </div> -->
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PreviewCard',
  computed: {
    ...mapState(['OriginImgData']),
    OriginImgDataList() {
      if (this.OriginImgData)
        return this.OriginImgData

      return []
    },
  },
  methods: {
    removeImg(imgName) {
      this.$store.dispatch('removeImg', imgName)
    },
    changeMainPreview(imgName) {
      this.$store.dispatch('changeCurrentImg', imgName)
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 190px !important;
  height: 140px !important;
  margin: 10px auto;
  // padding: 10px !important;
  .preview-img {
    width: 170px;
    height: 120px;
    cursor: pointer;
  }
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  .remove-img {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
