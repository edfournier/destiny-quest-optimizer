import "./globals.css";

export const metadata = {
    title: 'Destiny Quest Optimizer',
    description: 'Optimize your Guardian\'s journey through Destiny 2 quests and activities',
}

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
                {children}
            </body>
        </html>
    );
}
