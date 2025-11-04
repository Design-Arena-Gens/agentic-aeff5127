import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeWatcher from "@/components/theme-watcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Previsão de Chuva em Nova York",
  description: "Veja rapidamente se vai chover hoje em Nova York."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        <ThemeWatcher />
        {children}
      </body>
    </html>
  );
}
