<template>
  <div id="app">
    <line-graph />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LineGraph from "./components/LineGraph.vue";

export default Vue.extend({
  name: "app",
  components: {
    LineGraph
  }
});
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
