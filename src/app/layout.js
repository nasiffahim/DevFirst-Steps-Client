import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../Components/layout/Navbar";
import AuthProvider from "./providers/AuthProvider.jsx"
import Footer from "../Components/layout/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevFirst Steps",
  description: "Open Source Porjects Finder for Beginners",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<AuthProvider>
          <Navbar />
          {children}
          <Footer />
   </AuthProvider>
    

      </body>
    </html>
  );
}
