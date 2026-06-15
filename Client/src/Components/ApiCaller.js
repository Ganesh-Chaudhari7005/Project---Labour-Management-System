import { Navigate, useNavigate } from "react-router-dom";
export function useApi() {
  const navigate = useNavigate();

  async function callApi(url, options = {}) {
    const isformData = options.body instanceof FormData;
    const token = sessionStorage.getItem("token");
    let res = await fetch(url, {
      ...options,
      headers: {
        ...(isformData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
        Authorization: token ? "Bearer " + token : "",
      },
    });

    if (res.status === 401) {
      sessionStorage.removeItem("token");
      navigate("/system-login");
      return {
        success: false,
        message: "Session Expired",
      };
    }
    return res.json();
  }
  return callApi;
}
