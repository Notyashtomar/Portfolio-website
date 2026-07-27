import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { profile } from "@/data/resume";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.title}`,
  description: profile.summary,
  keywords: [
    "Data Analyst",
    "MIS Analyst",
    "Business Analyst",
    "Financial Analyst",
    "Power BI",
    "SQL",
    "Excel",
    profile.name,
  ],
  openGraph: {
    title: `${profile.name} · ${profile.title}`,
    description: profile.summary,
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&f[]=cabinet-grotesk@400,500,700,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#030303] text-white antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
