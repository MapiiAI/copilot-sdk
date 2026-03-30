import type { Metadata } from "next";
import "./globals.css";

import "@primer/primitives/dist/css/functional/themes/light.css";
import "@primer/primitives/dist/css/functional/themes/dark.css";
import "@primer/primitives/dist/css/functional/size/size.css";
import "@primer/primitives/dist/css/functional/typography/typography.css";
import "@primer/primitives/dist/css/base/motion/motion.css";

import { BaseStyles } from "@primer/react";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "mapii.ai — Local Map AI Platform",
  description:
    "AI-powered Local Map and Google Business intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-light-theme="light"
      data-dark-theme="dark"
      data-color-mode="auto"
    >
      <body>
        <BaseStyles>
          <AppShell>{children}</AppShell>
        </BaseStyles>
      </body>
    </html>
  );
}
