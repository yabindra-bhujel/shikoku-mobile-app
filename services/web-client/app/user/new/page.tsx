"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/app/src/route/AdminLayout";
import { IoCloudUploadOutline } from "react-icons/io5";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false)
  const [fileUploadSuccess, setFileUploadSuccess] = useState<boolean>(false)

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
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      internationalStudent: name === "internationalStudent" ? checked : false

    }))

  }


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess(false);

      const response = await fetch('http://127.0.0.1:8000/admin/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          include: 'credentials',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          department: '',
          internationalStudent: false,
        });
      }

      setSuccess(true);
    } catch (e) {
      setError("ユーザ作成に失敗しました. もう一度お試しください");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setError(null);
        setSuccess(false);
      }, 5000);
    }
  }


  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUserFile(file);
    }
  };

  const sendFileToServer = async () => {
    if (!userFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', userFile);

    try {
      setFileUploadLoading(true);
      setFileUploadSuccess(false)
      const response = await fetch('http://127.0.0.1:8000/admin/user/upload_file', {
        method: 'POST',
        headers: {
          include: 'credentials',
        },
        body: formData,
      });

      if (response.ok) {
        setFileUploadSuccess(true);
        setUserFile(null);
      } else {
        setError("ファイルのアップロードに失敗しました. もう一度お試しください");
      }
    } catch (e) {
      setError("ファイルのアップロードに失敗しました. もう一度お試しください");
    } finally {
      setFileUploadLoading(false);
      setTimeout(() => {
        setFileUploadSuccess(false)
        setError(null)

      }, 5000);
    }
  };

  useEffect(() => {
    if (userFile) {
      sendFileToServer();
    }
  }, [userFile]);

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white shadow-md rounded-md">
        <p className="text-sm font-semibold text-red-800 mb-4 md:mb-0">
          ユーザをファイルで作成する場合は、決まったフォーマットでCSVファイルをアップロードしてください。
          サンプルファイルは
          <a href="/user_sample.csv"
          download
           className="text-blue-500 hover:text-blue-700 underline ml-1">
            こちらから
          </a>
          ダウンロードしてください。

          <br />
          <br />

        <p className="text-black-500text-4xl text-gray-900 font-extralight">**ファイルを選択すると自動に送信されるのでファイル選択の間違えないように注意**</p>

        </p>


        <label className="flex items-center bg-blue-500 text-white px-5 py-3 rounded-md cursor-pointer hover:bg-blue-600 transition-all">
          <IoCloudUploadOutline className="mr-2" size={25} />
          {fileUploadLoading ? 'ファイルアップロード処理中...' : 'ファイルアップロード'}
          {userFile && <span className="ml-2 truncate max-w-xs">{userFile.name}</span>}
          <input
            className="hidden"
            type="file"
            accept=".csv"
            onChange={changeFileHandler}
          />
        </label>
      </div>



      {/* errror message and success maessage */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">エラー:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">成功:</strong>
          <span className="block sm:inline">ユーザーが作成されました</span>
        </div>
      )}

      {fileUploadSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">成功:</strong>
          <span className="block sm:inline">ファイルからユーザを作成されました。</span>
        </div>
      )}

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

            <p className="mt-2 text-xs text-red-500">
              * IDは学生の学籍番号、教員の教員番号、スタッフの社員番号、管理者のIDを入力してください。
            </p>
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
            <p className="mt-2 text-xs text-red-500">
              * メールアドレスはユーザーのIDから自動生成されます。
            </p>
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

            <p className="mt-2 text-xs text-red-500">
              * 役割は学生、教員、スタッフ、管理者から選択してください。
            </p>
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

              <p className="mt-2 text-xs text-red-500">
                * ユーザが 学生 または教員である場合。
              </p>
            </div>
          )}

          {/* Internal Student Checkbox */}
          {form.role === 'student' && (
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="internationalStudent"
                name="internationalStudent"
                checked={form.internationalStudent}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="internationalStudent" className="ml-2 block text-sm font-medium text-gray-700">
                留学生
              </label>

              <p className="mt-2 text-xs text-red-500">
                * ユーザが学生である場合。
              </p>
            </div>

          )}


        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? '処理中...' : 'ユーザー作成'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
