import { prisma } from "@/lib/prisma";
import { CheckCircle2, User, Phone, ReceiptText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRentalsPage() {
  const rentals = await prisma.rental.findMany({
    where: { status: "SUCCESS" },
    include: {
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* LIST PESANAN - CLEAN WHITE BOX */}
      <section className="space-y-4">
        <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
          
          {/* DESKTOP HEADER */}
          <div className="hidden lg:grid grid-cols-5 p-8 bg-zinc-50/50 border-b border-zinc-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Customer</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Kontak</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nominal</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Verification</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Waktu</span>
          </div>

          <div className="divide-y divide-zinc-50">
            {rentals.length === 0 ? (
               <div className="p-24 text-center flex flex-col items-center gap-4">
                  <ReceiptText size={48} className="text-zinc-100" />
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-300">Belum ada transaksi sukses</p>
               </div>
            ) : (
              rentals.map((rental) => (
                <div key={rental.id} className="grid grid-cols-1 lg:grid-cols-5 p-8 items-center bg-white">
                  
                  {/* Customer Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                      <User size={18} />
                    </div>
                    <span className="font-black text-black uppercase tracking-tight text-sm">
                      {rental.customerName}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-zinc-400 mt-4 lg:mt-0 px-2">
                    <Phone size={13} />
                    <span className="text-xs font-bold font-mono tracking-tighter">{rental.customerPhone}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 lg:mt-0">
                    <span className="text-sm font-black text-black">
                      Rp {rental.totalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Status Badge - Subtle Emerald */}
                  <div className="flex justify-center mt-4 lg:mt-0">
                    <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm shadow-emerald-100/50">
                      <CheckCircle2 size={12} strokeWidth={3} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {rental.status}
                      </span>
                    </div>
                  </div>

                  {/* Date/Time */}
                  <div className="text-right mt-4 lg:mt-0 flex flex-col items-end">
                    <p className="text-[11px] font-black text-black uppercase tracking-tighter">
                      {new Date(rental.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long' })}
                    </p>
                    <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                      {new Date(rental.createdAt).getFullYear()}
                    </p>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}