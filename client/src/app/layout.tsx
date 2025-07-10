import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#0a0a0a" />
            </head>
            <body className="antialiased bg-slate-900 text-white min-h-screen">
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
