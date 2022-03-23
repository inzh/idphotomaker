<template>
  <div class="header-view">
    <Header class="header">
      <Menu class="menu" mode="horizontal" theme="light">
        <div class="layout-nav">
          <Dropdown class="upload-img">
            <Upload
              ref="upload"
              action="#"
              :multiple="false"
              :show-upload-list="false"
              :before-upload="loadImg"
              :format="['jpg', 'jpeg', 'png']"
              :accept="accept"
              :on-format-error="handleFormatError"
            >
              <div class="upload">
                <Icon type="ios-add-circle-outline" />
                打开图片
              </div>
            </Upload>
          </Dropdown>
          <Dropdown class="reset-img">
            <Button type="text" @click="resetCurrentImg">
              <Icon type="ios-crop" />
              重置修改
            </Button>
          </Dropdown>
          <Dropdown class="crop-img">
            <Button type="text" @click="smartCropModalVal = true">
              <Icon type="ios-crop" />
              裁剪图片
            </Button>
          </Dropdown>
          <Dropdown class="replace-bg">
            <Button type="text" @click="backgroundReplaceModalVal = true">
              <Icon type="ios-aperture-outline" />
              背景替换
            </Button>
          </Dropdown>
          <Dropdown class="replace-bg">
            <Button type="text" @click="exportImg">
              <Icon type="ios-cloud-download-outline" />
              导出下载
            </Button>
          </Dropdown>
        </div>
      </Menu>
    </Header>
    <SmartCrop v-model="smartCropModalVal" />
    <BackgroundReplace v-model="backgroundReplaceModalVal" />
  </div>
</template>

<script>
import SmartCrop from '@/components/header/SmartCrop'
import BackgroundReplace from '@/components/header/BackgroundReplace'
export default {
  components: { SmartCrop, BackgroundReplace },
  data() {
    return {
      accept: 'image/jpeg,image/jpg,image/png',
      smartCropModalVal: false,
      backgroundReplaceModalVal: false,
    }
  },
  methods: {
    loadImg(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (img) => {
        // 将上传的图片名字和base64Url分发
        this.$store.dispatch('addImgData', {
          imgName: file.name,
          imgSrc: img.target.result,
        })
        this.$store.dispatch('changeCurrentImg', file.name)
        // 清空上传列表
        this.$refs.upload.clearFiles()
      }
      // 禁止默认自动上传
      return false
    },
    handleFormatError() {
      console.log('文件不是图片')
    },
    resetCurrentImg() {
      if (this.$store.state.currentMainPreviewImgName === '') {
        this.$Message.error('没有要重置的图片')
      }
      else {
        this.$store.dispatch('resetCurrentImg')
        this.$Message.success('重置成功！')
      }
    },
    exportImg() {
      const currentImgSrc = this.$store.getters.getCurrentImgSrc
      if (currentImgSrc) {
        const a = document.createElement('a')
        const event = new MouseEvent('click')
        a.download = '导出.png'
        a.href = currentImgSrc
        a.dispatchEvent(event)
      }
      else {
        this.$Message.error('未选择图片')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #f6f6f6 !important;
  padding: 0 !important;
  .menu {
    width: 1024px;
    .upload {
      width: 225px;
      text-align: center !important;
      background-color: #2e3033;
      color: #fff !important;
    }
    .upload:hover {
      cursor: pointer;
      color: #42b683 !important;
    }
  }
}
</style>
