// services/AuthService.tsx
import { API_BASE_URL } from "./config";

export const saveRefreshTokenInCookies = (refreshToken: string) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  document.cookie = `refreshToken=${refreshToken}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Lax`;
};

export const getRefreshTokenFromCookies = () => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith("refreshToken="));

  if (!cookie) {
    return null;
  }

  return cookie.split("=")[1];
};

export const loginUser = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_BASE_URL}/auth/access_token`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    body: formData.toString(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
};
