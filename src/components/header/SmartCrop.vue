<template>
  <Modal
    v-model="showModal"
    draggable
    sticky
    :reset-drag-position="true"
    :mask="false"
    :width="800"
    title="智能裁剪"
    ok-text="保存修改"
    cancel-text="取消修改"
    @on-visible-change="handleVisibleChange"
    @on-ok="saveCropedImg"
    @on-cancel="closeModal"
  >
    <div class="img-cutter">
      <div class="modal-left">
        <ImgCutter
          ref="imgCutterModal"
          :isModal="false"
          :boxWidth="570"
          :boxHeight="400"
          :showChooseBtn="false"
          :previewMode="true"
          :sizeChange="true"
          :cutWidth="200"
          :cutHeight="280"
          rate="10:14"
          :autoRotate="autoRotate"
          @cutDown="cutDown"
          @onPrintImg="printImg"
          @onClearAll="clearImg"
          @error="error"
        >
          <!-- <template #choose> </template> -->
          <template #cancel>
            <Button ref="cancelButton" type="text" disabled>取消</Button>
          </template>
          <template #confirm>
            <Button ref="cropButton" type="primary" disabled>裁剪</Button>
          </template>
        </ImgCutter>
      </div>
      <div class="modal-right">
        <div class="preview-img" ref="previewimg">
          <!-- <img ref="previewimg" src="" alt="" /> -->
        </div>
        <div class="right-button">
          <Button
            ref="autoRotateButton"
            class="right-button"
            type="primary"
            @click="smartRotate"
            disabled
          >
            自动矫正
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import * as faceapi from "face-api.js";
import ImgCutter from "../vue-img-cutter@2.2.5/node_modules/vue-img-cutter/src/";
import { mapState, mapGetters } from "vuex";
export default {
  name: "SmartCrop",
  components: {
    ImgCutter,
  },
  props: ["smartCropModalVal"],
  model: {
    prop: "smartCropModalVal",
    event: "input",
  },
  watch: {
    smartCropModalVal(nv) {
      this.showModal = nv;
    },
    showModal(nv) {
      if (nv && this.$store.state.currentMainPreviewImgName) {
        this.$refs.imgCutterModal.handleOpen({
          name: this.$store.state.currentMainPreviewImgName,
          src: this.getCurrentImgSrc,
        });
        this.$refs.cancelButton.$el.removeAttribute("disabled");
        this.$refs.cropButton.$el.removeAttribute("disabled");
        this.$refs.autoRotateButton.$el.removeAttribute("disabled");
      }
    },
  },
  data() {
    return {
      showModal: false,
      autoRotate: 0,
      cutdownImgPreviewSrc: "",
    };
  },
  computed: {
    ...mapState(["currentMainPreviewImgName"]),
    ...mapGetters(["getCurrentImgSrc"]),
  },
  methods: {
    handleVisibleChange(val) {
      // val || this.$emit("input", val);
      if (val == false) {
        this.$emit("input", val);
        this.autoRotate = 0;
        this.$refs.cancelButton.$el.click();
        this.cutdownImgPreviewSrc = "";
      }
      if (val == true) {
        try {
          this.cutdownImgPreviewSrc = this.getCurrentImgSrc;
        } catch (err) {
          console.log();
        }
      }
      // this.autoRotate = -this.autoRotate;
      // this.$refs.cancelButton.$el.click();
      // this.autoRotate = -this.autoRotate;
    },
    calcAng(leftEye, rightEye) {
      // 右眼在左眼上右上方
      if (rightEye.y <= leftEye.y && rightEye.x >= leftEye.x) {
        const radian = Math.atan(
          (leftEye.y - rightEye.y) / (rightEye.x - leftEye.x),
        );
        const angle = (radian * 180) / Math.PI;
        return angle;
      }
      // 右眼在左眼右下方
      if (rightEye.y >= leftEye.y && leftEye.x < rightEye.x) {
        const radian = Math.atan(
          (rightEye.y - leftEye.y) / (rightEye.x - leftEye.x),
        );
        const angle = (radian * 180) / Math.PI;
        return -angle;
      }
      // 第四象限
    },
    async loadModel() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    },
    async smartRotate() {
      try {
        if (this.cutdownImgPreviewSrc == "") {
          throw "没有选择图片";
        }
        let input = new Image();
        input.src = this.cutdownImgPreviewSrc;
        await this.loadModel();
        const detectionWithLandmarks = await faceapi
          .detectSingleFace(input)
          .withFaceLandmarks();
        const landmarks = detectionWithLandmarks.landmarks;
        const leftEye = landmarks.positions[36];
        const rightEye = landmarks.positions[45];
        this.autoRotate = this.calcAng(leftEye, rightEye);
        this.$Message.success("自动矫正处理成功");
        this.$refs.autoRotateButton.$el.setAttribute("disabled", "false");
      } catch (error) {
        this.$Message.error("处理失败");
      }
    },
    cutDown(file) {
      const img = document.createElement("img");
      img.setAttribute("width", "160px");
      img.setAttribute("height", "225px");
      img.src = file.dataURL;
      this.$refs.previewimg.appendChild(img);
      this.$refs.cancelButton.$el.setAttribute("disabled", "true");
      this.$refs.cropButton.$el.setAttribute("disabled", "true");
      this.$refs.autoRotateButton.$el.setAttribute("disabled", "true");
    },
    printImg(file) {
      let img = this.$refs.previewimg.firstChild;
      if (!img) {
        img = document.createElement("img");
        img.setAttribute("width", "160px");
        img.setAttribute("height", "225px");
        img.src = file.dataURL;
        this.$refs.previewimg.appendChild(img);
      }
      img.src = file.dataURL;
    },
    clearImg() {
      const img = this.$refs.previewimg.firstChild;
      if (img) {
        img.remove();
      }
      this.cutdownImgPreviewSrc = "";
      this.$refs.cancelButton.$el.setAttribute("disabled", "true");
      this.$refs.cropButton.$el.setAttribute("disabled", "true");
      this.$refs.autoRotateButton.$el.setAttribute("disabled", "true");
    },
    error(err) {
      if (err.msg == "No picture selected") {
        this.$Message.error("未选择图片");
      }
    },
    saveCropedImg() {
      const img = this.$refs.previewimg.firstChild;
      if (img) {
        this.$store.dispatch("updateImgData", {
          imgName: this.currentMainPreviewImgName,
          imgSrc: img.src,
        });
        this.$Message.success("保存修改成功");
      } else {
        this.$Message.error("未进行任何修改");
      }
    },
    closeModal() {
      if (this.currentMainPreviewImgName != "") {
        this.$Message.warning("未进行任何修改！");
      }
    },
  },
  mounted() {
    this.showModal = this.smartCropModalVal;
  },
};
</script>

<style lang="scss" scoped>
.img-cutter {
  display: flex;
  .modal-right {
    width: 198px;
    text-align: center;
    .preview-img {
      margin: auto;
      width: 175px;
      height: 245px;
    }
    .right-button {
      margin-top: 10px;
    }
  }
}
</style>
