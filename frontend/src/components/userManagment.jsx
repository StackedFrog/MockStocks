import React, { useEffect, useState } from 'react';
import { useApi } from "../hooks/useApi.jsx"
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';


function UserManagment() {
	let [users, setUsers] = useState([])

	const { apiFetch} = useApi()

	let fetchUsers = async () => {
		let res = await apiFetch("/api/user/admin/users", {method: "Get"})
		if(res.ok){
			let data = await res.json()
			console.log(data)
			setUsers(data)
		}
	}

	useEffect(() => {
		fetchUsers()
		const interval = setInterval(fetchUsers, 60000);
		return () => clearInterval(interval)
        }, []);

  return (
     <div className="relative overflow-visible rounded-xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
      <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
          <tr>
            <TableHeader name="Name" />
            <TableHeader name="Balance" />
            <TableHeader name="Role" />
	    <TableHeader name="" /> {/* Actions column */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {users.map((item) => (
            <tr
              key={item.user_id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <TableData data={item.username} />
              <TableData data={item.balance} />
              <TableData data={item.role} />
	      <ActionMenu user={item} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ name }) {
  return (
    <th className="px-6 py-3 text-sm font-semibold tracking-wide text-left">
      {name}
    </th>
  );
}

function TableData({ data }) {
  return (
    <td className="px-6 py-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
      {data}
    </td>
  );
}


function ActionMenu({ user }) {

	const { apiFetch} = useApi()
	const onDelete = async (user_id) => {
		let res = await apiFetch("/auth/admin/delete", {
			method: "Post",
			body: JSON.stringify({user_id: user_id })
		})
	}

	const onPromote = async (user_id) => {
		let res = await apiFetch("/auth/admin/update_role", {
			method: "Post",
			body: JSON.stringify({user_id: user_id , new_role:"Admin"})
		})
	}

	const onDemote = async (user_id) => {
		let res = await apiFetch("/auth/admin/update_role", {
			method: "Post",
			body: JSON.stringify({user_id: user_id , new_role:"User"})
		})
	}


   return (
    <td className="px-6 py-4 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 focus:outline-none">
          <div className="py-1">

	{user.role !== "Admin"?
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  onClick={() => {onPromote(user.user_id)}}
                >
                  Promote
                </button>
              )}
            </Menu.Item>
	    :
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                  onClick={() => {onDemote(user.user_id)}}
                >
                  Demote
                </button>
              )}
            </Menu.Item>
	    }
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-red-100 dark:bg-red-700' : ''
                  } block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-200`}
                  onClick={() => {onDelete(user.user_id)}}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </td>
  );
}



export default UserManagment
