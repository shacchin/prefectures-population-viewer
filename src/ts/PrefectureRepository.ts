import Repository from "./Repository";

export default {
  get() {
    return Repository.get("api/v1/prefectures");
  }
};

export interface Prefecture {
  prefCode: number;
  prefName: string;
}
