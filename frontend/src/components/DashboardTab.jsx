const DashboardTab = ({ stats, stores, loading }) => {
  if (loading) {
    return <div className="flex justify-center py-8">Loading dashboard...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
       {/* Statistics Cards  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-3xl font-bold">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Admin Users</h3>
          <p className="text-3xl font-bold">{stats?.admin_users || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600">Total Stores</h3>
          <p className="text-3xl font-bold">{stats?.total_stores || 0}</p>
        </div>
        
      </div>

      {/* Recent Stores */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Stores</h3>
        {stores && stores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.slice(0, 5).map((store) => (
                  <tr key={store.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{store.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{store.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {store.average_rating ? (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{parseFloat(store.average_rating).toFixed(1)}</span>
                          {store.rating_count > 0 && (
                            <span className="text-gray-500 text-sm ml-1">({store.rating_count})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No ratings</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No stores found.</p>
        )}
      </div>
    </div>
  )
}

export default DashboardTab