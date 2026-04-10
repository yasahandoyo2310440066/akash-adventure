import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/product";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PencilLine, ArrowLeft, Image as ImageIcon, ClipboardList, Tag, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) redirect("/dashboard/products");

  // WRAPPER UNTUK FIX TYPE ERROR
  // Kita buat fungsi async yang tidak me-return apa pun (Promise<void>)
  // Ini akan memuaskan ekspektasi atribut 'action' pada tag form
  const handleAction = async (formData: FormData) => {
    "use server"; // Menandakan ini dijalankan di server
    await updateProduct(id, formData);
    // Jika updateProduct kamu melakukan redirect di dalamnya, itu sudah cukup.
    // Jika tidak, kamu bisa tambah redirect("/dashboard/products") di sini.
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      
      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between mb-10">
        <div className="text-right">
          <h1 className="text-xl font-black uppercase tracking-tighter text-black">Edit Produk</h1>
          <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">ID: {product.id.slice(0,8)}</p>
        </div>
        <Link 
          href="/dashboard/products" 
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Katalog
        </Link>
      </div>

      {/* MAIN FORM CARD */}
      {/* Gunakan handleAction sebagai action form */}
      <form action={handleAction} className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
        
        {/* FORM CONTENT */}
        <div className="p-10 space-y-10">
          
          {/* Section 1: Visual & Identitas */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
               <Tag size={16} className="text-zinc-400" />
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Identitas Barang</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Nama Alat Outdoor</label>
                <input 
                  name="name" 
                  defaultValue={product.name} 
                  className="w-full bg-zinc-50 border-none p-5 rounded-2xl text-sm font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-black transition-all" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Link URL Foto (Pastikan HD)</label>
                <div className="relative">
                  <input 
                    name="image" 
                    defaultValue={product.image || ""} 
                    className="w-full bg-zinc-50 border-none p-5 pl-14 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black transition-all" 
                  />
                  <ImageIcon size={18} className="absolute left-5 top-5 text-zinc-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Finansial & Stok */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
               <Wallet size={16} className="text-zinc-400" />
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Harga & Ketersediaan</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Harga Sewa / Hari</label>
                <input 
                  name="price" 
                  type="number" 
                  defaultValue={product.pricePerDay} 
                  className="w-full bg-zinc-50 border-none p-5 rounded-2xl text-lg font-black text-red-600 font-mono outline-none focus:ring-2 focus:ring-black transition-all" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Jumlah Stok</label>
                <input 
                  name="stock" 
                  type="number" 
                  defaultValue={product.stock} 
                  className="w-full bg-zinc-50 border-none p-5 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-black transition-all" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Deskripsi */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
               <ClipboardList size={16} className="text-zinc-400" />
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">deskripsi</h2>
            </div>
            <div className="space-y-2">
              <textarea 
                name="description" 
                defaultValue={product.description || ""} 
                rows={5}
                placeholder="Tuliskan kondisi barang atau kelengkapan..."
                className="w-full bg-zinc-50 border-none p-6 rounded-[2rem] text-sm font-bold outline-none focus:ring-2 focus:ring-black transition-all resize-none" 
              />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-zinc-50/50 p-10 flex flex-col md:flex-row gap-4">
          <button 
            type="submit" 
            className="flex-[2] bg-black text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:bg-zinc-800 transition-all active:scale-[0.97]"
          >
            <PencilLine size={16} />
            Simpan Perubahan
          </button>
          
          <Link 
            href="/dashboard/products" 
            className="flex-1 bg-white border border-zinc-200 text-zinc-400 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] text-center hover:text-black hover:border-black transition-all"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}