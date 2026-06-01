import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/assets/styles/globals.css";

export const metadata = {
  title: 'Life World | Universe of Property ',
  description: 'Great properties for Rental, Buy and Sell',
  keywords: 'buy property, buy home, sell home, sell propert, rent home, rental property',
};

type MainLayoutProps = {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default MainLayout;
