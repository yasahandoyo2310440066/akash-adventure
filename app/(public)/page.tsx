import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function Page() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    orderBy: { name: 'asc' }
  });

  return (
    <main className="bg-white min-h-screen selection:bg-black selection:text-white">
      {/* 1. HERO SECTION SINEMATIK */}
      <section 
        className="relative w-full flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images6.alphacoders.com/378/thumb-1920-378352.jpg')`,
          height: '70vh', 
          minHeight: '500px'
        }}
      >
        {/* LAYER 1: OVERLAY GELAP */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* LAYER 2: EFEK SAMAR TEPI BAWAH (Sesuai request: Samar tipis) */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fcfcfc] to-transparent z-15" />
        {/* Catatan: Warna #fcfcfc disesuaikan dengan bg-zinc-50/50 di bawah agar menyatu sempurna */}

        {/* CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-4 drop-shadow-2xl">
            Akash Adventure
          </h1>
          
          <p className="text-zinc-200 uppercase tracking-[0.3em] text-[10px] md:text-xs mb-8 max-w-xl leading-relaxed opacity-90">
            Temukan Kenyamanan <br className="hidden md:block" /> 
            Melengkapi Petualangan Alam Anda.
          </p>

          <a 
            href="#koleksi" 
            className="px-8 py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl"
          >
            Lihat Koleksi
          </a>
        </div>
      </section>

      {/* 2. DAFTAR PRODUK (Katalog) */}
      <section id="koleksi" className="px-6 py-24 md:px-16 lg:px-32 bg-zinc-50/50">
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-zinc-800 leading-none">
            Sewa Sekarang!
          </h2>
          <p className="text-zinc-400 uppercase tracking-widest text-xs mt-4">Peralatan Camping Premium Siap Petualang</p>
          <div className="h-1 w-20 bg-zinc-800 mt-8 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4 bg-white rounded-[2rem] border border-zinc-100 shadow-sm">
              <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Belum ada produk tersedia di katalog.</p>
            </div>
          )}
        </div>
      </section>
      
    </main>
  );
}