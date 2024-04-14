import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <main className={"w-full mx-auto"}>{children}</main>;
}
