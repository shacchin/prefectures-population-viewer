<template>
  <div>
    <h1>都道府県別人口グラフ</h1>
    <div v-for="pref in prefectures" :key="pref.prefCode">
      <input type="checkbox" :id="pref.prefCode" :value="pref" v-model="checkedPrefectures">
      <label for="pref.prefCode">{{pref.prefName}}</label>
    </div>
    <div>
      <highcharts :options="chartOptions"/>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
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
  data(): {
    prefectures: Prefecture[];
    checkedPrefectures: Prefecture[];
    populations: Population[];
  } {
    return {
      prefectures: [],
      checkedPrefectures: [],
      populations: []
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
      const response = await PrefectureRepository.get();
      this.prefectures = response.data.result;
    },
    async getPopulationCompositions(
      prefCode: number
    ): Promise<TotalPopulation[]> {
      const response = await PopulationRepository.getComposition(prefCode);
      return response.data.result.data[0].data;
    },
    updatePopulations() {
      this.populations = [];
      this.checkedPrefectures.map(async pref => {
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
      });
    }
  }
});
</script>


