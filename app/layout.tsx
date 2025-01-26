import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Life World | Universe of Property ',
  description: 'Great properties for Rental, Buy and Sell',
  keywords: 'buy property, buy home, sell home, sell propert, rent home, rental property',
};

const MainLayout = ({ children }: MainLayoutProps)  => {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

type MainLayoutProps = {
  children: React.ReactNode;
}

export default MainLayout;