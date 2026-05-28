import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import "@/assets/styles/globals.css";

export const metadata = {
  title: 'Life World | Universe of Property ',
  description: 'Great properties for Rental, Buy and Sell',
  keywords: 'buy property, buy home, sell home, sell propert, rent home, rental property',
};

const MainLayout = ({ children }: MainLayoutProps)  => {
  return (
    <html lang='en'>
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased transition-colors duration-300">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

type MainLayoutProps = {
  children: React.ReactNode;
}

export default MainLayout;