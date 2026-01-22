import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI Insight Calendar',
    template: '%s | AI Insight Calendar',
  },
  description: '매일 하나의 AI 큐레이션 마케팅 인사이트로 트렌드 소비를 사고 습관으로 전환하세요.',
  keywords: ['마케팅', '인사이트', 'AI', '트렌드', '캘린더', '마케터'],
  authors: [{ name: 'AI Insight Calendar' }],
  creator: 'AI Insight Calendar',
  publisher: 'AI Insight Calendar',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'AI Insight Calendar',
    title: 'AI Insight Calendar - 매일 하나의 마케팅 인사이트',
    description: '매일 하나의 AI 큐레이션 마케팅 인사이트로 트렌드 소비를 사고 습관으로 전환하세요.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Insight Calendar',
    description: '매일 하나의 AI 큐레이션 마케팅 인사이트',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Insight',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-bg text-label antialiased">
        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
