import React, { useEffect, useState } from 'react';
import Telemetry from '../../../components/telemetry.jsx';
import UserManagment from '../../../components/userManagment.jsx';

function AdminPage() {

 // let [ telemetryView, setTelemetryView ] = useState(false)
 const [activeTab, setActiveTab] = useState('userManagement');


  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


 return (
    <div className="p-6 space-y-4">
      <div className="flex space-x-4 mb-6">
        {/* Tab Buttons */}
        <button
          onClick={() => handleTabClick('userManagement')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none ${activeTab === 'userManagement' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
        >
          User Management
        </button>
        <button
          onClick={() => handleTabClick('stats')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none ${activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
        >
          Stats
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'userManagement' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">User Management</h3>
		<UserManagment />
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Stats</h3>
		<Telemetry  />
        </div>
      )}
    </div>
  );
};

export default AdminPage
