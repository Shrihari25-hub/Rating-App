import { useState } from 'react'
import { storesAPI } from '../services/api'

const AddStoreTab = ({ onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_email: ''  
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    if (!formData.owner_email.trim()) {
      setError('Owner email is required')
      setLoading(false)
      return
    }

    try {
      await storesAPI.create(formData)
      setSuccess('Store created successfully!')
      setFormData({
        name: '',
        email: '',
        address: '',
        owner_email: ''
      })
      onStoreAdded()
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create store')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Store</h2>
      
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
            <label className="block text-sm font-medium text-gray-700">Store Name *</label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Store Name"
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
              placeholder="Store Email"
              value={formData.email}
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
              placeholder="Store Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Email *</label>
            <input
              type="email"
              name="owner_email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Email of Store Owner"
              value={formData.owner_email}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the email of an existing store owner user.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating Store...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStoreTab