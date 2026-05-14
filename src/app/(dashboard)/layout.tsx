import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "../globals.css";
import ClientLayout from "../components/ClientLayout";
import Menu from "../components/Menu/Menu";
import { UserProvider } from "./UserContext";
import { SessionProvider } from "./SessionContext";
import { NotificationProvider } from "./NotificationContext";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PostVision",
  description: "Analíse postural em exercícios físicos utilizando visão computacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <SessionProvider>
        <NotificationProvider>
          <div className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable}`}>
            <ClientLayout>
              <Menu />
              {children}
            </ClientLayout>
          </div>
        </NotificationProvider>
      </SessionProvider>
    </UserProvider>
  );
}
