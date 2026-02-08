import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "../styles/globals.css";
import "../styles/blog.css";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`font-root ${displayFont.variable} ${bodyFont.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
