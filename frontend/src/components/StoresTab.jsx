import { useState } from 'react'

const StoresTab = ({ stores, loading }) => {
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  })

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const filteredStores = stores.filter(store => {
    return (
      store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      store.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      store.address.toLowerCase().includes(filters.address.toLowerCase())
    )
  })

  const sortedStores = filteredStores.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  if (loading) {
    return <div className="flex justify-center py-8">Loading stores...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Store Management</h2>
  
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.address}
              onChange={(e) => handleFilterChange('address', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('address')}
                >
                  Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('average_rating')}
                >
                  Rating {sortConfig.key === 'average_rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{store.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{store.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {store.average_rating > 0 ? (
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
        {sortedStores.length === 0 && (
          <div className="text-center py-8 text-gray-500">No stores found.</div>
        )}
      </div>
    </div>
  )
}

export default StoresTab