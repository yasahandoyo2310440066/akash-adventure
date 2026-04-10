import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, transaction_status, status_code, gross_amount, signature_key } = body;

    // 1. VERIFIKASI KEAMANAN (Signature Key)
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    // Midtrans gross_amount kadang ada .00, kita pastikan formatnya string yang pas
    const hash = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (hash !== signature_key) {
      console.error("❌ Signature tidak valid!");
      return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
    }

    // 2. AMBIL ID ASLI DARI DATABASE
    // Karena tadi di createPayment Mas pakai: `${orderId}-${Date.now()}`
    // Kita ambil bagian depannya saja sebelum tanda "-"
    const realRentalId = order_id.split("-")[0];

    console.log(`Memproses Webhook untuk Rental ID: ${realRentalId}`);

    // 3. UPDATE DATABASE PRISMA
    if (transaction_status === "capture" || transaction_status === "settlement") {
      await prisma.rental.update({
        where: { id: realRentalId }, // Menggunakan ID asli yang ditemukan di DB
        data: { 
          status: "SUCCESS",
          orderId: body.transaction_id // Simpan ID transaksi resmi dari Midtrans
        },
      });
      console.log(`✅ Pesanan ${realRentalId} BERHASIL diupdate ke SUCCESS.`);
    } 
    
    else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      await prisma.rental.update({
        where: { id: realRentalId },
        data: { status: "FAILED" },
      });
      console.log(`❌ Pesanan ${realRentalId} diupdate ke FAILED.`);
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Gagal memproses data" }, { status: 500 });
  }
}