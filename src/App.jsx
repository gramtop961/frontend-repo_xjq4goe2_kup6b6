import { useState } from 'react'
import HotelList from './HotelList'
import HotelDetail from './HotelDetail'

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white/70 backdrop-blur sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">StayFinder</h1>
          <a
            href="#"
            className="text-sm text-blue-700 hover:underline"
            onClick={(e)=>{e.preventDefault(); setSelected(null)}}
          >Browse</a>
        </div>
      </header>

      {!selected && (
        <HotelList onSelectHotel={setSelected} />
      )}

      {selected && (
        <HotelDetail hotel={selected} onBack={() => setSelected(null)} />
      )}

      <footer className="text-center text-xs text-gray-500 py-6">Simple demo hotel booking app</footer>
    </div>
  )
}

export default App
