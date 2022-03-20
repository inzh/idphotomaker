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
          :sizeChange="false"
          :cutWidth="200"
          :cutHeight="280"
          rate="10:14"
          :autoRotate="autoRotate"
          @cutDown="cutDown"
        >
          <!-- <template #choose> </template> -->
          <template #cancel>
            <Button type="text">取消</Button>
          </template>
          <template #confirm>
            <Button type="primary">取消</Button>
          </template>
        </ImgCutter>
      </div>
      <div class="modal-right">
        <div class="preview-img">
          <img src="" alt="" />
        </div>
        <div class="right-button">
          <Button class="right-button" type="primary" @click="rotate">
            旋转
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
    getCurrentImgSrc() {},
  },
  data() {
    return {
      showModal: false,
      autoRotate: 0,
    };
  },
  computed: {
    ...mapGetters(["getCurrentImgSrc", "getCurrentImgName"]),
  },
  methods: {
    handleVisibleChange(val) {
      val || this.$emit("input", val);
    },
    async loadModel() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    },
    async smartCrop() {
      try {
        await this.loadModel();
        let input = new Image();
        input.src = this.getCurrentImgSrc;
        const canvas = this.$refs.canvas;
        const detectionWithLandmarks = await faceapi
          .detectSingleFace(input)
          .withFaceLandmarks();
        const landmarks = detectionWithLandmarks.landmarks;
        const leftEye = landmarks.positions[36];
        const rightEye = landmarks.positions[45];
        const radian = Math.atan2(
          leftEye.y - rightEye.y,
          leftEye.x - rightEye.x,
        );
        const angle = 180 / (Math.PI * radian);
        console.log(angle);
        const displaySize = { width: input.width, height: input.height };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedResults = faceapi.resizeResults(
          detectionWithLandmarks,
          displaySize,
        );
        faceapi.draw.drawDetections(canvas, resizedResults);
        // draw the landmarks into the canvas
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
      } catch (error) {
        console.log("模型加载失败");
      }
    },
    cutDown() {},
    rotate() {
      this.autoRotate = 20;
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
    background-color: aquamarine;
    text-align: center;
    .preview-img {
      margin: auto;
      width: 175px;
      height: 245px;
      border: 1px solid #eee;
    }
    .right-button {
      margin-top: 10px;
    }
  }
}
</style>
