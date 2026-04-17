import { supabase } from '../../lib/supabase';
import { useState } from "react"
import Swal from 'sweetalert2';


const Modals = ({isOpen, onClose, fetchData,editData}) => {
  //state untuk menangkap isian form
  const [formData, setFormData] = useState({
    jenis: 'Pengeluaran',
    nominal:'',
    kategori:'',
    catatan:''
  })

  const [isLoading, setIsLoading] = useState(false);

  
  //fungsi saat user mengetik di input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  //Fungsi saat tombol simpan diklik 
  const handelSubmit = async (e) =>{
    e.preventDefault(); 
    setIsLoading(true); 

    const cekNominal = parseInt(formData.nominal);
    if(!cekNominal  || cekNominal <=0){
      Swal.fire({
        title: 'Tunggu dulu!',
        text: 'nominal uang tidak boleh kosaong',
        icon: 'warning',
        confirmButtonColor: '#46db9e'
      });
      return;
    }

  try {
    if (editData){
      await supabase
      .from('jurnal_saku')
      .update({
        jenis: formData.jenis,
        nominal: parseInt(formData.nominal), 
        kategori: formData.kategori,
        catatan:formData.catatan
    })
    .eq('id',editData.id);
  } else {
    await supabase
      .from('jurnal_saku')
      .insert([{
        jenis: formData.jenis,
        nominal: parseInt(formData.nominal), 
        kategori: formData.kategori,
        catatan:formData.catatan
    }]);
  }
    

  Swal.fire({
    title: 'Berhasil!',
    text: editData ? 'Data berhasil diubah!' : 'Data baru berhasil dicatat!',
    icon: 'success',
    timer: 1500, // Otomatis nutup sendiri dalam 1.5 detik
    showConfirmButton: false
  } );


  fetchData();
  onClose();  

    // Nanti kita isi mantra Supabase di sini
  } catch (error) {
    alert('Waduh, terjadi kesalahan saat menyimpan data!');
  } finally {
    setIsLoading(false); // Matikan loading, apa pun yang terjadi
  }
};

  //Klau isOpen false jangan tampilkan apa apa 
  if(!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h2 className="text-xl  font-bold md-4">Catat baru</h2>
        <form onSubmit={handelSubmit} className="flex flex-col gap-4">

          {/* jenis */}
          <div>
            <label className="text-sm text-gray-500">Jenis</label>
            <select name="jenis" value={formData.jenis} onChange={handleChange} className="w-full boerder rounded-lg p-2 mt- outline-emerald-500">
              <option value="Pengeluaran">🛑Pengeluaran</option>
              <option value="Pemasukan">🟢Pemasukan</option>
            </select>
          </div>
          {/* nominal */}
          <div>
            <label className="text-sm text-gray-500">Nominal (Rp)</label>
            <input type="number" name="nominal" required value={formData.nominal} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"placeholder="Contoh: 15000"/>
          </div>
          {/* kategori */}
          <div>
            <label className="text-sm text-gray-500">Kategori</label>
            <input type="text" name="kategori" required value={formData.kategori} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"placeholder="makanan,kuota,dll"/>
          </div>
          {/* catatan */}
          <div>
            <label className="text-sm text-gray-500">Catatan</label>
            <input type="text" name="catatan" value={formData.catatan} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"placeholder="Beli apa?"/>
          </div>

          {/* button */}
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold">Batal</button>
            <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl disabled:bg-gray-400"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Jajan'}</button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default Modals