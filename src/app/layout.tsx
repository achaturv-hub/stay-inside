import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "StayInside",
  icons: "/title-icon.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <head>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0" />
      </head>
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
