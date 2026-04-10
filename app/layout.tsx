import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css"; // Pastikan file globals.css ada di folder app/

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Akash Adventure | Sewa Alat Camp & Outdoor",
  description: "Penyedia layanan sewa alat outdoor terbaik di Blitar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${montserrat.variable} antialiased font-sans`}>
        {/* Navbar TIDAK ADA di sini agar tidak dobel di Admin Dashboard */}
        {children}
      </body>
    </html>
  );
}