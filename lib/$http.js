import { CapacitorHttp } from "@capacitor/core";

export const $http = async (
  url,
  options = {
    method: "GET",
    headers: {},
    params: {},
  }
) => {
  return await CapacitorHttp.request({ url, ...options });
};

export const $api = async (
  url,
  options = {
    method: "GET",
    headers: {},
    params: {},
  }
) => {
  return await CapacitorHttp.request({
    url: "http://127.0.0.1:8000/api" + url,
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
};
