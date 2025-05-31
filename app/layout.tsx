import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProviders from "./providers/app-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PTIT- School Management System",
  description: "Next.js + Prisma + Nexus + React Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AppProviders>{children}</AppProviders>
        <ToastContainer
          position="bottom-right"
          theme="auto"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 99999 }}
          toastStyle={{
            backgroundColor: "white",
            color: "black",
            opacity: 1,
            zIndex: 99999,
          }}
        />
      </body>
    </html>
  );
}
