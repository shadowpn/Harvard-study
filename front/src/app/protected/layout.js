'use client';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import "@/app/globals.css";

export default function DashboardLayout({ children }) {
    return (
      <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <aside className="w-60 fixed top-0 left-0 h-screen z-50">
          <Sidebar />
        </aside>

        <main className="min-h-screen flex-1 mt-[60px] p-3 overflow-auto md:ml-60">
          {children}
        </main>
      </div>
    </div>
    );
  }