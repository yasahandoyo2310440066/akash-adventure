"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. CREATE: Menambah produk baru
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const image = formData.get("image") as string;
  const description = formData.get("description") as string;

  await prisma.product.create({
    data: { 
      name, 
      description, 
      pricePerDay: price, 
      stock, 
      category: "Outdoor", 
      image,
      isDeleted: false 
    },
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

// 2. UPDATE: Menggunakan Parameter ID (Sinkron dengan .bind di Page)
export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string) || 0;
    const stock = parseInt(formData.get("stock") as string) || 0;
    const image = formData.get("image") as string;

    await prisma.product.update({
      where: { id: id }, // ID didapat dari parameter pertama
      data: { 
        name, 
        description, 
        pricePerDay: price, 
        stock, 
        image 
      },
    });
  } catch (error) {
    console.error("Update Error:", error);
    return { message: "Gagal memperbarui produk" };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

// 3. DELETE (Cerdas)
export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;

  const hasTransactions = await prisma.rentalItem.findFirst({
    where: { productId: id }
  });

  if (hasTransactions) {
    await prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    });
  } else {
    await prisma.product.delete({
      where: { id }
    });
  }

  revalidatePath("/dashboard/products");
}