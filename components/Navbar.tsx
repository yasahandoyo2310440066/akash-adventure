"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, History, Menu, X } from "lucide-react"; 
import { useCartStore } from "@/store/cartStore";
import CartModal from "@/components/CartModal"; 
import logoImg from "./logo.png";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "TENTANG KAMI", href: "/about" },
    { name: "PRODUK", href: "/#koleksi" },
    { name: "KONTAK", href: "/contact" },
    { name: "LOKASI", href: "/location" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-full mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
          
          {/* SISI KIRI: LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-100 shadow-sm">
                <Image 
                  src={logoImg} 
                  alt="Akash Adventure Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-black text-zinc-800 tracking-tighter text-xl uppercase leading-none">
                  Akash Adventure
                </span>
                <span className="text-[8px] font-bold text-zinc-400 tracking-[0.3em] uppercase mt-1 leading-none">
                  Gear Up. Get Out.
                </span>
              </div>
            </Link>
          </div>

          {/* SISI TENGAH: MENU NAVIGASI (Desktop) */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-700 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* SISI KANAN: ACTIONS & TOGGLE */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/history" className="p-2.5 hover:bg-zinc-50 rounded-2xl transition-colors text-zinc-400 hover:text-black">
                <History size={20} strokeWidth={2.5} />
              </Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 hover:bg-zinc-50 rounded-2xl transition-colors relative text-zinc-400 hover:text-black"
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
                {isMounted && totalItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* MOBILE TOGGLE */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 hover:bg-zinc-50 rounded-2xl transition-colors text-zinc-800 md:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-100 p-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[12px] font-black uppercase tracking-[0.2em] text-black"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}