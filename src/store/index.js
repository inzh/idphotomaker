import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 左侧原始图片数据，原始图片不修改
    OriginImgData: [],
    // 中间显示图片数据，中间图片会进行修改操作
    ModifiedImgData: [],
    // 当前中间显示图片的名字
    currentMainPreviewImgName: "",
  },
  getters: {
    // 获取中间显示图片的图片base64
    getCurrentImgSrc(state) {
      // 中间图片是要显示被修改的图片，而不是原始图片
      if (state.ModifiedImgData.length > 0) {
        return state.ModifiedImgData.find(
          // 根据currentMainPreviewImgName来获取当前应该显示的图片
          (item) => item.imgName === state.currentMainPreviewImgName,
        ).imgSrc;
      }
      return "";
    },
  },
  mutations: {
    // 打开图片，往ModifiedImgData也添加一份
    ADD_IMG_DATA(state, img) {
      state.OriginImgData.push(img);
      state.ModifiedImgData.push(img);
    },
    // 根据图片名字从OriginImgData和ModifiedImgData中删除对应图片
    RM_IMG_DATA(state, imgName) {
      // 加载的图片不止一张
      if (state.OriginImgData.length > 1) {
        // 删除名字为imgName的图片
        state.OriginImgData = state.OriginImgData.filter(
          (item) => item.imgName !== imgName,
        );
        state.ModifiedImgData = state.ModifiedImgData.filter(
          (item) => item.imgName !== imgName,
        );
        // 如果删除的不是当前显示的图片，则让当前图片指向最后一张图片
        if (state.currentMainPreviewImgName == imgName) {
          state.currentMainPreviewImgName =
            state.OriginImgData[state.OriginImgData.length - 1].imgName;
        }
      } else {
        // 只加载了一张图片，则直接全部清空完成删除
        state.OriginImgData = [];
        state.ModifiedImgData = [];
        state.currentMainPreviewImgName = "";
      }
    },
    UPDATE_IMG_DATA(state, img) {
      const index = state.ModifiedImgData.findIndex(
        (item) => item.imgName === img.imgName,
      );
      state.ModifiedImgData.splice(index, 1, img);
    },
    CHANGE_CURRENT_IMG(state, imgName) {
      state.currentMainPreviewImgName = imgName;
    },
  },
  actions: {
    addImgData({ commit }, img) {
      commit("ADD_IMG_DATA", img);
    },
    updateImgData({ commit }, img) {
      commit("UPDATE_IMG_DATA", img);
    },
    changeCurrentImg({ commit }, imgName) {
      commit("CHANGE_CURRENT_IMG", imgName);
    },
    removeImg({ commit }, imgName) {
      commit("RM_IMG_DATA", imgName);
    },
  },
  modules: {},
});
