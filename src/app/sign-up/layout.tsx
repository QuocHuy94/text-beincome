import React from "react";
import Welcome from "@/components/Welcome";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Welcome>{children}</Welcome>;
}
