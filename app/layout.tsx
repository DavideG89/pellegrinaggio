import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sulle orme di Carmen",
  description:
    "Previsioni Meteo Pellegrinaggio sulle orme di Carmen - 8-13 Maggio 2025 - Parrocchia Sacra Famiglia Palermo",
  icons: {
    icon: [
      {
        url: "/icon.png",
        href: "/icon.png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
      },
    ],
  },
  openGraph: {
    title: "Sulle orme di Carmen",
    description:
      "Previsioni Meteo Pellegrinaggio sulle orme di Carmen - 8-13 Maggio 2025 - Parrocchia Sacra Famiglia Palermo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Carmen - Pellegrinaggio 2025",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sulle orme di Carmen",
    description:
      "Previsioni Meteo Pellegrinaggio sulle orme di Carmen - 8-13 Maggio 2025 - Parrocchia Sacra Famiglia Palermo",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
        <meta name="theme-color" content="#1784c7" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
