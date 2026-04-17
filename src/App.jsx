import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Navbar from './components/layout/Navbar';
import {useLocalStorage} from './hooks/useLocalStorage'

function App() {
 const [Pin, setPin] = useLocalStorage ('saku_pin', null);
 const [inputPin, setInputPin] = useState ('');

  const handleKeypad = (angka) => {
    if(inputPin.length < 4) {
      setInputPin(inputPin + angka)
    }
  }

  const hapusSatu = () => {
    setInputPin(inputPin.slice(0,-1))
  }

if(Pin === null){
  return(
    <div className='min-h-screen
 bg-gray-500 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-80 text-center'>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Buat PIN Keamanan
        </h1>
        <p className="text-gray-500 mb-4">
          Masukkan PIN
        </p>

      {/* Tampilan bulatan pin(titik titik) */}
      <div className='text-4xl tracking-[1em] font-bold mb-8 text-emerald-800'>
        {inputPin.padEnd(4, '_').replace(/./g,(c) => c === '_' ? '_' : '.')}
      </div>

      {/* wadah keypad */}
      <div className='grid grid-cols-3 gap-4 w-full max-w-[250px] mb-8'>
        {[1,2,3,4,5,6,7,8,9].map((num) => (
          <button 
            key={num}
            onClick={() => handleKeypad(num.toString()) }
            className='bg-white text-2xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald-100 transition active:scale-95'
          >
            {num}
          </button>
        ))}
        <div></div>
        <button 
         onClick={() => handleKeypad("0")}
         className='bg-white text-2xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald-100 transition active:scale-95'
        >0</button>
        <button
          onClick={hapusSatu}
          className='bg-red-100 text-red-500 text-xl font-bold py-4 rounded-full shadow-sm hover:bg-red-200 transition active:scale-95'
        >
          DEL
        </button>
      </div>



      {/* <input 
        type='password'
        maxLength={4}
        value={inputPin}
        onChange={(e) => setInputPin(e.target.value)}
        className="w-full text-center tracking-[10px] text-xl border-2 border-gray-300 rounded-lg py-3 mb-6 focus:outline-none focus:border-blue-500"
        placeholder="...."
      /> */}
      <button 
        className='w-full bg-black text-white font-semibold py-3 rounded-lg transition duration-200'
        onClick={() => {
          if (inputPin.length === 4) setPin(inputPin);
        }}
      
      >masukkan</button>
      </div>
    </div>
  )
}
  

  return (
    //ukuran mobile
    <div className='min-h-screen bg-gray-100 flex justify-center'>
      <div className='w-full max-w-100 bg-gray-50 min-h-screen relative shadow-2xl border-red-500 border-1'>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/logs" element={<Logs/>}></Route>
        </Routes>
        <Navbar/>
      </Router>
      </div>
    </div>
  );
}

export default App
