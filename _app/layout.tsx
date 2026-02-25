import React from 'react';

export const metadata = {
  title: 'OpenCarBox',
  description: 'Premium Automotive Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/fahrzeuge">Fahrzeuge</a>
            <a href="/shop">Shop</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
