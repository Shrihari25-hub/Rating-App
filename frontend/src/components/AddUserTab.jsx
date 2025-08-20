import { useState } from 'react'
import { usersAPI } from '../services/api'

const AddUserTab = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user' 
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters')
      return false
    }
    
    if (formData.address.length > 400) {
      setError('Address must not exceed 400 characters')
      return false
    }
    
    if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter and one special character')
      return false
    }

    setError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setSuccess('')

    try {
      await usersAPI.create(formData)
      setSuccess('User created successfully!')
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
      })
      onUserAdded()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create user')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New User</h2>
      
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Full Name (20-60 characters)"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Password (8-16 chars, uppercase + special)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              name="address"
              required
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Address (max 400 characters)"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role *</label>
            <select
              name="role"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserTab