import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi.jsx";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import Button from "./ui/Button.jsx";
import HoldingsTable from "./trading/HoldingsTable.jsx"
import RecentsTable from './trading/RecentsTable.jsx';


function UserManagement() {
  const [users, setUsers] = useState([]);
  const { apiFetch } = useApi();
  const [active, setActive] = useState(null);



  const toggleDetails = async (user) => {
		setActive(user)
  }

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
    <div className="relative   bg-background py-10 flex flex-col items-center">

	{active ? <UserDetails user={active} back={() => setActive(null)}/>:<>

	<h1 className="text-3xl font-heading text-secondary mb-8">User Management</h1>
      	<div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4">
        {users.map((user) => (
          <UserCard key={user.user_id} user={user} fetchUsers={fetchUsers} toggleDetails={toggleDetails} active={active} />
        )) }
      </div>
      </>
	}
    </div>
  );
}

function UserCard({ user, fetchUsers, toggleDetails, active}) {
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
    <div className="border relative h-min border-black px-3 py-2 rounded outline-none focus:ring-0 flex flex-col items-center bg-primary rounded-lg ">

	<div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-secondary">{user.username}</h2>
          <p className="text-secondary text-sm">Email: {user.email}</p>
          <p className="text-secondary text-sm">Balance: {user.balance}</p>
          <p className="text-sm text-secondary ">Role: {user.role}</p>
	<Button  text={active === user ? "Hide Details" : "Show Details"} onClick={() => toggleDetails(user)} />

	</div>


        <div className="absolute ml-2 top-2 right-2 ">
          <Menu as="div" className="relative inline-block text-top">
            <Menu.Button className="p-1 rounded-full hover:bg-accent cursor-pointer transition-colors focus:outline-none">
              <EllipsisVerticalIcon className="h-5 w-5 text-secondary" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-background border shadow-lg ring-1 focus:outline-none z-50">
              <div className="py-1">
                {user.role !== "Admin" ? (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={onPromote}
                        className={`${
                          active ? "bg-secondary" : ""
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
                          active ? "bg-secondary " : ""
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


function UserDetails({user, back}){
  const { apiFetch } = useApi();
  const [holdings, setHoldings] = useState([]);
  const [userTransactions, setUserTransactions] = useState(null);

  const fetchHoldings = async () => {
	const response = await apiFetch("/api/user/admin/user/holdings", {method:
		"POST", body: JSON.stringify({user_id: user.user_id})});
	const data = await response.json();
	const processedData = data.map(({ holding, performance, value }) => ({
		symbol: holding.symbol,
		quantity: parseFloat(holding.quantity).toFixed(5),
		updated: new Date(holding.last_updated).toLocaleString('en-GB', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',', ''),
		performance: (parseFloat(performance) >= 0 ? "+" : "") + parseFloat(performance).toFixed(5) + "%",
		value: parseFloat(value).toFixed(2) + " USD",
	}));
	setHoldings(processedData);
  }

  const fetchTransactions = async () => {
	const response = await apiFetch("/api/user/admin/user/transactions", {method:
		"POST", body: JSON.stringify({user_id:user.user_id})});
	const data = await response.json();
	const parsedData = data.map(t => ({
		date: new Date(t.date).toLocaleString('en-GB', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).replace(',', ''),
		symbol: t.symbol,
		amount: new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(t.amount),
		price: new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'}).format(t.price),
		quantity: parseFloat(t.quantity).toFixed(5),
		transaction_type: t.transaction_type
	}));
	setUserTransactions(parsedData);
  }

  useEffect(() => {
    fetchHoldings();
    fetchTransactions()
  }, []);
	return (
		<>
		<div className=" absolute left-2 top-2">
			<Button text={"Back"} onClick={back} className="max-w-[100px]"/>
		</div>
		<h1 className="text-3xl font-heading text-secondary mb-8 mt-11">Holdings</h1>
		<div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4">
			<HoldingsTable data={holdings} hidden={true}/>
		</div>
		<h1 className="text-3xl font-heading text-secondary mb-8 mt-8">Transactions</h1>
		<div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4">
			<RecentsTable data={userTransactions} hidden={true}/>

		</div>
		</>
	)
}
