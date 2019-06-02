import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";

Vue.config.productionTip = false;

Highcharts.setOptions({
  lang: {
    numericSymbols: undefined // 1k表記を1000に修正
  }
});
Vue.use(HighchartsVue, { Highcharts });

new Vue({
  render: h => h(App)
}).$mount("#app");
