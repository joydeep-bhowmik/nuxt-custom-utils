import useIsNative from "./useIsNative";
const useCapCookie = async (name, options = {}) => {
  const cookieValue = (await getCookie(name)) ?? null;
  const cookie = ref(cookieValue);
  const { days } = options;

  watch(cookie, async (value) => {
    if (value === null) {
      return await deleteCookie(name);
    }
    await setCookie(name, value, days);
  });

  return cookie;
};

export default useCapCookie;

async function setCookie(name, value, days) {
  const isNative = useIsNative();

  try {
    if (isNative) {
      // Use Capacitor Preferences for native platforms
      if (days) {
        const expirationDate = new Date();
        expirationDate.setTime(
          expirationDate.getTime() + days * 24 * 60 * 60 * 1000
        );
        const item = {
          value,
          expires: expirationDate.toUTCString(),
        };
        await Preferences.set({ key: name, value: JSON.stringify(item) });
      } else {
        await Preferences.set({ key: name, value: JSON.stringify({ value }) });
      }
    } else {
      // Use useCookie for web platforms
      const cookie = useCookie(name, {
        maxAge: days ? days * 24 * 60 * 60 : undefined,
      });
      cookie.value = value;
    }
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
}

// Define a function to handle getting cookies
async function getCookie(name) {
  const isNative = useIsNative();
  try {
    if (isNative) {
      // Use Capacitor Preferences for native platforms
      const { value } = await Preferences.get({ key: name });
      if (value) {
        const item = JSON.parse(value);
        if (item.expires) {
          const expirationDate = new Date(item.expires);
          if (new Date() > expirationDate) {
            await Preferences.remove({ key: name });
            return null;
          }
        }
        return item.value;
      }
      return null;
    } else {
      // Use useCookie for web platforms
      const cookie = useCookie(name);
      return cookie.value || null;
    }
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
}

// Define a function to handle deleting cookies
async function deleteCookie(name) {
  const isNative = useIsNative();
  try {
    if (isNative) {
      // Use Capacitor Preferences for native platforms
      await Preferences.remove({ key: name });
    } else {
      // Use useCookie for web platforms
      const cookie = useCookie(name);
      cookie.value = null; // Setting it to null effectively deletes it
    }
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
}
