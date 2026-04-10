import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
        <p className="text-gray-500 max-w-lg">
          Ada pertanyaan seputar penyewaan atau butuh bantuan untuk persiapan petualangan Anda? Kami siap membantu.
        </p>
      </div>
      
      {/* Grid Kontak */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Email */}
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-indigo-200 transition-all group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-indigo-600">
            <Mail size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Resmi</p>
          <a href="mailto:akashadventure@gmail.com" className="text-lg font-semibold text-gray-800 hover:text-indigo-600">
            akashadventure@gmail.com
          </a>
        </div>
        
        {/* WhatsApp */}
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-green-200 transition-all group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-green-600">
            <MessageCircle size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">WhatsApp</p>
          <a href="https://wa.me/6288228115641" target="_blank" className="text-lg font-semibold text-gray-800 hover:text-green-600">
            0882-2811-5641
          </a>
        </div>

        {/* Alamat (Tambahan agar tidak kosong) */}
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-gray-600">
            <MapPin size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Lokasi Workshop</p>
          <p className="text-md font-medium text-gray-800">Blitar, Jawa Timur</p>
        </div>

        {/* Jam Operasional (Tambahan agar informatif) */}
        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-gray-600">
            <Clock size={20} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Jam Buka</p>
          <p className="text-md font-medium text-gray-800">Setiap Hari: 25jam</p>
        </div>
      </div>
    </main>
  );
}