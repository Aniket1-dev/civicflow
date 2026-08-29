import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/client/theme";
import { AccessibilityProvider } from "@/lib/client/accessibility";
import { SessionProvider } from "@/lib/client/session";
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityBar } from "@/components/AccessibilityBar";

export const metadata: Metadata = {
  title: "CivicFlow — Better cities, one problem at a time.",
  description: "Report civic issues, track their progress, and make sure the right people are working to solve them.",
};

export const viewport: Viewport = {
  // Fallback based on OS preference for the very first paint; the ThemeProvider
  // keeps this meta tag in sync with the user's actual toggle choice afterwards,
  // so the browser's own address bar / status bar always matches the app.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090b12" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          // Runs before paint so the correct theme is applied immediately —
          // avoids a flash of the wrong theme on load and respects OS preference
          // the first time a visitor arrives with no saved choice. Also restores
          // any saved text-size / high-contrast accessibility preference.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('civicflow-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);var scaleSteps=[1,1.125,1.25];var s=Number(localStorage.getItem('civicflow-text-scale')||'0');document.documentElement.style.setProperty('--font-scale',String(scaleSteps[s]||1));var c=localStorage.getItem('civicflow-contrast')==='high';document.documentElement.setAttribute('data-contrast',c?'high':'normal');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AccessibilityProvider>
            <SessionProvider>
              <AccessibilityBar />
              {children}
              <Toaster />
            </SessionProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
