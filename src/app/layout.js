import { Roboto, Cinzel } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PixelTracker from "@/components/PixelTracker";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "700", "900"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});
const activeSerif = cinzel;
const activeSans = roboto;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: {
    template: "%s | Anera Foods - Premium Sri Lankan Food Store",
    default:
      "Anera Foods | Premium Sri Lankan Food Products & Specialty Snacks",
  },
  description:
    "Experience the authentic taste of Sri Lanka with Anera Foods. Browse our selection of premium snacks, ready-to-eat traditional foods, and specialty spices. Fast door-to-door delivery with convenient Cash on Delivery.",
  keywords: [
    "Sri Lankan Food Products",
    "Anera Foods Sri Lanka",
    "Food delivery Sri Lanka",
    "Premium food products",
    "Online food store Sri Lanka",
    "Quality food products Sri Lanka",
    "Sri Lankan snacks online",
    "Ready to eat meals Colombo",
  ],
  authors: [{ name: "Anera Foods" }],
  robots: "index, follow",
  openGraph: {
    title: "Anera Foods | Premium Sri Lankan Food Products",
    description:
      "Premium Sri Lankan snacks, ready-to-eat foods, and traditional specialties delivered to your door.",
    url: "https://anerafoods.lk",
    siteName: "Anera Foods",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${activeSerif.variable} ${activeSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-grain">
        <AuthProvider>
          <CartProvider>
            <PixelTracker />
            <Header />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
