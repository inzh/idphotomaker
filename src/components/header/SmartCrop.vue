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
        >
          <!-- <template #choose> </template> -->
          <template #cancel>
            <Button ref="cancelButton" type="text">取消</Button>
          </template>
          <template #confirm>
            <Button type="primary">裁剪</Button>
          </template>
        </ImgCutter>
      </div>
      <div class="modal-right">
        <div class="preview-img" ref="previewimg">
          <!-- <img ref="previewimg" src="" alt="" /> -->
        </div>
        <div class="right-button">
          <Button class="right-button" type="primary" @click="smartRotate">
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
import { mapGetters } from "vuex";
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
      }
    },
  },
  data() {
    return {
      showModal: false,
      autoRotate: 0,
      cutdownImgPreview: "",
    };
  },
  computed: {
    ...mapGetters(["getCurrentImgSrc"]),
  },
  methods: {
    handleVisibleChange(val) {
      val || this.$emit("input", val);
      this.$refs.cancelButton.$el.click();
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
        return angle - 90;
      }
      // 第四象限
    },
    async loadModel() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    },
    async smartRotate() {
      try {
        await this.loadModel();
        let input = new Image();
        input.src = this.getCurrentImgSrc;
        const detectionWithLandmarks = await faceapi
          .detectSingleFace(input)
          .withFaceLandmarks();
        const landmarks = detectionWithLandmarks.landmarks;

        const leftEye = landmarks.positions[36];
        const rightEye = landmarks.positions[45];
        console.log(leftEye);
        console.log(rightEye);
        const angle = this.calcAng(leftEye, rightEye);
        console.log(angle);
        this.autoRotate = angle;
      } catch (error) {
        console.log("模型加载失败");
      }
    },
    cutDown(file) {
      console.log(file.fileName);
    },
    printImg(file) {
      let img = this.$refs.previewimg.firstChild;
      if (!img) {
        img = document.createElement("img");
        img.src = file.dataURL;
        this.$refs.previewimg.appendChild(img);
      }
      img.src = file.dataURL;
      // this.$refs.previewimg.appendChild(img);
    },
    clearImg() {
      const img = this.$refs.previewimg.firstChild;
      if (img) {
        img.remove();
      }
    },
    // async smartCrop() {
    //   await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    //   await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    //   // const input = this.$refs.input;
    //   let image = new Image()
    //   image.src =
    //   const canvas = this.$refs.canvas;
    //   const detectionWithLandmarks = await faceapi
    //     .detectSingleFace(input)
    //     .withFaceLandmarks();
    //   console.log(detectionWithLandmarks);
    //   const landmarks = detectionWithLandmarks.landmarks;
    //   // const landmarkPositions = landmarks.positions;

    //   console.log(landmarks.getLeftEye());
    //   const displaySize = { width: input.width, height: input.height };
    //   faceapi.matchDimensions(canvas, displaySize);
    //   const resizedResults = faceapi.resizeResults(
    //     detectionWithLandmarks,
    //     displaySize,
    //   );
    //   faceapi.draw.drawDetections(canvas, resizedResults);
    //   // draw the landmarks into the canvas
    //   faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
    // },
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
      img {
        width: 160px;
        height: 225px;
      }
    }
    .right-button {
      margin-top: 10px;
    }
  }
}
</style>
