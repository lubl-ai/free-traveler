import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://freetraveler.kr"),
  title: "free_traveler — 여행 준비 플랫폼",
  description: "세계 57개 여행, 31개국 경험을 바탕으로 여행지 정보와 안전정보, 동행 매칭을 제공하는 여행 준비 플랫폼",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NZCGMJN5VX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NZCGMJN5VX');
          `}
        </Script>
      </body>
    </html>
  );
}
