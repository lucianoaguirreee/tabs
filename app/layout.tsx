import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "4-Zone Tab Manager",
  description: "Drag and drop tabs between 4 fixed zones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
