'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'
import { Box, Text, Heading, TextInput, Button, Spinner, Avatar } from '@primer/react'
import { PaperAirplaneIcon } from '@primer/octicons-react'

const USER_AVATAR_URL = 'https://avatars.githubusercontent.com/u/9919'
const AI_AVATAR_URL = 'https://github.com/github.png'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  })

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: 'auto',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 4,
      }}
    >
      <Heading as="h2" sx={{ fontSize: 3, mb: 3, color: 'fg.default' }}>
        Chat
      </Heading>

      {/* Message list */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mb: 3,
          pr: 1,
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text sx={{ color: 'fg.subtle', fontSize: 1 }}>
              Start a conversation…
            </Text>
          </Box>
        )}

        {messages.map((message) => {
          const isUser = message.role === 'user'
          return (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              <Avatar
                src={isUser ? USER_AVATAR_URL : AI_AVATAR_URL}
                alt={isUser ? 'You' : 'AI'}
                size={32}
              />
              <Box
                sx={{
                  maxWidth: '80%',
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                  bg: isUser ? 'accent.emphasis' : 'canvas.subtle',
                  color: isUser ? 'fg.onEmphasis' : 'fg.default',
                  border: '1px solid',
                  borderColor: isUser ? 'accent.emphasis' : 'border.default',
                  fontSize: 1,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {message.content}
              </Box>
            </Box>
          )
        })}

        {isLoading && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pl: 2 }}>
            <Spinner size="small" />
            <Text sx={{ fontSize: 1, color: 'fg.muted' }}>Thinking…</Text>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              p: 3,
              bg: 'danger.subtle',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'danger.muted',
            }}
          >
            <Text sx={{ fontSize: 1, color: 'danger.fg' }}>
              {error.message ?? 'Something went wrong. Please try again.'}
            </Text>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input form */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'border.default',
        }}
      >
        <TextInput
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything…"
          disabled={isLoading}
          sx={{ flex: 1 }}
          aria-label="Chat input"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !input.trim()}
          leadingVisual={PaperAirplaneIcon}
          aria-label="Send message"
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}
