"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/app/src/route/AdminLayout";

const userRole = {
  student: '学生',
  teacher: '教員',
  staff: 'スタッフ',
  admin: '管理者',
};

const department = {
  media: 'メディア学科',
  design: 'デザイン学科',
  it: 'IT学科',
};

export default function NewUser() {
  const [form, setForm] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    internationalStudent: false,
  });

  // Automatically generate email when ID changes
  useEffect(() => {
    if (form.id) {
      const email = `s${form.id}@shikoku-u.ac.jp`;
      setForm((prevForm) => ({
        ...prevForm,
        email,
      }));
    }
  }, [form.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ユーザー作成</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">CSVファイルをアップロード</button>
      </div>

      {/* Form Section */}
      <form className="bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID */}
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">ID</label>
            <input
              type="text"
              id="id"
              name="id"
              value={form.id}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">名</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">姓</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              disabled
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">役割</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">選択してください</option>
              {Object.entries(userRole).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Department (Conditional) */}
          {(form.role === 'student' || form.role === 'teacher') && (
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">学科</label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">選択してください</option>
                {Object.entries(department).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Internal Student Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="internalStudent"
              name="internationalStudent"
              checked={form.internationalStudent}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="internalStudent" className="ml-2 block text-sm font-medium text-gray-700">
              留学生
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            作成
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
