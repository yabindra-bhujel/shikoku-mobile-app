import React from 'react';

const defaultImageUrl = 'https://via.placeholder.com/32';


interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  profilePicture: string;
}

interface UserListProps {
  users: User[];
  onDeleteUser: (id: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onDeleteUser }) => (
  <section className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
    <p className="text-sm text-gray-700 mb-2">ユーザーリスト</p>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map(user => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <img src={user.profilePicture || defaultImageUrl} alt={user.name} className="w-8 h-8 rounded-full"/>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => onDeleteUser(user.id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default UserList;
