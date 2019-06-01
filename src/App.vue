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
