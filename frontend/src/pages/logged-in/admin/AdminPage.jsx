import React, { useState, useEffect } from 'react';
import Telemetry from '../../../components/telemetry.jsx';
import UserManagment from '../../../components/userManagment.jsx';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('userManagement');

  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <div className="p-6 h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          onClick={() => handleTabClick('userManagement')}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeTab === 'userManagement'
              ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => handleTabClick('stats')}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-gray-800 border border-b-0 border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Stats
        </button>
      </div>

      {/* Panel */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow rounded-b-lg p-6">
        {activeTab === 'userManagement' && (
          <>
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <UserManagment />
          </>
        )}
        {activeTab === 'stats' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <Telemetry />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
