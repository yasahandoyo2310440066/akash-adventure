"use server";

import { Snap } from "midtrans-client";

export async function createPayment(orderId: string, amount: number) {
  // Setup konfigurasi Midtrans
  const snap = new Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
  });

  const parameter = {
    transaction_details: {
      // Menambahkan timestamp agar ID unik untuk menghindari error "Duplicate Order ID"
      order_id: `${orderId}-${Date.now()}`, 
      gross_amount: Math.round(amount),
    },
    item_details: [{
      id: orderId,
      price: Math.round(amount),
      quantity: 1,
      name: "Pembayaran Sewa Akash Adventure"
    }],
    // Opsional: Kamu bisa tambahkan callback URL di sini jika dibutuhkan nanti
    /*
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/history`,
    }
    */
  };
  
  try {
    /**
     * PERBAIKAN DI SINI:
     * Menggunakan createTransaction karena createTransactionToken 
     * terkadang tidak terdefinisi di type definition library-nya.
     */
    const transaction = await snap.createTransaction(parameter);
    
    // Kita ambil properti token saja sesuai kebutuhan frontend kamu
    return transaction.token; 
    
  } catch (error: unknown) {
    console.error("Error Midtrans:", error);
    // Memberikan pesan error yang lebih detail jika ada dari Midtrans
    const errorMessage = error instanceof Error ? error.message : "Gagal membuat token pembayaran";
    throw new Error(errorMessage);
  }
}