"use client";

import { Avatar, Text } from "@primer/react";
import type { UIMessage } from "@ai-sdk/react";

interface MessageListProps {
  messages: UIMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fgColor-muted)",
        }}
      >
        <Text size="small">
          Start a conversation with the mapii.ai assistant.
        </Text>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--base-size-12)",
      }}
    >
      {messages.map((message) => {
        const isUser = message.role === "user";
        const text = message.parts
          .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
          .map((p) => p.text)
          .join("");

        return (
          <div
            key={message.id}
            style={{
              display: "flex",
              gap: "var(--base-size-8)",
              flexDirection: isUser ? "row-reverse" : "row",
            }}
          >
            <Avatar
              src={
                isUser
                  ? "https://avatars.githubusercontent.com/u/0?v=4"
                  : "https://github.com/MapiiAI.png"
              }
              alt={isUser ? "You" : "mapii.ai"}
              size={32}
            />
            <div
              style={{
                maxWidth: "75%",
                padding: "var(--base-size-8) var(--base-size-12)",
                borderRadius: "var(--borderRadius-medium)",
                background: isUser
                  ? "var(--bgColor-accent-emphasis)"
                  : "var(--bgColor-muted)",
                color: isUser
                  ? "var(--fgColor-onEmphasis)"
                  : "var(--fgColor-default)",
                fontSize: "var(--text-body-size-medium)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
