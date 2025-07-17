const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔐 Получить заголовок авторизации
export function getAuthHeader() {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔄 Обновление access токена через refresh
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    console.error("🔒 No refresh token found");
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      console.error("🔁 Refresh token request failed");
      return null;
    }

    const data = await response.json();
    localStorage.setItem("access", data.access);
    return data.access;
  } catch (error) {
    console.error("⚠️ Error refreshing token:", error);
    return null;
  }
};

// 🛡️ Авторизованный fetch с автообновлением access токена
export const authorizedFetch = async (url, options = {}) => {
  // Первый запрос с текущим токеном
  let res = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  });

  // Если access протух — обновляем и повторяем
  if (res.status === 401) {
    const newAccess = await refreshToken();
    if (!newAccess) throw new Error("🚫 Unauthorized: failed to refresh token");

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccess}`,
        "Content-Type": "application/json",
      },
    });
  }

  return res;
};

// 🚪 Выход из аккаунта
export function logoutUser() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("userData");
}
