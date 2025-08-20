import { useState, useEffect } from 'react'
import { storesAPI, ratingsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const UserDashboard = () => {
  const [stores, setStores] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userRatings, setUserRatings] = useState({})
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    setLoading(true)
    try {
      const response = await storesAPI.getAll()
      setStores(response.data.stores)
      
      const ratings = {}
      for (const store of response.data.stores) {
        try {
          const ratingResponse = await ratingsAPI.getUserRating(store.id)

          ratings[store.id] = ratingResponse.data.rating ? ratingResponse.data.rating.rating : null
        } catch (error) {
          ratings[store.id] = null
        }
      }
      setUserRatings(ratings)
    } catch (error) {
      console.error('Error loading stores:', error)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await storesAPI.search(searchTerm)
      setStores(response.data.stores)
    } catch (error) {
      console.error('Error searching stores:', error)
    }
    setLoading(false)
  }

  const handleRating = async (storeId, rating) => {
    try {
      await ratingsAPI.submit({ store_id: storeId, rating })
      setUserRatings(prev => ({ ...prev, [storeId]: rating }))
      
      const response = await storesAPI.getAll()
      setStores(response.data.stores)
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Store Directory</h2>
        <p className="text-gray-600">Welcome, {user?.name}! Rate your favorite stores.</p>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search stores by name or address..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="flex justify-center py-8">Loading stores...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
              <p className="text-gray-600 mb-4">{store.address}</p>
              
              <div className="flex items-center mb-4">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="ml-2 text-lg font-semibold">
                  {store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'No ratings'}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  ({store.rating_count} ratings)
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Your rating: {userRatings[store.id] ? `${userRatings[store.id]} stars` : 'Not rated yet'}
                </p>
              </div>

              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(store.id, star)}
                    className={`p-2 rounded ${
                      userRatings[store.id] === star
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ★ {star}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredStores.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No stores found. {searchTerm && 'Try a different search term.'}
        </div>
      )}
    </div>
  )
}

export default UserDashboard