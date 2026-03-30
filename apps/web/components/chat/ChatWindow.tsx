"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatWindow() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        border: "1px solid var(--borderColor-default)",
        borderRadius: "var(--borderRadius-medium)",
        padding: "var(--base-size-12)",
        background: "var(--bgColor-default)",
      }}
    >
      <MessageList messages={messages} />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
