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
import RecipeModal from './components/modals/recipeModal';
import SettingsModal from './components/modals/SettingsModal';
import SearchModal from './components/modals/searchModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yemek Cüzdanı | Hesaplı Yemeğin Adresi',
  description: 'Yemek Cüzdanı, hesaplı yemeklerin adresi. Tarifleri görüntüleyebilir, fiyatlarını öğrenebilir, maliyetlerini hesaplayabilirsiniz.',
  keywords: 'tarif fiyatı, yemek maliyeti, yemek fiyatı hesaplama, tarif maliyeti öğrenme, bütçe dostu tarifler, yemek tarif fiyatları, yemek hesaplama aracı',
  authors: [{ name: 'Yemek Cüzdanı', url: 'https://yemekcuzdani.com' }],
  openGraph: {
    title: 'Yemek Cüzdanı | Hesaplı Yemeğin Adresi',
    description: 'Yemek Cüzdanı, hesaplı yemeklerin adresi. Tarifleri görüntüleyebilir, fiyatlarını öğrenebilir, maliyetlerini hesaplayabilirsiniz.',
    url: 'https://yemekcuzdani.com',
    type: 'website',
    images: [
      {
        url: './images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Yemek Cüzdanı',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yemek Cüzdanı | Hesaplı Yemeğin Adresi',
    description: 'Yemek Cüzdanı, hesaplı yemeklerin adresi. Tarifleri görüntüleyebilir, fiyatlarını öğrenebilir, maliyetlerini hesaplayabilirsiniz.',
    images: [
      {
        url: './images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Yemek Cüzdanı',
      },
    ],
  },
  alternates: {
    canonical: 'https://yemekcuzdani.com',
  },
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
    <html lang="tr">
      <body className={font.className}>
        <AuthProvider>
          <ClientOnly>
            <ToasterProvider />
            <LoginModal />
            <RegisterModal />
            <RecipeModal />
            <SearchModal />
            <SettingsModal />
            <Navbar currentUser={currentUser} />
            <CategoryList />
          </ClientOnly>
          <div className="pb-20 pt-24">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>

  )
}
