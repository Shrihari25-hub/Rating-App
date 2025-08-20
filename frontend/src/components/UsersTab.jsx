import { useState } from 'react'
import { usersAPI } from '../services/api'

const UsersTab = ({ users, loading, onUserUpdate }) => {
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  })
  const [editingUser, setEditingUser] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const handleEdit = (user) => {
    setEditingUser(user.id)
    setEditFormData({
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setEditFormData({})
    setError('')
    setSuccess('')
  }

  const handleSaveEdit = async (userId) => {
    try {
      const response = await usersAPI.update(userId, editFormData)
      setSuccess('User updated successfully!')
      setEditingUser(null)
      onUserUpdate() 
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update user')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await usersAPI.delete(userId)
      setSuccess('User deleted successfully!')
      onUserUpdate()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete user')
    }
  }

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (filters.role === '' || user.role === filters.role)
    )
  })

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'store_owner': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading users...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                  onClick={() => handleSort('role')}
                >
                  Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        value={editFormData.name}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <input
                        type="email"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        value={editFormData.email}
                        onChange={(e) => handleEditChange('email', e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        value={editFormData.address}
                        onChange={(e) => handleEditChange('address', e.target.value)}
                      />
                    ) : (
                      user.address
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        value={editFormData.role}
                        onChange={(e) => handleEditChange('role', e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(user.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  )
}

export default UsersTab