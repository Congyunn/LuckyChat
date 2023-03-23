import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});

export const makeImgRequest = axios.create({
  headers: { 'Authorization': "cibSEtADcXBgjH2QYjcykyNkoYBG7uv3" }
})
