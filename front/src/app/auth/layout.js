
import "../globals.css";
import Logo from "@/components/Logo";

export const metadata = {
  title: 'Login | Sense StudyHub',
};

export default function AuthLayout({ children }) {
  return (
    
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center relative">
        <div className="absolute top-10">
          <Logo />
        </div>

        <main className="flex flex-col items-center justify-center flex-1 w-full">
          {children}
        </main>

        <footer className="absolute bottom-5 text-gray-400 text-sm text-center">
          © {new Date().getFullYear()} Sense StudyHub. All rights reserved.
        </footer>
      </div>

  );
}
