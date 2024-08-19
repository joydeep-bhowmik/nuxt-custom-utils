export const formatlink = (str) => (str.startsWith("/") ? str : "/" + str);

export const ApiHasData = (data) => {
  if (!Object.keys(data).length) return;

  if (!data.pages) return true;

  return data?.pages[0]?.data?.length;
};

export const asset = (str) =>
  new URL("@/assets" + formatlink(str), import.meta.url).href;
