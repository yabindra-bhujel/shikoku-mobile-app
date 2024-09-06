// services/AuthService.tsx
import { API_BASE_URL } from "./config";

export const havaeRefreshTokenInCookies = () => {
  return document.cookie.includes("refresh_token=");
}

export const getRefreshTokenFromCookies = () => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith("refresh_token="));

  if (!cookie) {
    return null;
  }

  return cookie.split("=")[1];
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const loginUser = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_BASE_URL}/admin/login`, {
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
