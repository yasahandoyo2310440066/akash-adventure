export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      {/* Judul Utama */}
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">
        Tentang <span className="text-gray-400">Kami</span>
      </h1>

      {/* Konten Utama */}
      <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
        <p>
          <strong>Akash Adventure</strong> hadir untuk melengkapi perjalanan Anda. 
          Kami percaya bahwa setiap petualangan membutuhkan peralatan yang tidak hanya 
          tahan lama, tetapi juga memiliki desain yang mendukung kenyamanan Anda di lapangan.
        </p>
        
       
      </div>

      {/* Box Tambahan (Opsional) */}
      <div className="mt-16 p-8 bg-gray-50 border-l-4 border-black">
        <h3 className="font-bold uppercase tracking-widest mb-2">Visi Kami</h3>
        <p className="text-sm">Menjadi penyedia layanan dan perlengkapan camping terbaik yang mendukung petualangan alam dengan memberikan pengalaman berkualitas,nyaman, dan aman bagi setiap pelanggan.</p>
      </div>
    </main>
  );
}