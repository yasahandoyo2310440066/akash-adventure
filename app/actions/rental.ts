"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRental(data: {
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  startDate: Date;
  endDate: Date;
  items: { productId: string; quantity: number }[];
}) {
  try {
    // 1. Validasi dasar
    if (data.startDate > data.endDate) {
      return { success: false, error: "Tanggal kembali tidak boleh sebelum tanggal ambil" };
    }

    // 2. Simpan ke database dengan status PENDING
    const rental = await prisma.rental.create({
      data: {
        orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        totalPrice: data.totalPrice,
        startDate: data.startDate,
        endDate: data.endDate,
        status: "PENDING", // Status awal adalah PENDING
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    return { success: true, rental };
  } catch (error) {
    console.error("Error creating rental:", error);
    return { success: false, error: "Gagal menyimpan pesanan ke database" };
  }
}

// Fungsi ini dipanggil setelah pembayaran di Midtrans sukses
export async function updateRentalToSuccess(rentalId: string) {
  try {
    await prisma.rental.update({
      where: { id: rentalId },
      data: { status: "SUCCESS" },
    });
    
    // Refresh halaman admin agar pesanan muncul di daftar
    revalidatePath("/admin/pesanan"); 
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Gagal update status" };
  }
}