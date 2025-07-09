import './globals.css';
import { Geist_Mono } from 'next/font/google';

export const metadata = {
  title: 'Sense StudyHub',
  description: 'Online Learning Platform',
  icons: { icon: '/favicon.ico' }
};

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} bg-gray-100`}>
        {children}
      </body>
    </html>
  );
}
