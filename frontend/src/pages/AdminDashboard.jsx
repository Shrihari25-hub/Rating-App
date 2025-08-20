import { useState, useEffect } from 'react'
import { usersAPI, storesAPI, ratingsAPI } from '../services/api'
import DashboardTab from '../components/DashboardTab'
import UsersTab from '../components/UsersTab'
import StoresTab from '../components/StoresTab'
import AddUserTab from '../components/AddUserTab'
import AddStoreTab from '../components/AddStoreTab'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'dashboard') {
      await loadDashboardStats();
    } else if (activeTab === 'users') {
      await loadUsers();
    } else if (activeTab === 'stores') {
      await loadStores();
    }
  };

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const [usersResponse, storesResponse, ratingsResponse] = await Promise.all([
        usersAPI.getStats(),
        storesAPI.getStats(), 
        ratingsAPI.getStats()
      ]);
      
      const storesResponseAll = await storesAPI.getAll();
      
      setStats({
        total_users: usersResponse.data.total_users || 0,
        admin_users: usersResponse.data.admin_users || 0,
        total_stores: storesResponse.data.total_stores || 0,
        total_ratings: ratingsResponse.data.total_ratings || 0
      });
      
      setStores(storesResponseAll.data.stores || []);
    } catch (error) {
      console.error('Error loading stats:', error);
      try {
        const [usersResponse, storesResponseAll] = await Promise.all([
          usersAPI.getStats(),
          storesAPI.getAll()
        ]);
        
        setStats({
          total_users: usersResponse.data.total_users || 0,
          admin_users: usersResponse.data.admin_users || 0,
          total_stores: storesResponseAll.data.stores.length || 0,
          total_ratings: 0
        });
        
        setStores(storesResponseAll.data.stores || []);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await storesAPI.getAll();
      setStores(response.data.stores);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
    setLoading(false);
  };

  const handleUserAdded = () => {
    loadUsers();
    setActiveTab('users');
  };

  const handleStoreAdded = () => {
    loadStores();
    setActiveTab('stores');
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'users', name: 'Users' },
    { id: 'stores', name: 'Stores' },
    { id: 'add-user', name: 'Add User' },
    { id: 'add-store', name: 'Add Store' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'dashboard' && (
          <DashboardTab stats={stats} stores={stores} loading={loading} />
        )}
        {activeTab === 'users' && (
          <UsersTab users={users} loading={loading} onUserUpdate={loadUsers} />
        )}
        {activeTab === 'stores' && (
          <StoresTab stores={stores} loading={loading} />
        )}
        {activeTab === 'add-user' && (
          <AddUserTab onUserAdded={handleUserAdded} />
        )}
        {activeTab === 'add-store' && (
          <AddStoreTab onStoreAdded={handleStoreAdded} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;