import React, { useState } from 'react';
import Telemetry from '../../../components/telemetry.jsx';
import UserManagment from '../../../components/userManagment.jsx';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('userManagement');

  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <div className="flex flex-col p-2 sm:p-6 bg-background text-text font-text">
      {/* Tabs */}
      <div className="flex pl-4 gap-4 border-border mb-6">
        <button
          onClick={() => handleTabClick('userManagement')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'userManagement'
              ? 'bg-white dark:bg-gray-900 border border-b-0 border-border text-primary'
              : 'bg-muted text-muted-foreground hover:bg-accent dark:hover:bg-gray-800'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => handleTabClick('stats')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-gray-900 border border-b-0 border-border text-primary'
              : 'bg-muted text-muted-foreground hover:bg-accent dark:hover:bg-gray-800'
          }`}
        >
          Stats
        </button>

      </div>
	{/* Panel */}
	<div className="min-h-screen  w-full bg-background border border-border border-primary shadow-lg rounded-2xl p-4 sm:p-6 transition-all">
	  {activeTab === 'userManagement' && <UserManagment />}
	  {activeTab === 'stats' && (
	    <>
	      <h3 className="text-xl font-semibold mb-4">Stats</h3>
	      <Telemetry />
	    </>
	  )}
	</div>
    </div>
  );
}

export default AdminPage;
