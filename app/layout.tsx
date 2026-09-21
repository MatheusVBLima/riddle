import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { headers } from "next/headers"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// O título default vira o da aba nas rotas sem título próprio; as fases
// sobrescrevem com o nome da fase, que é superfície de pista.
export const metadata: Metadata = {
  title: { default: "vigília", template: "%s — vigília" },
  description: "Trinta páginas. Cada uma sabe a resposta que leva à seguinte.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const htmlLanguage = requestHeaders.get("x-vigilia-record") === "26" ? "pt-BR-v" : "pt-BR"

  return (
    <html
      lang={htmlLanguage}
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
