'use client';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import "@/app/globals.css";

export default function DashboardLayout({ children }) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-row flex-1">
          <aside className="w-64">
            <Sidebar />
          </aside>
          <main className="flex-1 p-4">{children}</main>          
        </div>
      </div>
    );
  }