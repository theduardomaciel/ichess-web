/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
	darkMode: ["class"],
	content: [
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
				title: ["var(--title-font)", ...fontFamily.serif],
			},
			colors: {
				neutral: "hsl(var(--neutral))",
				border: "hsl(var(--gray-200))",
				input: "hsl(var(--gray-200))",
				ring: "hsl(var(--primary-200))",
				background: {
					DEFAULT: "hsl(var(--gray-300))",
				},
				gray: {
					100: "hsl(var(--gray-100))",
					200: "hsl(var(--gray-200))",
					300: "hsl(var(--gray-300))",
					400: "hsl(var(--gray-400))",
					500: "hsl(var(--gray-500))",
					600: "hsl(var(--gray-600))",
				},
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary-100))",
					foreground: "hsl(0 0% 100%)",
					100: "hsl(var(--primary-100))",
					200: "hsl(var(--primary-200))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(0 0% 100%)",
					100: "hsl(var(--secondary-100))",
					200: "hsl(var(--secondary-200))",
				},
				tertiary: {
					100: "hsl(var(--tertiary-100))",
					200: "hsl(var(--tertiary-200))",
				},
				info: {
					100: "hsl(var(--info-100))",
					200: "hsl(var(--info-200))",
				},
				destructive: {
					DEFAULT: "hsl(var(--tertiary-200))",
					foreground: "hsl(0 0% 100%)",
				},
				muted: {
					DEFAULT: "hsl(var(--foreground))",
					foreground: "hsl(var(--neutral) / 0.65)",
				},
				accent: {
					DEFAULT: "hsl(var(--primary-100))",
					foreground: "hsl(var(--neutral))",
				},
				popover: {
					DEFAULT: "hsl(var(--gray-300))",
					foreground: "hsl(var(--neutral))",
				},
				card: {
					DEFAULT: "hsl(var(--gray-400))",
					foreground: "hsl(0 0% 100%)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			padding: {
				wrapper: "var(--wrapper)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"one-spin": {
					from: { transform: "rotate(0deg)" },
					to: { transform: "rotate(360deg)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"one-spin": "one-spin 1s bounce",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@designbycode/tailwindcss-text-stroke"),
	],
};

export default config;
