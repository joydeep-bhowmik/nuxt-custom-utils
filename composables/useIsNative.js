import { Capacitor } from "@capacitor/core";

const useIsNative = () => {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android";
};

export default useIsNative;
