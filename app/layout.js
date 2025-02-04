import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Discord Music Bot Controller",
	description: "Control your Discord music bot with ease",
};

export default function RootLayout({ children }) {
	return (
		<html
			lang='en'
			suppressHydrationWarning>
			<body className={inter.className}>
				{/* <AuthProvider> */}
				{/* <ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange> */}
				{children}
				{/* <Toaster />
				</ThemeProvider> */}
				{/* </AuthProvider> */}
			</body>
		</html>
	);
}
