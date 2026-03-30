import { Heading, Text } from "@primer/react";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const metadata = {
  title: "AI Chat — mapii.ai",
  description: "Chat with the mapii.ai AI assistant",
};

export default function ChatPage() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "var(--base-size-32) var(--base-size-16)",
      }}
    >
      <Heading as="h1" variant="medium" style={{ marginBottom: "var(--base-size-4)" }}>
        AI Assistant
      </Heading>
      <Text
        as="p"
        style={{
          color: "var(--fgColor-muted)",
          marginBottom: "var(--base-size-24)",
        }}
      >
        Ask anything about local businesses, maps, or SEO insights.
      </Text>
      <ChatWindow />
    </div>
  );
}
