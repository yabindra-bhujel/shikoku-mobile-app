"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import PrivateRoute from "./PrivateRoute";
import { MdOutlineAccountCircle } from "react-icons/md";
import { API_BASE_URL } from "../services/config";
import { removeRefreshTokenFromCookies } from "../services/AuthServices";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  image?: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user_profile`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        router.push("/login"); 
      }
    } catch (error) {
      router.push("/login"); 
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.status === 204) {
        // remove cookie
        removeRefreshTokenFromCookies();
        

        router.push("/login");
      } else {
        setLogoutError("ログアウトに失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      setLogoutError("ログアウトに失敗しました。もう一度お試しください。");
    }
  }

  return (
    <PrivateRoute>
      {/* Main layout */}
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Main header */}
        <header className="flex justify-between items-center w-full bg-white shadow-md py-4 px-6 sm:px-10 border-b-2 border-indigo-300">
          <a
            className="font-bold text-2xl text-indigo-700 focus:outline-none focus:opacity-80"
            href="#"
            aria-label="Shikoku University Mobile App User Management System"
          >
            四国大学モバイルアプリユーザー管理システム
          </a>
          <div className="flex items-center gap-8 sm:gap-10">
            {/* 現在ログインしているユーザの情報 */}
            <div className="flex items-center gap-2">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <MdOutlineAccountCircle className="text-2xl text-gray-700" />
              )}
              <p className="text-gray-700">
                {user?.first_name} {user?.last_name} <br />
                <small>email@gmail.com</small>
              </p>
              <br />
            </div>

            {/* logout */}
            <button 
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              aria-label="Logout"
              onClick={logout}
            >
              ログアウト
            </button>
          </div>
        </header>

        {/* Sub-navigation */}
        <nav className="bg-white shadow-md border-b-2 border-indigo-300 flex-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-[30px] items-center h-16">
              <div className="flex space-x-8">
                <a
                  href="/"
                  className={`${pathname === "/"
                    ? "text-indigo-700 bg-indigo-100 px-4 py-2 rounded-lg font-bold"
                    : "text-gray-700"
                    } hover:text-indigo-700 font-medium focus:outline-none focus:text-indigo-700`}
                >
                  ユーザ一覧
                </a>
              </div>
              <div className="flex space-x-8">
                <a
                  href="/user/new"
                  className={`${pathname === "/user/new"
                    ? "text-indigo-700 bg-indigo-100 px-4 py-2 rounded-lg font-bold"
                    : "text-gray-700"
                    } hover:text-indigo-700 font-medium focus:outline-none focus:text-indigo-700`}
                >
                  ユーザ作成
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content area */}
        <main className="flex-1 p-6 sm:p-10 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </PrivateRoute>
  );
}
