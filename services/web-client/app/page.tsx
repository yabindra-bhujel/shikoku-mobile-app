"use client";

import AdminLayout from "./src/route/AdminLayout";
import React, { useState, useEffect } from "react";

const defaultImageUrl = 'https://via.placeholder.com/32';

export default function Home() {
  const [filters, setFilters] = useState<{
    is_student: boolean;
    is_staff: boolean;
    is_international_student: boolean;
    is_teacher: boolean;
    department: string;
    [key: string]: boolean | string;
  }>({
    is_student: false,
    is_staff: false,
    is_international_student: false,
    is_teacher: false,
    department: "",
  });
  const [user, setUser] = useState<any>([]);


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(30);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== "" && filters[key] !== false) {
        params.append(key, filters[key].toString());
      }
    });

    params.append("page", currentPage.toString());
    params.append("size", perPage.toString());

    return params.toString();
  }

  const fetchUsers = async (page: number = 1) => {
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`http://127.0.0.1:8000/admin/users?${queryParams}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTotalPages(data.pages);
      setCurrentPage(data.page);
      const user = data.items;
      setUser(user);
    } catch (error) {
    }
  }

  const deleteUser = async (id: number) => {
    // confirm delete
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/users/${id}`,{
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.status === 204) {
        setMessage("User deleted successfully.");
        fetchUsers(currentPage);
      }else{
        setError("There was a problem with the delete user.Please try again. Or contact the administrator.");
      }
  }
  catch (error) {
    setError("There was a problem with the delete user.Please try again. Or contact the administrator.");
  }

  finally{
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 5000);
  }
  }
  
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, filters, perPage]);
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // 他のフィルターを解除し、選択されたフィルターのみをチェック
    setFilters({
      is_student: name === "is_student" ? checked : false,
      is_staff: name === "is_staff" ? checked : false,
      is_international_student: name === "is_international_student" ? checked : false,
      is_teacher: name === "is_teacher" ? checked : false,
      department: filters.department, // departmentはそのまま維持
    });
  };


  const handlePerPageItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPerPage(Number(value));
}
  

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

      {/* message */}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline">{message}</span>
      </div>}

      {/* error */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>}
      {/* Filter UI Section */}

      <section className="bg-white shadow-md rounded-lg p-2 mb-2 border border-gray-200">
  <p className="text-sm text-gray-700 mb-2">フィルター</p>
  <div className="flex justify-between items-center flex-wrap gap-2">
    <label className="flex items-center">
      <input
        type="checkbox"
        name="is_student"
        checked={filters.is_student}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700 text-sm">学生のみ</span>
    </label>
    <label className="flex items-center">
      <input
        type="checkbox"
        name="is_staff"
        checked={filters.is_staff}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700 text-sm">スタッフのみ</span>
    </label>
    <label className="flex items-center">
      <input
        type="checkbox"
        name="is_international_student"
        checked={filters.is_international_student}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700 text-sm">留学生のみ</span>
    </label>
    <label className="flex items-center">
      <input
        type="checkbox"
        name="is_teacher"
        checked={filters.is_teacher}
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
        <option value="media">コンピュータサイエンス</option>
        <option value="management">経営学</option>
        <option value="internatianl">国際関係</option>
        <option value="lanaguage">言語学</option>
      </select>
    </div>

    {/* user can add per page item  defult is 50 */}
    <div className="flex items-center">
      <label className="text-gray-700 mr-2 text-sm">表示件数:</label>
      <select
        value={perPage}
        onChange={handlePerPageItemChange}
        className="w-full sm:w-48 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">選択してください</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="50">50</option>
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
              className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg ${currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-100 hover:text-gray-700"}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
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
                    ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg ${currentPage === totalPages ? "cursor-not-allowed" : "hover:bg-gray-100 hover:text-gray-700"}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
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
          <td className="px-4 py-4 text-gray-900 dark:text-gray-100 font-medium">{user.username}</td>
          <td className="px-4 py-4 text-gray-800 dark:text-gray-300">{user.first_name} {user.last_name}</td>
          <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{user.department}</td>
          <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{user.role}</td>
          <td className="px-4 py-4">
            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition duration-200 mr-4">
              Edit
            </button>
            <button
              onClick={() => deleteUser(user.id)}
             className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition duration-200">
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

