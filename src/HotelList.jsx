import { useEffect, useState } from 'react'

export default function HotelList({ onSelectHotel }) {
  const API = import.meta.env.VITE_BACKEND_URL || ''
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [seeding, setSeeding] = useState(false)

  const loadHotels = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/hotels`)
      if (!res.ok) throw new Error('Failed to load hotels')
      const data = await res.json()
      setHotels(data)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const seed = async () => {
    try {
      setSeeding(true)
      const res = await fetch(`${API}/seed`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to add sample data')
      await loadHotels()
    } catch (e) {
      setError(e.message)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Discover Hotels</h1>
        <div className="flex gap-2">
          <button
            onClick={loadHotels}
            className="text-sm px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Refresh
          </button>
          {hotels.length === 0 && (
            <button
              onClick={seed}
              disabled={seeding}
              className="text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {seeding ? 'Seeding…' : 'Add Sample Hotels'}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-gray-600">Loading hotels…</div>
      )}

      {error && (
        <div className="mt-4 text-red-600">{error}</div>
      )}

      {!loading && hotels.length === 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-700 mb-2">No hotels yet. Click "Add Sample Hotels" to get started.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(h => (
          <div key={h.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            {h.image_url && (
              <img src={h.image_url} alt={h.name} className="h-40 w-full object-cover" />)
            }
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{h.name}</h3>
              <p className="text-sm text-gray-500">{h.location}</p>
              <div className="mt-2 flex items-center gap-2 text-amber-600">
                <span className="font-medium">★ {h.rating ?? '4.5'}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 text-sm">{h.amenities?.slice(0,3).join(', ')}</span>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2">{h.description}</p>
              <button
                onClick={() => onSelectHotel(h)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                View Rooms
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
