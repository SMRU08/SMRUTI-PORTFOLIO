import type { Metadata } from "next";
import { inter, spaceGrotesk } from "./fonts";
import { personalInfo } from "@/lib/constants";
import Providers from "./providers";
import "./globals.css";

const SITE_URL = "https://smrutiranjan-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${personalInfo.name} | ${personalInfo.brand} — ${personalInfo.experienceTitle}`,
    template: `%s | ${personalInfo.name}`,
  },
  description: `${personalInfo.tagline} — ${personalInfo.subtitle}`,
  keywords: [
    "Smruti Ranjan Nayak",
    "DEV SHOWCASE",
    "THE IMPOSSIBLE PORTFOLIO",
    "portfolio",
    "AI/ML",
    "Machine Learning",
    "Computer Vision",
    "OpenCV",
    "TensorFlow",
    "Keras",
    "React",
    "Next.js",
    "Three.js",
    "Python",
    "developer",
  ],
  authors: [{ name: personalInfo.name, url: SITE_URL }],
  creator: personalInfo.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${personalInfo.name} | ${personalInfo.brand} — ${personalInfo.experienceTitle}`,
    description: `${personalInfo.tagline} — ${personalInfo.subtitle}`,
    type: "website",
    locale: "en_US",
    siteName: `${personalInfo.name} — ${personalInfo.brand}`,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalInfo.name} | ${personalInfo.brand} — ${personalInfo.experienceTitle}`,
    description: `${personalInfo.tagline} — ${personalInfo.subtitle}`,
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    google: "notranslate",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: personalInfo.name,
      url: SITE_URL,
      jobTitle: personalInfo.title,
      email: personalInfo.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: personalInfo.location,
      },
      sameAs: personalInfo.socials
        .filter((s) => !s.url.startsWith("mailto:"))
        .map((s) => s.url),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${personalInfo.name} — ${personalInfo.brand}`,
      description: personalInfo.subtitle,
      author: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="theme-color" content="#8154ff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
