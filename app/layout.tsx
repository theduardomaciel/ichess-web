import type { Metadata } from "next";
import { Manrope as FontSans, Inknut_Antiqua } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";
import "@dotlottie/react-player/dist/index.css";

import { cn } from "@/lib/utils";

// Components
import Footer from "@/components/Footer/Footer";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const titleFont = Inknut_Antiqua({
	subsets: ["latin"],
	weight: ["400", "700", "900"],
	variable: "--title-font",
});

export const metadata: Metadata = {
	title: "IChess",
	description: "Um hub para os jogadores de xadrez do IC.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background-600 font-sans antialiased relative",
					fontSans.variable,
					titleFont.variable
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
