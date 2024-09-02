import { useState } from "react";
import { loginUser, removeCookie } from "../services/AuthServices";
import { useRouter } from "next/navigation";

export function useLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await loginUser(username, password);
      setSuccess(true);
      // remove cookie
      removeCookie("refresh_token");
      removeCookie("access_token");

      router.push("/");

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
