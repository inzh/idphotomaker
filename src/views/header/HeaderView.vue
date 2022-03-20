<template>
  <div class="header-view">
    <Header class="header">
      <Menu class="menu" mode="horizontal" theme="light">
        <div class="layout-nav">
          <Dropdown class="upload-img">
            <Upload
              action="#"
              ref="upload"
              :multiple="false"
              :show-upload-list="false"
              :before-upload="loadImg"
              :format="['jpg', 'jpeg', 'png']"
              :accept="accept"
              :on-format-error="handleFormatError"
            >
              <div class="upload">
                <Icon type="ios-add-circle-outline" />
                打开文件
              </div>
            </Upload>
          </Dropdown>
          <Dropdown class="crop-img">
            <Button type="text">
              <Icon type="ios-crop" />
              裁剪图片
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem
                ><div @click="smartCropModalVal = true">
                  <Icon type="ios-ionitron-outline" /> 智能裁剪
                </div></DropdownItem
              >
            </DropdownMenu>
          </Dropdown>
        </div>
      </Menu>
    </Header>
    <SmartCrop v-model="smartCropModalVal"></SmartCrop>
  </div>
</template>

<script>
import SmartCrop from "@/components/header/SmartCrop.vue";
export default {
  data() {
    return {
      accept: "image/jpeg,image/jpg,image/png",
      smartCropModalVal: false,
    };
  },
  components: { SmartCrop },
  methods: {
    loadImg(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (img) => {
        // 将上传的图片名字和base64Url分发
        this.$store.dispatch("addImgData", {
          imgName: file.name,
          imgSrc: img.target.result,
        });
        this.$store.dispatch("changeCurrentImg", file.name);
        // 清空上传列表
        this.$refs.upload.clearFiles();
      };
      // 禁止默认自动上传
      return false;
    },
    handleFormatError() {
      console.log("文件不是图片");
    },
  },
};
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
