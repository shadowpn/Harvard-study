'use client';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import useIsMobile from '@/hooks/useIsMobile';
import "@/app/globals.css";

export default function DashboardLayout({ children }) {
  const isMobile = useIsMobile(); 

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        {/* Desktop sidebar (left) */}
        {!isMobile && (
          <aside className="w-60 fixed top-0 left-0 h-screen z-50 hidden md:block">
            <Sidebar />
          </aside>
        )}

        <main className="min-h-screen flex-1 mt-[60px] p-3 overflow-auto md:ml-60">
          {children}
        </main>
      </div>

      {/* Mobile sidebar fixed to bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50 md:hidden">
          <Sidebar />
        </div>
      )}
    </div>
  );
}
