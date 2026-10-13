import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, Yellowtail } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--f-sans",
  display: "swap",
});
const head = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--f-head",
  display: "swap",
});
const script = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Golden Beach Restaurant · POS",
  description: "Point of sale — Golden Beach Restaurant, Midigama",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4c5738",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${head.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        {/* set theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gb-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
