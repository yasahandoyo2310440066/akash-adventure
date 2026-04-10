import Navbar from "@/components/Navbar";
import Link from "next/link"; // WAJIB ADA agar tag <Link> jalan

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar hanya untuk halaman Publik */}
      <Navbar />
      
      <main className="flex-grow bg-white">
        {children}
      </main>

      <footer className="bg-black text-white py-16 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6">
          
          {/* LOGO & BRAND */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-black uppercase tracking-[0.3em]">
              AKASH <span className="text--500">ADVENTURE</span>
            </h3>
            {/* Garis aksen kecil biar lebih artistik */}
            <div className="w-8 h-[2px] bg-zinc-700 mt-2"></div> 
          </div>

          {/* NAVIGASI SINGKAT */}
          <div className="flex gap-6 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            {/* Link Admin disamarkan biar gak norak */}
            <Link href="/admin/login" className="hover:text-zinc-300 transition-colors opacity-30">Staff</Link>
          </div>

          {/* COPYRIGHT */}
          <div className="space-y-1 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">
              ©2021 Akash Adventure. All rights reserved.
            </p>
            <p className="text-[8px] text-zinc-800 uppercase tracking-widest">
              Gear Up. Get Out.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}