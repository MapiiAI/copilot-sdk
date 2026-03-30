"use client";

import { Button, Textarea } from "@primer/react";
import type { FormEvent } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        gap: "var(--base-size-8)",
        alignItems: "flex-end",
        paddingTop: "var(--base-size-12)",
        borderTop: "1px solid var(--borderColor-default)",
      }}
    >
      <Textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Ask about local businesses, rankings, or SEO…"
        disabled={isLoading}
        rows={2}
        style={{ flex: 1, resize: "none" }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
              e.currentTarget.form?.requestSubmit();
            }
          }
        }}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
