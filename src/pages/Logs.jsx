import { Key } from 'lucide-react'
import { Trash2, Edit } from 'lucide-react'
import { data } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Swal from 'sweetalert2'
import Modals from '../components/layout/Modals'


const Logs = () => {
  //buat state untuk menyimpan data awal array kosong, data
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);


  //Tugas 1


  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style:'currency', currency: 'IDR',minimumFractionDigits: 0}). format(angka)

  const fetchData = async () => {
    //tarik data dari tabel jurnal_saku
    setIsLoading(true); 
    try{
    const {data: records, error} = await supabase
      .from('jurnal_saku')
      .select('*')
      .order('created_at', {ascending: false})
      //kalau data nya dapet , masukkin ke state
      if(records)  {
        setData(records)
      }
     } catch (error) {
      console.log("Error woi",error)
     } finally {
      setIsLoading(false)
     }
  }

//dijalanin pas di awal aj

  useEffect(() =>{
    fetchData();
  },[]);


  //FUNGSI DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin dihapus?',
      text: 'Data yang di hapus tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#46db9e',
      cancelButtonColor: '#f94c63',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });


    if(result.isConfirmed){
      setIsLoading(true);
      try{
        await supabase 
        .from('jurnal_saku')
        .delete()
        .eq('id', id)

        Swal.fire('Terhapus!','Catatan berhasil di buang!','success')

        fetchData();
      }catch{
        Swal.fire('Error!','Gagal menghapus data!','error')
      }finally{
        setIsLoading(false)
      }
    }
  }

      const handleEdit = (item) => {
 		  setEditData(item);      // Tangkap data baris ini!
  		setIsModalOpen(true);   // Buka modalnya!
    };

  return (
    //tugas 2
    <div className='p-5 pb-24'>
      <h1 className='text-2xl font-extrabold text-gray-800 mb-6'>Riwayat</h1>
      {/* mapping tugas 3 */}
      <div>
        {data.map((item)=>
        <div 
          key={item.id}
          className='bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 flex justify-between items-center'
        >
          <div>
            <p>{item.catatan}</p>
            <span>{item.kategori}</span>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <span className={`${item.jenis === "Pemasukan"? "text-green-400" : "text-red-500"}`}>
              {item.jenis === "Pemasukan"? "+" : "-"}
              {formatRupiah(item.nominal)}
            </span>
            
            <div className='flex gap-3 text-gray-400'>
              <button 
              onClick={() => handleEdit(item)}
              className='hover:text-blue-500'><Edit size={16}/></button>
              <button 
              onClick={() => handleDelete(item.id)}
              className='hover:text-red-500'><Trash2 size={16}/></button>
            </div>
          </div>
        </div>
        )}

        {data.length === 0 && (
          <div className='flex flex-col items-center justify-center mt-20 mb-4 text-gray-400'>
            <div className='text-6xl md-4'>🥵</div>
            <p className='font-medium text-lg'>belum ada riwayat catatan</p>
            <p className='text-sm'>mulai catatan keuangan hari ini</p>
          </div>
        )}
      </div>

      <Modals 
        isOpen={isModalOpen} 
        onClose={() => {
        setIsModalOpen(false); // Tutup modal
        setEditData(null);     // Kosongkan lagi memori editnya
      }} 
        fetchData={fetchData} 
        editData={editData}      // Kunci Utama: Melempar data lama ke Modal!
      />
    </div>
  )
}

export default Logs