"use client";

import AdminLayout from "./src/route/AdminLayout";
import React, { useState, useEffect } from "react";

const defaultImageUrl = 'https://via.placeholder.com/32';

export default function Home() {
  const [filters, setFilters] = useState({
    studentOnly: false,
    staffOnly: false,
    internationalStudentOnly: false,
    faculty: false,
    department: "",
  });
  const [user, setUser] = useState<any>([]);


  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // 仮の値。実際にはAPIから取得するか、状態に応じて変更する必要があります。


  const fetchUsers = async () => {

    const response = await fetch("https://freetestapi.com/api/v1/users");
    const data = await response.json();
    setUser(data);

  }

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      department: value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
      {/* Filter UI Section */}
      <section className="bg-white shadow-md rounded-lg p-2 mb-2 border border-gray-200">
  <p className="text-sm text-gray-700 mb-2">フィルター</p>
  <div className="flex justify-between items-center flex-wrap gap-2">
    <label className="flex items-center">
      <input
        type="checkbox"
        name="studentOnly"
        checked={filters.studentOnly}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700 text-sm">学生のみ</span>
    </label>
    <label className="flex items-center">
      <input
        type="checkbox"
        name="staffOnly"
        checked={filters.staffOnly}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700 text-sm">スタッフのみ</span>
    </label>
    <label className="flex items-center">
      <input
        type="checkbox"
        name="internationalStudentOnly"
        checked={filters.internationalStudentOnly}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700 text-sm">留学生のみ</span>
    </label>
    <label className="flex items-center">
      <input
        type="checkbox"
        name="faculty"
        checked={filters.faculty}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700 text-sm">教員・スタッフ</span>
    </label>

    {/* Department Dropdown */}
    <div className="flex items-center">
      <label className="text-gray-700 mr-2 text-sm">学科別:</label>
      <select
        value={filters.department}
        onChange={handleDepartmentChange}
        className="w-full sm:w-48 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">選択してください</option>
        <option value="コンピュータサイエンス">コンピュータサイエンス</option>
        <option value="経営学">経営学</option>
        <option value="国際関係">国際関係</option>
        <option value="言語学">言語学</option>
      </select>
    </div>
  </div>
</section>

      {/* Pagination Section */}
<nav aria-label="Page navigation example" className="flex justify-center py-4">
  <ul className="flex items-center -space-x-px h-10 text-lg">
    <li>
      <a
        href="#"
        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <span className="sr-only">Previous</span>
        <svg
          className="w-4 h-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
      </a>
    </li>
    {[...Array(totalPages)].map((_, index) => (
      <li key={index}>
        <a
          href="#"
          className={`flex items-center justify-center px-4 h-10 leading-tight ${
            currentPage === index + 1
              ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          }`}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </a>
      </li>
    ))}
    <li>
      <a
        href="#"
        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <span className="sr-only">Next</span>
        <svg
          className="w-4 h-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
      </a>
    </li>
  </ul>
</nav>


{/* Table Section */}
<div className="relative overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 pt-6">
  <table className="w-full text-sm text-gray-500 dark:text-gray-400">
    <thead className="bg-gray-100 dark:bg-gray-900">
      <tr>
      <th scope="col" className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-medium"></th>
        <th scope="col" className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-medium">ID</th>
        <th scope="col" className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-medium">ユーザー名</th>
        <th scope="col" className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-medium">メールアドレス</th>
        <th scope="col" className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-medium">学科</th>
        <th scope="col" className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-medium">区別</th>
        <th scope="col" className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-medium text-red-600">Action</th>
      </tr>
    </thead>
    <tbody>
      {user.map((user: any) => (
        <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
          <td className="px-4 py-4 text-gray-900 dark:text-gray-100 font-medium">
            {/* user image */}
            <img
              src={user.image || defaultImageUrl}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
          </td>
          <td className="px-4 py-4 text-gray-900 dark:text-gray-100 font-medium">{user.id}</td>
          <td className="px-4 py-4 text-gray-800 dark:text-gray-300">{user.username}</td>
          <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">経営情報学科</td>
          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">学生</td>
          <td className="px-4 py-4">
            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition duration-200 mr-4">
              Edit
            </button>
            <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition duration-200">
              Delete
            </button>
          </td>
        </tr>
      ))}
      
    </tbody>
  </table>
</div>


    </AdminLayout>
  );
}
