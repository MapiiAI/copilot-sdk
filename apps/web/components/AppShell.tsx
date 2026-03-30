import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}
