import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import Image from "next/image"
import Header from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            {children}
            {/* Powered by footer */}
            <div className="flex justify-center py-10">
              <Image src="/powered-by-aws.png" alt="powered by aws" width={150} height={150} />
            </div>
            {/* Partnership footer */}
            {/* <div className='flex justify-center items-center w-full space-x-4 h-28'>
              <Image src="/logo/a-commerce.png" alt="acommerce-logo" width={160} height={80} />
              <p className="text-gray-400">X</p>
              <Image src="/aws-logo.svg" alt="aws-logo" width={40} height={40} />
            </div> */}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
