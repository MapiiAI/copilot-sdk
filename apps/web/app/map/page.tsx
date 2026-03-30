import { Heading, Label, Text } from "@primer/react";

export const metadata = {
  title: "Local Map — mapii.ai",
  description: "AI-powered local map and Google Business intelligence",
};

export default function MapPage() {
  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "var(--base-size-32) var(--base-size-16)",
      }}
    >
      <div style={{ marginBottom: "var(--base-size-24)" }}>
        <Label
          variant="accent"
          style={{ marginBottom: "var(--base-size-8)", display: "inline-flex" }}
        >
          Coming soon
        </Label>
        <Heading
          as="h1"
          variant="large"
          style={{ marginBottom: "var(--base-size-8)" }}
        >
          Local Map Intelligence
        </Heading>
        <Text
          as="p"
          style={{ color: "var(--fgColor-muted)" }}
        >
          AI-powered insights for local businesses — powered by Google Business
          data and DataForSEO. Analyze competitors, track rankings, and
          optimise your local presence.
        </Text>
      </div>

      <div
        style={{
          border: "1px solid var(--borderColor-default)",
          borderRadius: "var(--borderRadius-medium)",
          padding: "var(--base-size-40)",
          textAlign: "center",
          background: "var(--bgColor-muted)",
        }}
      >
        <Text style={{ color: "var(--fgColor-muted)" }}>
          Map interface will be rendered here. Connect your DataForSEO
          credentials via environment variables to enable live data.
        </Text>
      </div>
    </div>
  );
}
