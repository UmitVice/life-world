import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/assets/styles/globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Life World | Find a place that feels right', template: '%s | Life World' },
  description: 'A thoughtfully engineered real estate marketplace for discovering and comparing exceptional homes.',
  keywords: ['real estate marketplace', 'property search', 'homes for rent', 'property listings'],
  openGraph: { title: 'Life World', description: 'A better way to find your next place.', type: 'website', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Life World real estate marketplace' }] },
  twitter: { card: 'summary_large_image', title: 'Life World', description: 'A better way to find your next place.', images: ['/og.png'] },
};

const MainLayout = ({ children }: MainLayoutProps)  => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <div>{children}</div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

type MainLayoutProps = {
  children: React.ReactNode;
}

export default MainLayout;
