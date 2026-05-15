import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Servicios Web, 3D y Experiencias Interactivas",
  description:
    "Desarrollo de landing pages, e-commerce, modelado 3D y experiencias con Unity y Unreal Engine.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
