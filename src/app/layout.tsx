import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Bác sĩ Nông nghiệp',
  description: 'Chẩn đoán bệnh cây trồng và đề xuất phương pháp điều trị bằng AI.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AgriDoctor',
  },
};

export const viewport: Viewport = {
  themeColor: '#4A6B4C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ScrollToTopButton />
        <Toaster />
      </body>
    </html>
  );
}
