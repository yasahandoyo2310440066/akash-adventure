"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { Printer, CheckCircle2, Clock, MapPin, ReceiptText, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

// 1. Definisikan Interface agar tidak pakai 'any'
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customerName: string;
  phone: string;
  orderId: string;
  items: OrderItem[];
  totalDays: number;
  finalTotal: number;
  status?: "pending" | "success";
}

function BillContent() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Membungkus logic penentuan status agar tidak memicu render berantai yang ilegal
  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");
    const transactionStatus = searchParams?.get("transaction_status");
    const statusCode = searchParams?.get("status_code");

    if (savedOrder) {
      try {
        const parsed: OrderData = JSON.parse(savedOrder);
        
        // Cek apakah status dari Midtrans sukses
        const isSuccessful = transactionStatus === "settlement" || statusCode === "200";

        if (isSuccessful && parsed.status !== "success") {
          const updatedOrder: OrderData = { ...parsed, status: "success" };
          localStorage.setItem("lastOrder", JSON.stringify(updatedOrder));
          setTimeout(() => {
            setOrderData(updatedOrder);
            clearCart();
          }, 0);
          localStorage.removeItem("cart-storage");
        } else {
          setTimeout(() => setOrderData(parsed), 0);
        }
      } catch (error) {
        console.error("Gagal membaca data:", error);
      }
    }
    setTimeout(() => setIsChecking(false), 0);
  }, [searchParams, clearCart]);

  // Gunakan useMemo untuk handle status berbayar
  const isPaid = useMemo(() => orderData?.status === "success", [orderData]);

  if (isChecking) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full mb-4"></div>
      <p className="font-black uppercase text-[10px] tracking-widest text-gray-400">Memproses Nota...</p>
    </div>
  );

  if (!orderData) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
      <ReceiptText size={48} className="text-gray-200 mb-4" />
      <h2 className="text-lg font-black uppercase tracking-tighter">Nota Tidak Ditemukan</h2>
      <button onClick={() => router.push('/')} className="mt-4 bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Kembali</button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity print:hidden" 
        onClick={() => router.push('/')}
      />

      <div className="relative w-full max-w-md bg-gray-50 h-full overflow-y-auto shadow-2xl print:max-w-full print:bg-white print:h-auto">
        <div className="p-6 pb-20">
          <div className="flex items-center justify-between mb-8 print:hidden">
            <button 
              onClick={() => router.push('/')} 
              className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-100 transition-all"
            >
              <X size={20} className="text-black" />
            </button>
            <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Digital Receipt</h1>
            <button 
              onClick={() => window.print()} 
              className={`p-3 bg-white rounded-2xl shadow-sm transition-all ${!isPaid ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100'}`} 
              disabled={!isPaid}
            >
              <Printer size={20} />
            </button>
          </div>

          <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-t-[2.5rem] border border-gray-100 border-b-0 relative">
            <div className={`h-2 w-full ${isPaid ? 'bg-black' : 'bg-orange-400'}`}></div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black tracking-tighter uppercase">AKASH ADVENTURE</h2>
                <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-1">Solusi Sewa Alat Outdoor</p>
              </div>

              <div className="flex justify-between items-end mb-8 border-b border-dashed border-gray-200 pb-6">
                <div>
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Penyewa</p>
                  <p className="text-sm font-black uppercase leading-none">{orderData.customerName}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">{orderData.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="text-[10px] font-black uppercase">#AKSH-{orderData.orderId?.slice(-6) || 'TRX'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Detail Item</h3>
                {orderData.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-black uppercase leading-tight">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{item.quantity} Unit x {orderData.totalDays} Hari</p>
                    </div>
                    <p className="font-black text-black">Rp {(item.price * item.quantity * (orderData.totalDays || 1)).toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-gray-100 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Tagihan</span>
                  <span className="text-2xl font-black text-black tracking-tighter">Rp {orderData.finalTotal?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-50 text-center">
                <div className="flex justify-center mb-4">
                  {isPaid ? (
                    <div className="bg-green-50 p-4 rounded-full"><CheckCircle2 size={32} className="text-green-500" /></div>
                  ) : (
                    <div className="bg-orange-50 p-4 rounded-full"><Clock size={32} className="text-orange-500" /></div>
                  )}
                </div>
                <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                  {isPaid ? "LUNAS / PAID" : "PENDING PAYMENT"}
                </p>
                <p className="text-[9px] text-gray-400 font-bold italic px-4 leading-relaxed">
                  {isPaid 
                    ? "Tunjukkan bill ini saat pengambilan barang di basecamp." 
                    : "Selesaikan pembayaran untuk memvalidasi pesanan Anda."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between px-1 h-4 overflow-hidden mb-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-white rounded-full -mt-3 shadow-inner border border-gray-50"></div>
            ))}
          </div>

          <div className="text-center space-y-6 print:hidden">
            {!isPaid && (
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-black text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 hover:bg-gray-900 transition-all"
              >
                Cek Status Pembayaran
              </button>
            )}
            
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Akash Basecamp - Blitar</span>
              </div>
              <p className="text-[8px] font-bold text-gray-400">© 2026 Akash Adventure Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black uppercase tracking-widest text-xs">Loading Nota...</div>}>
      <BillContent />
    </Suspense>
  );
}