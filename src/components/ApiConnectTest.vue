<template>
  <div>{{prefectures}}<button @click="getPrefectures">get prefectures</button></div>
</template>
<script lang="ts">
import Vue from 'vue'
import Axios from 'axios'
export default Vue.extend({
  name:"ApiConnectTest",
  data(){
    return {
      prefectures:{}
    }
  },
  methods:{
    async getPrefectures(){
      this.prefectures = await Axios.get(`https://opendata.resas-portal.go.jp/api/v1/prefectures`,{
        headers:{"X-API-KEY":process.env.VUE_APP_RESAS_KEY}
      })
    }
  }
})
</script>
