<template>
  <Modal
    v-model="showModal"
    draggable
    sticky
    :reset-drag-position="true"
    :mask="false"
    :width="400"
    title="智能替换背景"
    ok-text="保存修改"
    cancel-text="取消修改"
    @on-visible-change="handleVisibleChange"
    @on-ok="saveReplacedImg"
    @on-cancel="closeModal"
  >
    <div v-if="getCurrentImgSrc" class="background-replace">
      <div class="left">
        <img :src="getCurrentImgSrc" alt="阿斯顿" width="200" height="280">
      </div>
      <div v-if="getCurrentImgSrc" class="right">
        <Button type="primary">
          换蓝色背景
        </Button>
        <Button type="error">
          换红色背景
        </Button>
        <Button type="text">
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
import { mapGetters } from 'vuex'
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
  },
  mounted() {
    this.showModal = this.backgroundReplaceModalVal
  },
  computed: {
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
      this.$Message.success('背景替换成功')
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
