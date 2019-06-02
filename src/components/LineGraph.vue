<template>
  <v-app id="line-graph">
    <error-dialog v-if="isShowErrorDialog" :isShow="isShowErrorDialog" @close="closeErrorModal"/>
    <v-toolbar color="indigo" dark fixed app>
      <v-container>
        <v-layout justify-center align-center>
          <v-toolbar-title class="display-1">都道府県別人口グラフ</v-toolbar-title>
        </v-layout>
      </v-container>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md text-md-center>
        <v-layout row wrap>
          <v-frex md3>
            <v-chip class="title" label dark>都道府県</v-chip>
          </v-frex>
        </v-layout>
        <v-layout row wrap>
          <v-flex v-for="pref in prefectures" :key="pref.prefCode" md3>
            <v-checkbox :value="pref" v-model="checkedPrefectures" :label="pref.prefName"></v-checkbox>
          </v-flex>
        </v-layout>
      </v-container>
      <div>
        <highcharts :options="chartOptions"/>
      </div>
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
    chartOptions(): any {
      return {
        chart: {
          type: "line"
        },
        title: null,
        xAxis: {
          title: {
            text: "年度"
          },
          categories: this.categories
        },
        yAxis: {
          title: {
            text: "人口数"
          }
        },
        series: this.populations
      };
    }
  },
  watch: {
    checkedPrefectures() {
      this.updatePopulations();
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
    updatePopulations() {
      this.populations = [];
      this.checkedPrefectures.map(async pref => {
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
      });
    },
    closeErrorModal() {
      this.isShowErrorDialog = false;
    }
  }
});
</script>
