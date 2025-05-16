import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi.jsx";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";

function UserManagement() {
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
    <div className="min-h-screen bg-background py-10 flex flex-col items-center">
      <h1 className="text-3xl font-heading text-secondary mb-8">User Management</h1>
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4">
        {users.map((user) => (
          <UserCard key={user.user_id} user={user} fetchUsers={fetchUsers} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user, fetchUsers }) {
  const { apiFetch } = useApi();

  const onDelete = async () => {
    await apiFetch("/auth/admin/delete", {
      method: "POST",
      body: JSON.stringify({ user_id: user.user_id }),
    });
    fetchUsers();
  };

  const onPromote = async () => {
    await apiFetch("/auth/admin/update_role", {
      method: "POST",
      body: JSON.stringify({ user_id: user.user_id, new_role: "Admin" }),
    });
    fetchUsers();
  };

  const onDemote = async () => {
    await apiFetch("/auth/admin/update_role", {
      method: "POST",
      body: JSON.stringify({ user_id: user.user_id, new_role: "User" }),
    });
    fetchUsers();
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 w-full sm:w-72 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{user.username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance: ${user.balance}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Role: {user.role}</p>
        </div>
        <div className="ml-2">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
              <div className="py-1">
                {user.role !== "Admin" ? (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={onPromote}
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
                        onClick={onDemote}
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
                      onClick={onDelete}
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
      </div>
    </div>
  );
}

export default UserManagement;


