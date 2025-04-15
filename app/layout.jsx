import "../styles/globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MessageWidget from "../components/MessageWidget";
import PaintDropsEffect from "../components/PaintDropsEffect";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "GeorgeLupoArtist",
  description:
    "George Lupo Artist showcases vibrant non-objective paintings and contemporary art inspired by the spirit of Palm Beach.",
  keywords: [
    "palm beach art",
    "galleries",
    "fine art",
    "contemporary art",
    "non-objective painting",
    "modern art",
    "George Lupo",
    "art for sale",
    "visual artist",
  ],
};

function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* 1. Mobile-Friendly Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/icons/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/icons/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">
          <Nav />
          {children}
          <Footer />
          <MessageWidget />
          {/* Paint drop effect for cursor */}
          <PaintDropsEffect />
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
