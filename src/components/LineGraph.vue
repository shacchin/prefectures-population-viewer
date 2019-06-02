<template>
  <v-app id="line-graph">
    <error-dialog v-if="isShowErrorDialog" :isShow="isShowErrorDialog" @close="closeErrorModal"/>
    <v-toolbar color="indigo" dark fixed app>
      <v-container>
        <v-layout justify-center align-center>
          <v-toolbar-title class="display-1">都道府県別 総人口推移グラフ</v-toolbar-title>
        </v-layout>
      </v-container>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md text-md-center>
        <v-layout row wrap>
          <v-chip class="title" label dark>都道府県</v-chip>
        </v-layout>
        <v-layout row wrap>
          <v-flex v-for="pref in prefectures" :key="pref.prefCode" md3>
            <v-checkbox :value="pref" v-model="checkedPrefectures" :label="pref.prefName"></v-checkbox>
          </v-flex>
        </v-layout>
        <highcharts v-if="isShowGraph" :options="chartOptions"/>
      </v-container>
    </v-content>
  </v-app>
</template>
<script lang="ts">
import Vue from "vue";
import ErrorDialog from "./ErrorDialog.vue";
import PrefectureRepository, { Prefecture } from "../ts/PrefectureRepository";
import PopulationRepository, {
  TotalPopulation
} from "../ts/PopulationRepository";

interface Population {
  code: number;
  name: string;
  data: number[];
  years: number[];
}

export default Vue.extend({
  name: "LineGraph",
  components: { ErrorDialog },
  data(): {
    prefectures: Prefecture[];
    checkedPrefectures: Prefecture[];
    populations: Population[];
    isShowErrorDialog: boolean;
  } {
    return {
      prefectures: [],
      checkedPrefectures: [],
      populations: [],
      isShowErrorDialog: false
    };
  },
  created() {
    this.initPrefectures();
  },
  computed: {
    categories(): number[] {
      return this.populations.length > 0 ? this.populations[0].years : [];
    },
    isShowGraph(): boolean {
      return this.checkedPrefectures.length > 0;
    },
    chartOptions(): any {
      return {
        chart: {
          type: "line"
        },
        title: null,
        legend: {
          // 凡例
          layout: "vertical",
          align: "right",
          verticalAlign: "top"
        },
        xAxis: {
          // x軸
          title: {
            text: "年度",
            align: "high"
          },
          categories: this.categories
        },
        yAxis: {
          // y軸
          title: {
            text: "人口数",
            align: "high",
            rotation: "0"
          }
        },
        series: this.populations // グラフに表示するデータ
      };
    }
  },
  watch: {
    checkedPrefectures(
      newPrefectures: Prefecture[],
      oldPrefectures: Prefecture[]
    ) {
      this.updatePopulations(newPrefectures, oldPrefectures);
    }
  },
  methods: {
    async initPrefectures() {
      try {
        const response = await PrefectureRepository.get();
        this.prefectures = response.data.result;
      } catch (error) {
        this.isShowErrorDialog = true;
      }
    },
    async getPopulationCompositions(
      prefCode: number
    ): Promise<TotalPopulation[]> {
      try {
        const response = await PopulationRepository.getComposition(prefCode);
        return response.data.result.data[0].data;
      } catch (error) {
        this.isShowErrorDialog = true;
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    },
    updatePopulations(
      newPrefectures: Prefecture[],
      oldPrefectures: Prefecture[]
    ) {
      if (oldPrefectures < newPrefectures) {
        const addedPrefectures = this.getNotIncludedPrefecture(
          newPrefectures,
          oldPrefectures
        );
        this.addPopulations(addedPrefectures[0]);
      } else if (newPrefectures < oldPrefectures) {
        const deletedPrefectures = this.getNotIncludedPrefecture(
          oldPrefectures,
          newPrefectures
        );
        this.deletePopulations(deletedPrefectures[0]);
      }
    },
    async addPopulations(pref: Prefecture) {
      try {
        const populationCompositions = await this.getPopulationCompositions(
          pref.prefCode
        );
        this.populations.push({
          code: pref.prefCode,
          name: pref.prefName,
          data: populationCompositions.map(
            populationComposition => populationComposition.value
          ),
          years: populationCompositions.map(
            populationCompositions => populationCompositions.year
          )
        });
      } catch (error) {
        this.isShowErrorDialog = true;
      }
    },
    deletePopulations(pref: Prefecture) {
      const deleteIndex = this.populations.findIndex(
        population => pref.prefCode === population.code
      );
      this.populations.splice(deleteIndex, 1);
    },
    getNotIncludedPrefecture(
      largePrefectures: Prefecture[],
      smallPrefectures: Prefecture[]
    ) {
      if (largePrefectures.length < smallPrefectures.length) {
        return [];
      }
      return largePrefectures.filter(largePref => {
        return !smallPrefectures.some(
          smallPref => smallPref.prefCode === largePref.prefCode
        );
      });
    },
    closeErrorModal() {
      this.isShowErrorDialog = false;
    }
  }
});
</script>
