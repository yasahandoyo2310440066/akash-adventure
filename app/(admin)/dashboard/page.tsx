import { prisma } from "@/lib/prisma";
import { createProduct, deleteProduct } from "@/app/actions/product";
import Link from "next/link"; 
import Image from "next/image"; // Tambahkan import Image
import { Trash2, Edit3, Plus, Package as PackageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Manajemen Stok & Produk Outdoor</p>
      </div>

      {/* FORM TAMBAH PRODUK */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-black text-white rounded-lg">
            <Plus size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-black">Tambah Produk Baru</h2>
        </div>
        
        <form action={createProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Nama Alat</label>
              <input name="name" placeholder="Contoh: Tenda Dome Kap 4" className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">URL Foto Produk</label>
              <input name="image" placeholder="https://..." className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Deskripsi Singkat</label>
            <textarea name="description" placeholder="Jelaskan kondisi atau spesifikasi alat..." className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all h-28 resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Harga (Per Hari)</label>
              <input name="price" type="number" placeholder="Rp 0" className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-mono outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Jumlah Stok</label>
              <input name="stock" type="number" placeholder="0" className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-mono outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" required />
            </div>
            <button type="submit" className="bg-black text-white p-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10">
              Simpan Ke Katalog
            </button>
          </div>
        </form>
      </section>

      {/* DAFTAR PRODUK */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-black">Katalog Saat Ini</h2>
          <span className="text-[10px] font-bold text-zinc-400 uppercase bg-zinc-100 px-3 py-1 rounded-full">{products.length} Items</span>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
          {products.length === 0 ? (
             <div className="p-20 text-center flex flex-col items-center gap-3">
                <PackageIcon size={40} className="text-zinc-200" />
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Belum ada produk yang terdaftar</p>
             </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {products.map((p) => (
                <div key={p.id} className="p-8 flex justify-between items-center hover:bg-zinc-50 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="relative w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center overflow-hidden border border-zinc-200">
                      {p.image ? (
                        <Image 
                          src={p.image} 
                          alt={p.name} 
                          fill 
                          className="object-cover" 
                          sizes="56px"
                          unoptimized // Agar loading dashboard lebih instan untuk thumbnail kecil
                        />
                      ) : (
                        <PackageIcon size={20} className="text-zinc-300" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-black uppercase tracking-tight text-base leading-none">{p.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono font-bold text-zinc-500">Rp {p.pricePerDay.toLocaleString()} / hari</span>
                        <span className="text-[10px] text-zinc-300">•</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock > 0 ? 'text-zinc-400' : 'text-red-400'}`}>
                          Stok: {p.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/products/${p.id}`} className="p-3 bg-white border border-zinc-200 text-black rounded-xl hover:bg-black hover:text-white transition-all shadow-sm">
                      <Edit3 size={16} />
                    </Link>
                    
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all rounded-xl shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}