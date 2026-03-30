import { Button, Heading, Label, Text } from "@primer/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 var(--base-size-16)",
      }}
    >
      <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
        <Label variant="accent" style={{ marginBottom: "var(--base-size-12)" }}>
          Local Map AI Platform
        </Label>

        <Heading
          as="h1"
          variant="large"
          style={{ marginBottom: "var(--base-size-12)" }}
        >
          mapii.ai
        </Heading>

        <Text
          as="p"
          size="large"
          style={{
            color: "var(--fgColor-muted)",
            marginBottom: "var(--base-size-32)",
            lineHeight: 1.6,
          }}
        >
          AI-powered Local Map and Google Business intelligence. Discover,
          analyze, and act on local business data with the power of AI.
        </Text>

        <div
          style={{
            display: "flex",
            gap: "var(--base-size-12)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/chat" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="large">
              Try AI Chat
            </Button>
          </Link>
          <Link href="/map" style={{ textDecoration: "none" }}>
            <Button variant="default" size="large">
              Explore Local Map
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
