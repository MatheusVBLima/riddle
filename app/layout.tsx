import type { Metadata } from "next"
import { Geist_Mono, Instrument_Serif, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: { default: "vigília", template: "%s — vigília" },
  description: "Um arquivo dantesco em trinta fases.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn("antialiased", fontMono.variable, instrument.variable, "font-sans", inter.variable)}>
      <body>
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
