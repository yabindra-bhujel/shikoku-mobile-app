import { useState, useEffect } from 'react';


export function useUsers(initialFilters: any, initialPage: number, perPage: number) {
  const [filters, setFilters] = useState(initialFilters);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [perOnePage, setPerOnePage] = useState(perPage);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== "" && filters[key] !== false) {
        params.append(key, filters[key].toString());
      }
    });
    params.append("page", currentPage.toString());
    params.append("size", perOnePage.toString());
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
      setUsers(data.items);
    } catch (error) {
      setError("Failed to fetch users.");
    }
  }

  const deleteUser = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.status === 204) {
        setMessage("User deleted successfully.");
        fetchUsers(currentPage);
      } else {
        setError("Failed to delete user. Please try again.");
      }
    } catch (error) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
    }
  }

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, filters, perOnePage]);

  return {
    filters,
    users,
    currentPage,
    totalPages,
    perPage,
    message,
    error,
    setFilters,
    setCurrentPage,
    setPerOnePage,
    deleteUser,
  };
}
