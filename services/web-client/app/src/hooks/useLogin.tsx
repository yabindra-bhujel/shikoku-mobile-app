import { useState } from "react";
import { loginUser, saveRefreshTokenInCookies } from "../services/AuthServices";
export function useLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await loginUser(username, password);
      const refreshToken = data.refresh_token;

      if (refreshToken) {
        saveRefreshTokenInCookies(refreshToken);
        setSuccess(true);

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        throw new Error("No refresh token received");
      }
    } catch (error) {
      setError("ユーザー名またはパスワードが間違っています");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError(null);
        setSuccess(false);
      }, 3000);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    success,
    handleLogin,
  };
}
