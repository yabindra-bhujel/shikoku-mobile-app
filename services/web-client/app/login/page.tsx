"use client";

import React from "react";
import { useLogin } from "../src/hooks/useLogin";

export default function Login() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    success,
    handleLogin,
  } = useLogin();

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
        // TODO: chnage logo
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="四国大学"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          管理者ログイン
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          あなたのアカウントにアクセス
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                ユーザー名
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="ユーザー名を入力"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="パスワードを入力"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Login successful!</p>}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  // TODO: change href
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  パスワードを忘れた場合
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
