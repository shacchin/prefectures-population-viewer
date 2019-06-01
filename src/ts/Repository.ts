import axios from "axios";

const baseURL = "https://opendata.resas-portal.go.jp";

export default axios.create({
  baseURL,
  headers: { "X-API-KEY": process.env.VUE_APP_RESAS_KEY }
});

