/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan semua domain HTTPS agar gambar aman
      },
    ],
  },
  // Opsional: Jika Mas Yafi sering pakai link direct download dari Drive
  // kadangkala Next.js butuh diizinkan untuk mengabaikan optimasi pada domain tertentu
  // tapi untuk awal ini saja sudah cukup.
};

module.exports = nextConfig;