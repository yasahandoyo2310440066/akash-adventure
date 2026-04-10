"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image"; // Import ini wajib

// 1. Definisikan tipe data Produk agar tidak pakai 'any'
interface Product {
  id: string;
  name: string;
  image?: string | null;
  category?: string;
  description?: string | null;
  pricePerDay: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group flex flex-col h-full transition-all duration-300 hover:shadow-lg p-2 rounded-lg">
      {/* Container Gambar - Aspect Square */}
      <div className="aspect-square overflow-hidden bg-gray-100 rounded-md mb-4 relative">
        {/* 2. Ganti img ke Image dengan layout fill atau spesifik size */}
        <Image 
          src={product.image || "/placeholder.jpg"} 
          alt={product.name} 
          fill // Mengikuti ukuran parent (aspect-square)
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false} // Gunakan true hanya untuk produk di baris paling atas
          unoptimized // Menambahkan ini agar gambar dari domain mana saja bisa muncul tanpa konfigurasi ribet
        />
      </div>
      
      {/* Info Produk */}
      <div className="flex flex-col flex-grow space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
          {product.category || "General"}
        </p>
        <h2 className="text-base font-black uppercase tracking-tight text-zinc-800 leading-tight">
          {product.name}
        </h2>
        
        <p className="text-sm text-zinc-500 line-clamp-2 italic">
          {product.description || "Deskripsi tidak tersedia"}
        </p>
        
        <p className="text-sm font-black text-zinc-800 pt-2">
          Rp {product.pricePerDay.toLocaleString('id-ID')} <span className="text-zinc-400 font-normal">/ hari</span>
        </p>
      </div>
      
      {/* Tombol Aksi */}
      <button
        onClick={() => addItem({ 
          id: product.id, 
          name: product.name, 
          price: product.pricePerDay, 
          quantity: 1 
        })}
        className="mt-4 w-full py-3 bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-colors hover:bg-black active:scale-[0.98]"
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
}