import useCapCookie from "./useCapCookie";
import { $api } from "~/lib/$http";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
export const useAuth = async ({
  googleAuth = null,
  redirectToOnSuccess = false,
} = {}) => {
  const isLoading = ref(false);
  const errors = ref(null);
  const isError = ref(false);
  const isSuccess = ref(false);
  const data = ref(null);
  const errorResponse = ref(null);
  const user = useState("user", () => null);
  const router = useRouter();

  const initializeGoogleAuth = () => {
    if (googleAuth?.clientId) {
      GoogleAuth.initialize({
        clientId: googleAuth.clientId,
        scopes: ["profile", "email"],
      });
    } else {
      throw new Error("Google authentication is not configured.");
    }
  };

  async function GoogleLogin() {
    if (!googleAuth?.clientId) {
      throw new Error("Google authentication is not configured.");
    }

    isLoading.value = true;

    try {
      const google_response = await GoogleAuth.signIn();

      console.log(google_response);

      const response = await $api("/auth/google", {
        method: "POST",
        params: {
          ...google_response,
          id_token: google_response.authentication.idToken,
        },
      });

      if (response.data.token) {
        (await token).value = response.data.token;
      }

      data.value = response.data;
    } catch (error) {
      errorResponse.value = error;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  const token = await useCapCookie("token", {
    days: 30,
  });

  const login = async (formObject) => {
    isLoading.value = true;

    try {
      const response = await $api("/login", {
        method: "POST",
        params: formObject,
      });

      data.value = response.data;

      if (response.data.token) {
        (await token).value = response.data.token;
      }

      return response.data;
    } catch (error) {
      errorResponse.value = error;
      throw error;
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
        (await token).value = response.data.token;
      }

      data.value = response.data;

      return response.data;
    } catch (error) {
      errorResponse.value = error;
      throw error;
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
      errorResponse.value = error;
      user.value = null;

      throw error;
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
      errorResponse.value = error;
      throw error;
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
      errorResponse.value = error;
      throw error;
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
      errorResponse.value = error;
      throw error;
    } finally {
      isLoading.value = false;

      (await token).value = null;
    }
  };

  watch(data, (value) => {
    errors.value = null;
    errorResponse.value = {};
    isSuccess.value = true;

    isError.value = false;

    if (redirectToOnSuccess && redirectToOnSuccess === "auto") {
      return window.history.length > 1 ? router.back() : navigateTo("/");
    }

    if (redirectToOnSuccess) {
      return redirectToOnSuccess && navigateTo(redirectToOnSuccess);
    }
  });

  watch(errorResponse, (error) => {
    if (!Object.keys(error).length) return;

    errors.value = error.response?.data?.errors;

    errorResponse.value = error.response;

    isError.value = true;

    isSuccess.value = false;
  });

  return {
    initializeGoogleAuth,
    login,
    isLoading,
    isError,
    isSuccess,
    errors,
    data,
    errorResponse,
    register,
    getUser,
    forgotPassword,
    resetPassword,
    logout,
    GoogleLogin,
    user,
  };
};
