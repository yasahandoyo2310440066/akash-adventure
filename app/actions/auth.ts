"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Fungsi untuk Login Admin
 */
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({ where: { email } });

  // Validasi user dan password
  if (!user || !(await compare(password, user.password))) {
    throw new Error("Email atau password salah.");
  }

  // Set cookie session
  const cookieStore = await cookies();
  cookieStore.set("admin_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // Aktif selama 24 Jam
    path: "/",
  });

  // Lempar ke halaman dashboard setelah sukses
  redirect("/dashboard");
}

/**
 * Fungsi untuk Logout Admin
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  
  // Menghapus cookie yang menyimpan sesi admin
  cookieStore.delete("admin_session");

  // Lempar kembali ke halaman login setelah logout
  redirect("/login");
}