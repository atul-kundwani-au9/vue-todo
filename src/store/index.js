import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    SET_LOADING(state, val) {
      state.loading = val;
    },
  },
  actions: {},
  modules: {},
});
