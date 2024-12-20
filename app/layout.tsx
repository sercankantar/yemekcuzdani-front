import { Nunito } from 'next/font/google'

import Navbar from '@/app/components/navbar/Navbar';
import LoginModal from '@/app/components/modals/LoginModal';

import ToasterProvider from '@/app/providers/ToasterProvider';
import { AuthProvider } from '@/app/context/AuthContext';

import './globals.css'
import ClientOnly from './components/ClientOnly';
import { getCurrentUser } from './actions/getCurrentUser';
import RegisterModal from './components/modals/RegisterModal';
import CategoryList from './components/navbar/Categories';

export const metadata = {
  title: 'Yemek',
  description: 'Yemek',
}

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = typeof window === 'undefined' 
    ? null 
    : localStorage.getItem("token");

  const currentUser = token ? await getCurrentUser(token) : null;

  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          <ClientOnly>
            <ToasterProvider />
            <LoginModal />
            <RegisterModal />
            {/* currentUser'ı Navbar'a prop olarak geçiriyoruz */}
            <Navbar currentUser={currentUser} />
            <CategoryList/>
          </ClientOnly>
          <div className="pb-20 pt-28">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
