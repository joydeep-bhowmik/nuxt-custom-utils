import { $deleteCookie, $setCookie } from "~/magics/$cookies";
import { $api } from "~/magics/$http";

export const useAuth = () => {
  const isLoading = ref(false);
  const errors = ref(null);
  const isError = ref(false);
  const data = ref(null);
  const errorObject = ref(null);
  const errorMessage = ref(null);
  const user = useState("user", () => null);

  watch(data, (value) => {
    errors.value = null;

    errorMessage.value = null;

    errorObject.value = {};
  });

  watch(errorObject, (error) => {
    if (!error) return;

    errors.value = error.response?.data?.errors;

    errorMessage.value = error.response?.data?.message;

    isError.value = true;
  });

  const login = async (formObject) => {
    isLoading.value = true;

    try {
      const response = await $api("/login", {
        method: "POST",
        params: formObject,
      });

      if (response.data.token) {
        $setCookie("token", response.data.token, 30);
      }

      data.value = response.data;

      navigateTo("/dashboard");

      return response.data;
    } catch (error) {
      errorObject.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (formObject) => {
    isLoading.value = true;
    try {
      const response = await $api("/register", {
        method: "POST",
        params: formObject,
      });

      if (response.data.token) {
        $setCookie("token", response.data.token, 30);
      }

      data.value = response.data;

      navigateTo("/dashboard");

      return response.data;
    } catch (error) {
      errorObject.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const getUser = async () => {
    if (user.value?.id) return user.value;

    isLoading.value = true;
    try {
      const response = await $api("/user");

      user.value = response.data;

      data.value = response.data;

      return response.data;
    } catch (error) {
      errorObject.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const forgotPassword = async (formObject) => {
    isLoading.value = true;

    try {
      const response = await $api("/forgot-password", {
        method: "POST",
        params: formObject,
      });

      data.value = response.data;

      return response.data;
    } catch (error) {
      errorObject.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (formObject) => {
    isLoading.value = true;

    try {
      const response = await $api("/reset-password", {
        method: "POST",
        params: formObject,
      });

      data.value = response.data;

      return response.data;
    } catch (error) {
      errorObject.value = error;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;

    try {
      const response = await $api("/logout", {
        method: "POST",
      });

      data.value = response.data;

      return response.data;
    } catch (error) {
      errorObject.value = error;
    } finally {
      isLoading.value = false;

      await $deleteCookie("token");
    }
  };

  return {
    login,
    isLoading,
    isError,
    errors,
    data,
    errorObject,
    register,
    getUser,
    forgotPassword,
    resetPassword,
    logout,
  };
};
