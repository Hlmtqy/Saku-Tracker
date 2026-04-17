import {useState, useEffect} from 'react'
import { supabase } from '../lib/supabase';
import Modals from '../components/layout/Modals';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);//defalut true agar loading muncul 
  // saat muncul saat permata buka

  const fetchData = async () => {
    setIsLoading(true);
    try{
      //tarik data dari tabel jurnal_saku
    const {data: records, error} = await supabase
      .from('jurnal_saku')
      .select('*')
      //kalau data nya dapet , masukkin ke state
      if(records)  {
        setData(records)
      }
      if (error){
        throw error
      }
    } catch (error) {
        console.error('samu salah',error.message)
    } finally {
      setIsLoading(false)
    }
    
  };

  useEffect(() =>{
    fetchData();
  },[]);



  //variable dummy
  
  const totalPemasukan = data
      .filter(item => item.jenis === 'Pemasukan')
      .reduce((acc, curr) => acc + curr.nominal, 0)
      ;
  const totalPengeluaran = data
      .filter(item => item.jenis === 'Pengeluaran')
      .reduce((acc, curr) => acc + curr.nominal, 0)
      ;
  const saldo = totalPemasukan - totalPengeluaran;


  let persenPengeluaran = 0;
  if(totalPemasukan > 0){
    persenPengeluaran = (totalPengeluaran/ totalPemasukan) * 100
  }

  if(persenPengeluaran > 100){
    persenPengeluaran = 100
  }

  //fungsi mengubah angka jadi format ruopiah
  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID',
    {
      style:'currency',
      currency:'IDR',
      minimumFractionDigits: 0
    }).format(angka)

    if(isLoading) {
      return(
        <div className='p-5 pb-24 min-h-screen flex flex-col justify-center items-center bg-gray-50'>
          <div className='animate-spin text-5xl mb-4'>↻</div>
          <p className='text-gray-500 font-bold animate-pulse'>Membuka Brangkas</p>
        </div>
      )
    }

  return (
    <div className='p-5 pb-24'>
      {/* JUDUL */}
      <h1 className='text-2xl font-extrabold text-gray-800 mb-6'>Hello, Bos!</h1>

      {/* card saldo utama */}
      <div className='bg-emerald-500 rounded-2xl p-6 text-white shadow-lg mb-6 relative'>
      <p className="text-emerald-100 text-sm font-medium">Sisa saldo saku</p>
      <h2 className='text-4xl font-black mt-1'>{formatRupiah(saldo)}</h2>
      <div className='absolute -right-4 -bottom-4 opacity-50 text-8xl'>💰</div>
      </div>

        <div className='bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6'>
          {/* judulnya */}
          <div className='flex justify-between items-end mb-3'>
            <div>
              <h3 className='font-bold text-gray-800'>Rasio pengeluaran</h3>
              <p className='text-xs text-gray-400 mt-1'>
                {persenPengeluaran >= 80 
                  ? 'awas kamu boros!'
                  : 'kamu sehat'
                }</p>
            </div>
            <p className={`text-xl font-black ${persenPengeluaran >= 80 ? 'text-red-500' : 'text-yellow-500'}`}>{persenPengeluaran.toFixed(1)}%</p>
          </div>
          {/* gambarnya */}
          <div className='w-full bg-gray-100 rounded-full h-3.5 overflow-hidden'>
                <div className={`h-full rounded-full transition-all duration-1000 ${persenPengeluaran > 80 ? 'bg-red-500':'bg-yellow-400'}`}
                  style={{width: `${persenPengeluaran}%`}}  
                ></div>
          </div>
        </div>

        {/* statiskik mini */}
      <div className='flex gap-4 mb-8'>
        {/* kotak kiri */}
        <div className='flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-300'>
          <p className='text-xs text-gray-500'>Uang pemasukkan</p>
          <p className='text-lg font-bold text-green-600'>{formatRupiah(totalPemasukan)}</p>
        </div>
        {/* kotak kanan */}
        <div className='flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-300'>
          <p className='text-xs text-gray-500'>Uang pengeluaran</p>
          <p className='text-lg font-bold text-red-600'>{formatRupiah(totalPengeluaran)}</p>        
        </div>
      </div>

      {/* tombol catat */}
      <button className='w-full bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-slate-700 transition active:scale-95' onClick={() => setIsModalOpen(true)}>
        + Catat transaksi
      </button>
      <Modals 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        fetchData={fetchData}/>

    </div>
  );
};

export default Dashboard