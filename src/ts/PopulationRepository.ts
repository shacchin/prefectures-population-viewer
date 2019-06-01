import Repository from "./Repository";

export default {
  getComposition(prefCode: number) {
    return Repository.get("api/v1/population/composition/perYear", {
      params: {
        prefCode
      }
    });
  }
};

export interface TotalPopulation {
  year: number;
  value: number;
}
