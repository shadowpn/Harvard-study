const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/users/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}
export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/users/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  const result = await res.json();
  localStorage.setItem("access", result.access);
  localStorage.setItem("refresh", result.refresh);

  if (result.user) {
    localStorage.setItem("userData", JSON.stringify(result.user));
  }
  return result;
}
export function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}