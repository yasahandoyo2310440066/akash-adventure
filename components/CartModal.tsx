"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { createRental, updateRentalToSuccess } from "@/app/actions/rental";
import { createPayment } from "@/app/actions/payment";
import { X, Plus, Minus, Trash2, Calendar, User, Phone, ShoppingCart } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Definisikan tipe untuk response Midtrans agar tidak pakai 'any'
interface MidtransResult {
  order_id: string;
  status_code: string;
  transaction_status: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks: {
        onSuccess: (result: MidtransResult) => void;
        onPending: (result: MidtransResult) => void;
        onError: (result: unknown) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, increaseQty, decreaseQty, removeItem, clearCart } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!;

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (!isOpen || !isMounted) return null;

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const duration = calculateDays(startDate, endDate);
  const baseTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const finalTotal = baseTotal * duration;

  const handleCheckout = async () => {
    if (!name || !phone || !startDate || !endDate) {
      alert("Mohon isi semua data penyewa dan tanggal sewa!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createRental({
        customerName: name,
        customerPhone: phone,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: finalTotal,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });

      if (result.success && result.rental) {
        const token = await createPayment(result.rental.id, finalTotal);

        if (window.snap && token) {
          window.snap.pay(token, {
            onSuccess: async (res) => {
              await updateRentalToSuccess(result.rental.id);

              const orderData = {
                customerName: name,
                phone: phone,
                startDate: startDate,
                endDate: endDate,
                items: items, 
                totalDays: duration,
                finalTotal: finalTotal,
                status: "success",
                orderId: res.order_id || result.rental.id
              };

              localStorage.setItem("lastOrder", JSON.stringify(orderData));
              clearCart();
              window.location.href = "/history";
            },
            onPending: (res) => {
              const orderData = {
                customerName: name,
                phone: phone,
                startDate: startDate,
                endDate: endDate,
                items: items,
                totalDays: duration,
                finalTotal: finalTotal,
                status: "pending",
                orderId: res.order_id || result.rental.id
              };
              localStorage.setItem("lastOrder", JSON.stringify(orderData));
              clearCart();
              window.location.href = "/history";
            },
            onClose: () => {
              setIsLoading(false);
            },
            onError: (err) => {
              console.error("Midtrans Error:", err);
              alert("Pembayaran Gagal!");
              setIsLoading(false);
            }
          });
        }
      } else {
        alert("Gagal membuat rental: " + result.error);
      }
    } catch (err) {
      console.error("DETAIL ERROR:", err);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col border border-gray-100">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-black text-black tracking-tight uppercase">Keranjang</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{items.length} Barang Terpilih</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-full transition-all">
            <X size={20} className="text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium italic">Keranjang Anda masih kosong.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Daftar Barang</h3>
                {items.map((item) => (
                  <div key={item.id} className="group bg-white p-5 rounded-3xl flex justify-between items-center border border-gray-100">
                    <div className="space-y-1">
                      <h3 className="font-bold text-black text-lg">{item.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Rp {item.price.toLocaleString('id-ID')} / hari
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                        <button onClick={() => decreaseQty(item.id)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-black text-black">{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-all"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Detail Penyewa</h3>
                <div className="space-y-4">
                  <div className="relative group">
                    <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent border focus:bg-white focus:border-black rounded-2xl text-sm font-bold outline-none text-black transition-all" />
                  </div>
                  <div className="relative group">
                    <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nomor WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent border focus:bg-white focus:border-black rounded-2xl text-sm font-bold outline-none text-black transition-all" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={12} /> Tgl Ambil</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent border focus:bg-white focus:border-black rounded-2xl text-sm font-bold outline-none text-black" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={12} /> Tgl Kembali</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent border focus:bg-white focus:border-black rounded-2xl text-sm font-bold outline-none text-black" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 bg-black text-white rounded-t-[3rem]">
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Total Bayar ({duration} Hari)</p>
                <h2 className="text-3xl font-black tracking-tighter">Rp {finalTotal.toLocaleString('id-ID')}</h2>
              </div>
            </div>
            
            <button onClick={handleCheckout} disabled={isLoading} className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase text-sm tracking-[0.2em] hover:bg-gray-100 disabled:bg-gray-600 transition-all flex items-center justify-center gap-3">
              {isLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full"></div> : "Sewa Sekarang"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}