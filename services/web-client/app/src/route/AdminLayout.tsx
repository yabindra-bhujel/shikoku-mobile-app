"use client";

import React from "react";
import PrivateRoute from "./PrivateRoute";
import { IoNotificationsCircleSharp, IoSettings } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
            <a
              className="text-blue-500 hover:text-blue-400 focus:outline-none"
              href="#"
              aria-label="Notifications"
            >
              <IoNotificationsCircleSharp className="text-3xl" />
            </a>
            <a
              className="text-gray-600 hover:text-gray-500 focus:outline-none"
              href="#"
              aria-label="Account"
            >
              <MdOutlineAccountCircle className="text-3xl" />
            </a>
            <a
              className="text-gray-600 hover:text-gray-500 focus:outline-none"
              href="#"
              aria-label="Settings"
            >
              <IoSettings className="text-3xl" />
            </a>
          </div>
        </header>

        {/* Sub-navigation */}
        <nav className="bg-white shadow-md border-b-2 border-indigo-300 flex-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex space-x-8">
                <a
                  href="/"
                  className="text-gray-700 hover:text-indigo-700 font-medium focus:outline-none focus:text-indigo-700"
                >
                  ユーザ一覧
                </a>
              </div>
              <div className="flex space-x-8">
                <a
                  href="/user/new"
                  className="text-gray-700 hover:text-indigo-700 font-medium focus:outline-none focus:text-indigo-700"
                >
                  ユーザ作成
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-indigo-700 font-medium focus:outline-none focus:text-indigo-700"
                >
                  マニュアル
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
