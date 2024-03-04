import Navbar from '@/components/Navbar';
import '@/assets/styles/globals.css';

export const metadata = {
  title: 'Live World | Universe of Property ',
  description: 'Great properties for Rental, Buy and Sell',
  keywords: 'buy property, buy home, sell home, sell propert, rent home, rental property',
};

const MainLayout = ({ children }: MainLayoutProps)  => {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}

type MainLayoutProps = {
  children: React.ReactNode;
}

export default MainLayout;