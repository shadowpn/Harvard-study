const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function getAuthHeader() {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    console.error("No refresh token found");
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      console.error("Refresh failed");
      return null;
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);
    return data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// 🔄 Обёртка над fetch с автообновлением токена
export const authorizedFetch = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeader(),
    },
  });

  if (res.status === 401) {
    const newAccess = await refreshToken();
    if (!newAccess) throw new Error("Unauthorized");

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccess}`,
      },
    });
  }

  return res;
};

export function logoutUser() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('userData');
}