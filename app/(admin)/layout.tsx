"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  ArrowLeft, 
  UserCircle, 
  Bell, 
  LogOut,
  Menu, 
  X 
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Pesanan", path: "/dashboard/rentals", icon: <ShoppingBag size={18} /> },
    { name: "Produk", path: "/dashboard/products", icon: <Package size={18} /> },
  ];

  const getPageTitle = () => {
    const item = menuItems.find(m => m.path === pathname);
    return item ? item.name : "Admin Panel";
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-black overflow-hidden font-sans">
      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white m-0 lg:m-5 lg:rounded-2xl 
        shadow-xl shadow-gray-200/50 p-10 flex flex-col shrink-0
        border border-gray-100
        transition-all duration-500 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="mb-14 flex items-center justify-between">
          <div className="relative inline-block">
            <h1 className="text-xl font-black text-black tracking-[0.2em] uppercase">
              Akash Adventure
            </h1>
            <div className="absolute -bottom-1 left-0 w-8 h-[3px] bg-black"></div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-black">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 py-4 px-6 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-black text-white shadow-lg shadow-gray-300" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-10 border-t border-gray-50 space-y-6">
          <Link href="/" className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors px-6">
            <ArrowLeft size={14} />
            Storefront
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors px-6">
              <LogOut size={14} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* HEADER - ROUNDED 2XL */}
        <header className="h-20 flex items-center justify-between px-10 bg-white m-0 lg:mt-5 lg:mr-5 lg:mb-4 lg:rounded-2xl shrink-0 z-30 sticky top-0 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          
          <div className="flex items-center gap-8 text-black">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-black transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <h2 className="text-xl font-black uppercase tracking-tight text-black">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <button className="text-gray-400 hover:text-black transition-all relative p-1.5 hover:bg-gray-50 rounded-full">
              <Bell size={19} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            <div className="flex items-center gap-4 group cursor-pointer border-l border-gray-100 pl-8">
              <div className="flex flex-col items-end leading-none gap-1">
                <span className="text-[10px] font-black text-black uppercase tracking-widest">akash adventure</span>
                <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">staff only</span>
                </div>
              </div>
              
              <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:border-black shadow-inner">
                <UserCircle size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT - ROUNDED 2XL */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white lg:mr-5 lg:mb-5 lg:rounded-2xl shadow-sm border border-gray-100/50">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}