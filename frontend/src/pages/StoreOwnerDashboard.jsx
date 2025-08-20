import { useState, useEffect } from 'react'
import { storesAPI, ratingsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadOwnerStores()
  }, [])

  const loadOwnerStores = async () => {
    setLoading(true)
    try {
      const response = await storesAPI.getOwnerDashboard()
      setStores(response.data.stores)
      if (response.data.stores.length > 0) {
        setSelectedStore(response.data.stores[0])
        loadStoreRatings(response.data.stores[0].id)
      }
    } catch (error) {
      console.error('Error loading stores:', error)
    }
    setLoading(false)
  }

  const loadStoreRatings = async (storeId) => {
    try {
      const response = await ratingsAPI.getStoreRatings(storeId)
      setRatings(response.data.ratings)
    } catch (error) {
      console.error('Error loading ratings:', error)
      setRatings([])
    }
  }

  const handleStoreSelect = async (store) => {
    setSelectedStore(store)
    await loadStoreRatings(store.id)
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Store Owner Dashboard</h2>
        <p className="text-gray-600">View your store ratings and customer feedback</p>
      </div>

      {stores.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">You don't own any stores yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Contact the system administrator to add stores to your account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store List */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Your Stores</h3>
              <div className="space-y-3">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                    className={`p-3 rounded cursor-pointer ${
                      selectedStore?.id === store.id
                        ? 'bg-indigo-100 border-indigo-300 border-2'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <h4 className="font-medium">{store.name}</h4>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 font-semibold">
                        {store.average_rating ? parseFloat(store.average_rating).toFixed(1) : '0'}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({store.rating_count} ratings)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Store Details and Ratings */}
          <div className="lg:col-span-2">
            {selectedStore && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStore.name}</h3>
                    <p className="text-gray-600">{selectedStore.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800">Average Rating</h4>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedStore.average_rating ? parseFloat(selectedStore.average_rating).toFixed(1) : '0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Customer Ratings</h4>
                  {ratings.length > 0 ? (
                    <div className="space-y-4">
                      {ratings.map((rating) => (
                        <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{rating.user_name}</p>
                              <p className="text-sm text-gray-600">{rating.user_email}</p>
                            </div>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-xl ${
                                      i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="ml-2 font-semibold">{rating.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            Rated on {new Date(rating.created_at).toLocaleDateString()} at{' '}
                            {new Date(rating.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No ratings yet for this store.</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Customers haven't rated this store yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreOwnerDashboard