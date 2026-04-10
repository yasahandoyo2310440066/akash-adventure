import { MapPin, Navigation } from "lucide-react";
import Image from "next/image";

export default function LocationPage() {
  // Masukkan link Google Maps share lokasi Anda yang asli di sini
  const shareUrl = "https://maps.app.goo.gl/3YaQPn8Y2gkDSg7g8"; 

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-12">Lokasi</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Konten Peta - Gambar Baru */}
        <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 relative flex items-center justify-center">
          <Image 
            src="https://clipart-library.com/2024/map-cliparts/map-cliparts-7.jpg"
            alt="Peta Lokasi Akash Adventure"
            fill
            className="object-contain p-8"
          />
          
          <div className="absolute bottom-6 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            Workshop Akash Adventure
          </div>
        </div>
        
        {/* Info Area */}
        <div className="flex flex-col justify-start">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
            <MapPin size={14} /> Alamat Studio
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Jl. Lombok No 48 Ngebra,<br />
            Kec. Garum, Kabupaten Blitar,<br />
            Jawa Timur, 66182
          </p>

          <a 
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all w-fit"
          >
            <Navigation size={14} />
            Buka di Google Maps
          </a>
        </div>
      </div>
    </main>
  );
}