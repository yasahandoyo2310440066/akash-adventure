import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image"; // Tambahkan import Image
import { revalidatePath } from "next/cache";
import { Trash2, Plus, Package, Search, PencilLine } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
  revalidatePath("/dashboard/products");
}

async function handleSearch(formData: FormData) {
  "use server";
  const query = formData.get("query") as string;
  if (query) {
    redirect(`/dashboard/products?search=${query}`);
  } else {
    redirect(`/dashboard/products`);
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>; 
}) {
  // 1. Await searchParams (Wajib di Next.js 15)
  const resolvedParams = await searchParams;
  const search = resolvedParams.search;
  
  // 2. Query database dengan filter search
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      name: {
        contains: search || "",
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      {/* BAGIAN ATAS: PENCARIAN & TOMBOL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <form action={handleSearch} className="md:col-span-9 relative">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-zinc-400">
            <Search size={18} />
          </div>
          <input 
            name="query"
            type="text" 
            placeholder="KETIK NAMA ALAT LALU TEKAN ENTER..." 
            defaultValue={search}
            className="w-full bg-white border border-zinc-200 py-4 pl-14 pr-6 rounded-3xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-black transition-all shadow-sm"
          />
        </form>

        <Link 
          href="/dashboard/products/new"
          className="md:col-span-3 bg-black text-white py-4 rounded-3xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-lg hover:bg-zinc-800 transition-colors active:scale-95"
        >
          <Plus size={16} strokeWidth={3} />
          TAMBAH PRODUK
        </Link>
      </div>

      {/* KONTAINER UTAMA PRODUK */}
      <section className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 p-8 bg-zinc-50 border-b border-zinc-100">
          <span className="col-span-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Informasi Barang</span>
          <span className="col-span-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Harga Sewa / Hari</span>
          <span className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Stok</span>
          <span className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right pr-4">Aksi</span>
        </div>

        <div className="divide-y divide-zinc-50">
          {products.length === 0 ? (
            <div className="p-32 text-center flex flex-col items-center gap-4">
              <Package size={48} className="text-zinc-100" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
                {search ? `"${search}" Tidak Ditemukan` : "Belum Ada Data Produk"}
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="grid grid-cols-1 lg:grid-cols-12 p-8 items-center bg-white transition-colors">
                <div className="col-span-5 flex items-center gap-6">
                  <div className="relative w-20 h-20 rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200 flex-shrink-0">
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <Package size={24} />
                      </div>
                    )}
                  </div>
                  <span className="font-black text-black uppercase tracking-tight text-base leading-tight">
                    {product.name}
                  </span>
                </div>

                <div className="col-span-3 text-center mt-6 lg:mt-0">
                  <span className="text-lg font-black text-red-600 font-mono tracking-tighter">
                    Rp {product.pricePerDay.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="col-span-2 flex justify-center mt-6 lg:mt-0">
                  <div className="px-5 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      {product.stock} Unit
                    </span>
                  </div>
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-6 lg:mt-0">
                  <Link href={`/dashboard/products/${product.id}`} className="p-3.5 bg-zinc-900 text-white rounded-xl shadow-md hover:bg-black transition-colors flex items-center justify-center">
                    <PencilLine size={18} />
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button type="submit" className="p-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl shadow-sm hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}