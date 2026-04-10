"use client";

import { useActionState } from "react";
import { loginAction } from "../../actions/auth";

export default function LoginPage() {
  // 1. Definisikan tipe data state (string untuk error, atau null jika awal/berhasil)
  // 2. Ganti 'any' pada parameter pertama menjadi 'string | null' atau 'unknown'
  const [error, action, isPending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      try {
        await loginAction(formData);
        return null; // Jika berhasil, tidak ada error
      } catch (e: unknown) {
        // 3. Handle error dengan tipe 'unknown' agar standar Next.js 15
        if (e instanceof Error) {
          return e.message;
        }
        return "An unexpected error occurred";
      }
    }, 
    null
  );

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Background Image dengan Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop')", 
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Form Card */}
      <form 
        action={action} 
        className="relative z-10 w-full max-w-md p-10 bg-white shadow-2xl rounded-3xl flex flex-col items-center"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tighter text-black uppercase">
            Akash Adventure
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Halaman Login Untuk Admin</p>
        </div>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <div className="w-full space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1 mb-1 block">
              Email Address
            </label>
            <input 
              name="email" 
              type="email" 
              placeholder="admin@akash.com" 
              className="w-full p-4 bg-zinc-50 border border-zinc-200 text-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200 placeholder:text-zinc-300" 
              required 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1 mb-1 block">
              Security Password
            </label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-zinc-50 border border-zinc-200 text-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200 placeholder:text-zinc-300" 
              required 
            />
          </div>
        </div>

        <button 
          disabled={isPending} 
          type="submit" 
          className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200 disabled:bg-zinc-400 disabled:cursor-not-allowed shadow-lg shadow-black/20"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating...
            </span>
          ) : "Access Dashboard"}
        </button>

        <p className="mt-8 text-zinc-400 text-[10px] uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Akash Adventure Team
        </p>
      </form>
    </div>
  );
}