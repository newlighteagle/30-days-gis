import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "30 Days Map Challenge",
  description: "A 30-day mapping challenge with MapLibreGL and PostGIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Tambahkan class "dark" agar default-nya dark mode */}
      <body className={`dark ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // ✅ set default ke dark
          enableSystem={false} // ✅ nonaktifkan mode system biar fix dark
        >
          <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
