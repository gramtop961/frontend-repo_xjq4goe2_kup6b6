import { useEffect, useState } from 'react'

export default function HotelDetail({ hotel, onBack }) {
  const API = import.meta.env.VITE_BACKEND_URL || ''
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [dates, setDates] = useState({ check_in: '', check_out: '', guests: 1 })
  const [available, setAvailable] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API}/hotels/${hotel.id}`)
        const data = await res.json()
        setRooms(data.rooms || [])
      } finally {
        setLoading(false)
      }
    }
    if (hotel?.id) load()
  }, [hotel, API])

  const check = async () => {
    setMessage('')
    const res = await fetch(`${API}/availability/${hotel.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dates)
    })
    const data = await res.json()
    setAvailable(data.available || [])
  }

  const book = async (room) => {
    setMessage('')
    const payload = {
      hotel_id: hotel.id,
      room_id: room.id,
      guest_name: 'Guest',
      guest_email: 'guest@example.com',
      check_in: dates.check_in,
      check_out: dates.check_out,
      guests: Number(dates.guests),
      total_price: 0,
      status: 'confirmed'
    }
    const res = await fetch(`${API}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (res.ok) setMessage(`Booking confirmed. Total ${data.total_price}`)
    else setMessage(data.detail || 'Booking failed')
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">← Back</button>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {hotel.image_url && (
          <img src={hotel.image_url} alt={hotel.name} className="h-56 w-full object-cover" />
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
          <p className="text-gray-600">{hotel.location}</p>

          <div className="mt-4 grid sm:grid-cols-2 gap-4 items-end">
            <div className="flex gap-3">
              <div>
                <label className="block text-sm text-gray-600">Check-in</label>
                <input type="date" value={dates.check_in} onChange={e=>setDates(d=>({...d, check_in:e.target.value}))} className="border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Check-out</label>
                <input type="date" value={dates.check_out} onChange={e=>setDates(d=>({...d, check_out:e.target.value}))} className="border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Guests</label>
                <input type="number" min="1" value={dates.guests} onChange={e=>setDates(d=>({...d, guests:e.target.value}))} className="border rounded px-3 py-2 w-24" />
              </div>
            </div>
            <button onClick={check} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Check availability</button>
          </div>

          <h3 className="mt-6 text-xl font-semibold">Rooms</h3>
          {loading && <p>Loading rooms…</p>}

          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            {rooms.map(r => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  {r.images?.[0] && <img src={r.images[0]} alt={r.name} className="w-28 h-20 object-cover rounded" />}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{r.name}</h4>
                    <p className="text-sm text-gray-600">Sleeps {r.capacity} • ${r.price_per_night}/night</p>
                    <p className="text-sm text-gray-500">{r.amenities?.join(', ')}</p>
                    <div className="mt-2">
                      {available.find(a=>a.id===r.id) ? (
                        <button onClick={()=>book(r)} className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">Book now</button>
                      ) : (
                        <span className="text-gray-500 text-sm">Check availability to book</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {message && <div className="mt-4 text-blue-700">{message}</div>}
        </div>
      </div>
    </div>
  )
}
