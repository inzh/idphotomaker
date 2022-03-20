import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    OriginImgData: [],
    ModifiedImgData: [],
    currentMainPreviewImgName: "",
  },
  getters: {
    getCurrentImgSrc(state) {
      if (state.OriginImgData) {
        return state.OriginImgData.find(
          (item) => item.imgName === state.currentMainPreviewImgName,
        ).imgSrc;
      }
      return "";
    },
    getCurrentImgName(state) {
      if (state.currentMainPreviewImgName) {
        return state.OriginImgData.find(
          (item) => item.imgSrc === state.currentMainPreviewImgName,
        ).imgName;
      }
      return "";
    },
  },
  mutations: {
    ADD_IMG_DATA(state, img) {
      state.OriginImgData.push(img);
      // state.ModifiedImgData.push(img);
    },
    RM_IMG_DATA(state, imgName) {
      if (state.OriginImgData.length > 1) {
        state.OriginImgData = state.OriginImgData.filter(
          (item) => item.imgName !== imgName,
        );
        if (state.currentMainPreviewImgName === imgName) {
          state.currentMainPreviewImgName =
            state.OriginImgData[state.OriginImgData.length - 1].imgName;
        }
      } else {
        state.OriginImgData = [];
        state.currentMainPreviewImgName = "";
      }
    },
    UPDATE_IMG_DATA(state, img) {
      state.ModifiedImgData.push(img);
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
