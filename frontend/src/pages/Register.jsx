import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'user' 
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
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

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return
    
    setLoading(true)

    const { confirmPassword, ...userData } = formData
    const result = await register(userData)
    
    if (result.success) {
      if (formData.role === 'admin') {
        navigate('/admin')
      } else if (formData.role === 'store_owner') {
        navigate('/store-owner')
      } else {
        navigate('/user')
      }
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select your role to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
              <div className="grid grid-cols-3 gap-2">
                <label className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer ${
                  formData.role === 'user' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">👤 User</span>
                  <span className="text-xs text-gray-500 mt-1">Rate stores</span>
                </label>
                
                <label className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer ${
                  formData.role === 'store_owner' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="store_owner"
                    checked={formData.role === 'store_owner'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">🏪 Owner</span>
                  <span className="text-xs text-gray-500 mt-1">Manage stores</span>
                </label>
                
                <label className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer ${
                  formData.role === 'admin' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">⚙️ Admin</span>
                  <span className="text-xs text-gray-500 mt-1">Manage system</span>
                </label>
              </div>
            </div>
            
            <div>
              <input
                name="name"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Full Name (20-60 characters)"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <textarea
                name="address"
                required
                rows={3}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Address (max 400 characters)"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password (8-16 chars, uppercase + special)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <input
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : `Sign up as ${formData.role}`}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register