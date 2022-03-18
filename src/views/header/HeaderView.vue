<template>
  <Header class="header">
    <Menu class="menu" mode="horizontal" theme="light" active-name="1">
      <div class="layout-nav">
        <MenuItem name="0" class="first">
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
            <Icon type="ios-add-circle-outline" />
            打开文件
          </Upload>
        </MenuItem>
        <MenuItem name="1">
          <Icon type="ios-navigate"></Icon>
          Item 1
        </MenuItem>
        <MenuItem name="2">
          <Icon type="ios-keypad"></Icon>
          Item 2
        </MenuItem>
        <MenuItem name="3">
          <Icon type="ios-analytics"></Icon>
          Item 3
        </MenuItem>
        <MenuItem name="4">
          <Icon type="ios-paper"></Icon>
          Item 4
        </MenuItem>
      </div>
    </Menu>
  </Header>
</template>

<script>
export default {
  data() {
    return {
      accept: "image/jpeg,image/jpg,image/png",
    };
  },
  methods: {
    loadImg(file) {
      console.log(file);
      this.$refs.upload.clearFiles();

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
    .first {
      padding: 0 76px !important;
      background-color: #2e3033;
      color: #fff;
    }
  }
}
</style>
