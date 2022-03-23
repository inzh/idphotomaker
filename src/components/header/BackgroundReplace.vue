<template>
  <Modal
    v-model="showModal"
    draggable
    sticky
    :reset-drag-position="true"
    :mask="false"
    :width="600"
    title="智能替换背景"
    ok-text="保存修改"
    cancel-text="取消修改"
    @on-visible-change="handleVisibleChange"
    @on-ok="saveReplacedImg"
    @on-cancel="closeModal"
  >
    <div v-if="getCurrentImgSrc" class="background-replace">
      <div class="left">
        <img :src="getCurrentImgSrc" alt="" width="200" height="280">
      </div>
      <div class="middle">
        <canvas id="canvas" ref="canvas" width="200" height="280" />
      </div>
      <div v-if="getCurrentImgSrc" class="right">
        <Button type="primary" @click="replaceBgColor('blue')">
          换蓝色背景
        </Button>
        <Button type="error" @click="replaceBgColor('red')">
          换红色背景
        </Button>
        <Button type="text" @click="replaceBgColor('white')">
          换白色背景
        </Button>
      </div>
    </div>
    <h3 v-else>
      请先选择图片
    </h3>
  </Modal>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'
import formData from '@/config/faceppapi'
export default {
  name: 'BackgroundReplace',
  model: {
    prop: 'backgroundReplaceModalVal',
    event: 'input',
  },
  props: ['backgroundReplaceModalVal'],
  data() {
    return {
      showModal: false,
    }
  },
  watch: {
    backgroundReplaceModalVal(nv) {
      this.showModal = nv
    },
    currentMainPreviewImgName() {
      if (this.$refs.canvas)
        this.$refs.canvas.getContext('2d').clearRect(0, 0, 200, 280)
    },
  },
  mounted() {
    this.showModal = this.backgroundReplaceModalVal
  },
  computed: {
    ...mapState(['currentMainPreviewImgName']),
    ...mapGetters(['getCurrentImgSrc']),
  },
  methods: {
    handleVisibleChange(val) {
      val || this.$emit('input', val)
    },
    closeModal() {
      if (this.currentMainPreviewImgName !== '')
        this.$Message.warning('未进行任何修改！')
    },
    saveReplacedImg() {
      if (this.$refs.canvas && !this.isCanvasBlank(this.$refs.canvas)) {
        const canvas = this.$refs.canvas
        const dataUrl = canvas.toDataURL()
        this.$store.dispatch('updateImgData', {
          imgName: this.currentMainPreviewImgName,
          imgSrc: dataUrl,
        })
        this.$Message.success('背景替换成功')
        if (this.$refs.canvas)
          this.$refs.canvas.getContext('2d').clearRect(0, 0, 200, 280)
      }
      else {
        this.$Message.error('未进行任何修改！')
      }
    },
    // 验证canvas画布是否为空
    isCanvasBlank(canvas) {
      const blank = document.createElement('canvas')// 系统获取一个空canvas对象
      blank.width = canvas.width
      blank.height = canvas.height
      return canvas.toDataURL() === blank.toDataURL()// 比较值相等则为空
    },
    async requestFacePP() {
      try {
        formData.image_base64 = this.getCurrentImgSrc
        const res = await axios({
          url: 'https://api-cn.faceplusplus.com/humanbodypp/v2/segment',
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify(formData),
        })
        if (res.status === 200)
          return res.data.body_image
        else
          throw new Error('背景替换失败')
      }
      catch (err) {
        this.$Message.error('背景替换失败')
      }
      finally {
        formData.image_base64 = ''
      }
    },
    async replaceBgColor(color) {
      let bgColor = ''
      switch (color) {
        case 'blue':
          bgColor = '#00BFF3'
          break
        case 'red':
          bgColor = '#FF0000'
          break
        case 'white':
          bgColor = '#FFFFFF'
          break
      }
      const frontImgBase64 = await this.requestFacePP()
      const frontImgSrc = `data:image/png;base64,${frontImgBase64}`
      const frontImg = new Image()
      frontImg.src = frontImgSrc
      frontImg.width = 200
      frontImg.height = 280
      frontImg.onload = () => {
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, 200, 280)
        ctx.drawImage(frontImg, 0, 0, 200, 280)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.background-replace {
  display: flex;
  .left {
    width: 200px;
    height: 280px;
  }
  .middle {
    width: 200px;
    height: 280px;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 280px;
    Button {
      margin: 15px 0;
    }
  }
}

</style>
