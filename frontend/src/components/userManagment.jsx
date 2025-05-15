import React, { useEffect, useState } from 'react';
import { useApi } from "../hooks/useApi.jsx";
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

function UserManagment() {
  const [users, setUsers] = useState([]);
  const { apiFetch } = useApi();

  const fetchUsers = async () => {
    const res = await apiFetch("/api/user/admin/users", { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-visible rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
          <tr>
            <TableHeader name="Name" />
            <TableHeader name="Balance" />
            <TableHeader name="Role" />
            <TableHeader name="" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => (
            <tr
              key={user.user_id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <TableData data={user.username} />
              <TableData data={user.balance} />
              <TableData data={user.role} />
              <ActionMenu user={user} fetchUsers={fetchUsers} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ name }) {
  return (
    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wide">
      {name}
    </th>
  );
}

function TableData({ data }) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">
      {data}
    </td>
  );
}

function ActionMenu({ user, fetchUsers }) {
  const { apiFetch } = useApi();

  const onDelete = async (user_id) => {
    await apiFetch("/auth/admin/delete", {
      method: "Post",
      body: JSON.stringify({ user_id }),
    });
   fetchUsers()

  };

  const onPromote = async (user_id) => {
    await apiFetch("/auth/admin/update_role", {
      method: "Post",
      body: JSON.stringify({ user_id, new_role: "Admin" }),
    });
  };

  const onDemote = async (user_id) => {
    await apiFetch("/auth/admin/update_role", {
      method: "Post",
      body: JSON.stringify({ user_id, new_role: "User" }),
    });
  };

  return (
    <td className="px-6 py-4 text-right">
      <div className="relative inline-block">
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 focus:outline-none">
            <div className="py-1">
              {user.role !== "Admin" ? (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onPromote(user.user_id)}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200`}
                    >
                      Promote to Admin
                    </button>
                  )}
                </Menu.Item>
              ) : (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDemote(user.user_id)}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-700" : ""
                      } block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200`}
                    >
                      Demote to User
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onDelete(user.user_id)}
                    className={`${
                      active ? "bg-red-100 dark:bg-red-700" : ""
                    } block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-200`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </td>
  );
}

export default UserManagment;
