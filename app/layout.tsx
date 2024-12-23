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
import Head from 'next/head';

export const metadata = {
  title: 'Yemek Cüzdanı',
  description: 'Yemek Cüzdanı ile artık tariflerin fiyatlarını öğrenebilirsiniz.',
  icons: { icon: '/favicon.ico' }
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
      <Head>
        <link rel="icon" type="image/x-icon" href="./favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Yemek tariflerinizin maliyetlerini kolayca öğrenin. Yemek Cüzdanı ile yemek fiyatlarını hesaplayabilir, bütçe dostu tarifler oluşturabilirsiniz." />
        <meta name="keywords" content="tarif fiyatı, yemek maliyeti, yemek fiyatı hesaplama, tarif maliyeti öğrenme, bütçe dostu tarifler, yemek tarif fiyatları, yemek hesaplama aracı" />
        <meta name="author" content="Yemek Cüzdanı" />
        <title>Yemek Cüzdanı | Hesaplı Yemeğin Adresi</title>
      </Head>
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
