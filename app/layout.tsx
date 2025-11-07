import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Noto_Sans_JP } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSans = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "OfferRoom | 逆リクエスト型賃貸リードマッチング",
  description:
    "賃貸希望者と不動産会社をつなぐリードマッチングSaaS。希望条件を送るだけで対応可能な不動産会社に届きます。"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="bg-beige-100">
      <body className={cn("min-h-screen bg-beige-100", inter.variable, notoSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
