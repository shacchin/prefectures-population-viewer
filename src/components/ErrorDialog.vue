<template>
  <v-dialog v-model="isShow" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>情報の取得に失敗しました</v-card-title>
      <v-card-text>
        必要な情報の取得に失敗しました。
        間を空けてから再度お試しください。
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat="flat" @click="close">確認</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ErrorDialog",
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
});
</script>

