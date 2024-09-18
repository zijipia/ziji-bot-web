import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ziji bot - Player panel",
  description: "A player panel for Ziji bot",
};

// Đảm bảo MyApp được xuất khẩu đúng cách
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

// Xuất khẩu MyApp như là component mặc định
export default MyApp;
