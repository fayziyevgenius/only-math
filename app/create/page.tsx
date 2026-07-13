import React from 'react';
import Link from 'next/link';

export default function CreateAccountPage() {
  const fields = [
    { label: "Name", type: "text", placeholder: "Enter your name" },
    { label: "Surname", type: "text", placeholder: "Enter your surname" },
    { label: "Date of birth", type: "date" },
    { label: "Email", type: "email", placeholder: "example@mail.com" },
    { label: "Username", type: "text", placeholder: "Choose a username" },
    { label: "Password", type: "password", placeholder: "••••••••" },
    { label: "Retype", type: "password", placeholder: "••••••••" },
  ];
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-6 md:p-12">
      
      <div className="relative w-full max-w-3xl border border-zinc-800 bg-black p-10 md:p-16 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,1)]">
        
        <div className="absolute top-6 left-6 flex gap-2">
          <div className="w-2 h-2 bg-zinc-700 rounded-full" />
          <div className="w-2 h-2 bg-zinc-700 rounded-full" />
          <div className="w-2 h-2 bg-zinc-700 rounded-full" />
        </div>

        <div className="flex items-center gap-6 mb-16 mt-4">
          <div className="w-32 h-20 border border-white rounded-full flex items-center justify-center p-1 mb-4 bg-zinc-900 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className="text-white text-4xl font-bold italic tracking-tight">
            Create an account
          </h2>
        </div>

        <form className="space-y-8">
          <div className="flex flex-col gap-6">
            {fields.map((field) => (
              <div key={field.label} className="grid grid-cols-[180px_1fr] items-center gap-8">
          
                <label className="text-white text-xl font-semibold tracking-wide">
                  {field.label}:
                </label>
                {field.type === "date" ? (
                  <div className="flex gap-4">
                    <input placeholder="Day" className="w-full bg-black border-2 border-zinc-700 focus:border-white rounded-xl px-4 py-3 text-lg outline-none transition-all" />
                    <input placeholder="Month" className="w-full bg-black border-2 border-zinc-700 focus:border-white rounded-xl px-4 py-3 text-lg outline-none transition-all" />
                    <input placeholder="Year" className="w-full bg-black border-2 border-zinc-700 focus:border-xl px-4 py-3 text-lg outline-none transition-all" />
                  </div>
                ) : (
                  <input 
                    type={field.type} 
                    placeholder={field.placeholder}
                    className="w-full bg-black border-2 border-zinc-700 focus:border-white rounded-xl px-5 py-3 text-white text-lg outline-none transition-all placeholder:text-zinc-600"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center pt-12 gap-6">
            <button 
              type="submit" 
              className="bg-white text-black text-lg font-black px-20 py-4 rounded-full hover:bg-zinc-200 transition-all uppercase tracking-[0.3em] shadow-white/10 shadow-xl active:scale-95"
            >
              Submit
            </button>
            
            <Link href="/" className="text-sm text-blue-500 hover:text-blue-400 hover:underline italic transition-colors">
              'Already have an account? Sign in'
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}