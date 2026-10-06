import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rooftop Cinema",
    template: "%s · Rooftop Cinema",
  },
  description: "Demo ticket desk for rooftop movies, screenings, and snacks.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <header className="top">
            <p className="brand">Rooftop Cinema</p>
            <p className="brand-note">Ticket desk</p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
