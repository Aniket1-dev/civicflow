import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'CivicFlow — Better cities, one problem at a time.',description:'Report, track and verify civic problems.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
