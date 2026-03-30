# Best Practices for the Copilot SDK

Practical guidance for building reliable, efficient, and maintainable applications with the Copilot SDK.

## Table of Contents

- [Write effective prompts](#write-effective-prompts)
- [Design tools well](#design-tools-well)
- [Manage sessions thoughtfully](#manage-sessions-thoughtfully)
- [Use streaming for responsive UIs](#use-streaming-for-responsive-uis)
- [Handle errors gracefully](#handle-errors-gracefully)
- [Secure your integration](#secure-your-integration)
- [Validate agent output](#validate-agent-output)
- [Use infinite sessions for long-running work](#use-infinite-sessions-for-long-running-work)

---

## Write effective prompts

Prompt design directly affects response quality. Small changes to how you phrase tasks can dramatically change outcomes.

### Break complex tasks into smaller steps

Rather than sending one large, multi-part instruction, decompose tasks and send them sequentially. This gives the agent a clear goal per turn and makes it easier to review or steer each step.

```typescript
// ❌ Too broad — harder for the agent to reason about
await session.sendAndWait({ prompt: "Refactor the codebase, add tests, update the docs, and fix any lint errors." });

// ✅ One clear goal per turn
await session.sendAndWait({ prompt: "Refactor the auth module to use the new UserToken type." });
await session.sendAndWait({ prompt: "Add unit tests for the updated auth module." });
await session.sendAndWait({ prompt: "Update the auth section of the README to match the new API." });
```

### Be specific about requirements and constraints

Include relevant constraints — language, library versions, coding conventions, or acceptance criteria — in the prompt. Vague prompts lead to generic responses.

```typescript
// ❌ Underspecified
await session.sendAndWait({ prompt: "Write a function to parse the config file." });

// ✅ Specific requirements
await session.sendAndWait({
  prompt: `Write a TypeScript function that parses a YAML config file.
Requirements:
- Use the 'js-yaml' library (already installed)
- Return a typed Config object (see src/types.ts)
- Throw a ConfigError with a descriptive message if required fields are missing
- Add JSDoc comments`,
});
```

### Provide context with a system message

Use the `systemMessage` option to describe the agent's role, the codebase conventions, or the constraints that apply to every turn in the session.

<details open>
<summary><strong>Node.js / TypeScript</strong></summary>

```typescript
import { CopilotClient } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  systemMessage: `You are a senior TypeScript engineer working in this repository.
- Always use strict TypeScript with explicit return types
- Follow the existing error-handling pattern (throw domain-specific Error subclasses)
- Write tests using Vitest
- Keep functions small and single-purpose`,
});
```

</details>

<details>
<summary><strong>Python</strong></summary>

```python
from copilot import CopilotClient

client = CopilotClient()
await client.start()

session = await client.create_session({
    "system_message": """You are a senior Python engineer working in this repository.
- Use type hints on all functions
- Follow PEP 8 and the existing style in this codebase
- Write tests with pytest
- Prefer dataclasses over plain dicts for structured data""",
})
```

</details>

<details>
<summary><strong>Go</strong></summary>

<!-- docs-validate: hidden -->
```go
package main

import (
	"context"
	copilot "github.com/github/copilot-sdk/go"
)

func main() {
	ctx := context.Background()
	client := copilot.NewClient(nil)
	defer client.Stop()

	session, _ := client.CreateSession(ctx, &copilot.SessionConfig{
		SystemMessage: `You are a senior Go engineer working in this repository.
- Always handle errors explicitly; never discard them with _
- Follow the standard Go project layout
- Use table-driven tests with the testing package
- Keep interfaces small`,
	})
	_ = session
}
```
<!-- /docs-validate: hidden -->

</details>

<details>
<summary><strong>.NET</strong></summary>

```csharp
using GitHub.Copilot.SDK;

var client = new CopilotClient();
var session = await client.CreateSessionAsync(new SessionConfig
{
    SystemMessage = """
        You are a senior C# engineer working in this repository.
        - Use nullable reference types and modern C# features
        - Follow the existing naming conventions (PascalCase for public members)
        - Write tests with xUnit
        - Prefer records for immutable data
        """
});
```

</details>

---

## Design tools well

Tools give the agent the ability to call your code. Well-designed tools lead to better, more reliable agent behavior.

### Name tools and parameters clearly

The agent uses tool names and parameter descriptions to decide when and how to invoke them. Treat the tool schema like a user-facing API — clear names and descriptions matter.

<details open>
<summary><strong>Node.js / TypeScript</strong></summary>

```typescript
import { CopilotClient } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  tools: [
    {
      // ✅ Descriptive name and parameter descriptions
      name: "get_file_contents",
      description: "Read the text contents of a file in the project repository. Returns the full file content as a string.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "Relative path to the file from the repository root (e.g. 'src/auth/token.ts')",
          },
        },
        required: ["path"],
      },
      execute: async ({ path }: { path: string }) => {
        // implementation
        return `contents of ${path}`;
      },
    },
  ],
});
```

</details>

### Keep tools focused and composable

Each tool should do one thing. Prefer several narrow tools over one multi-purpose tool — the agent can combine them as needed.

```typescript
// ❌ One tool that does too much
{
  name: "manage_file",
  description: "Read, write, or delete a file",
  parameters: { action: "read|write|delete", path: string, content?: string }
}

// ✅ Separate focused tools
{ name: "read_file",   description: "Read a file's contents", ... }
{ name: "write_file",  description: "Write content to a file", ... }
{ name: "delete_file", description: "Delete a file", ... }
```

### Validate and sanitize tool inputs

Always validate the parameters your tool receives before using them, especially for anything that touches the filesystem, network, or external APIs.

```typescript
execute: async ({ path }: { path: string }) => {
  // Validate that the path stays within the project root
  const resolved = require("path").resolve(projectRoot, path);
  if (!resolved.startsWith(projectRoot)) {
    throw new Error(`Access denied: path "${path}" is outside the project root`);
  }
  return require("fs").readFileSync(resolved, "utf8");
},
```

### Use `onPreToolUse` to gate sensitive tools

For tools that perform destructive or irreversible actions, use the `onPreToolUse` hook to add a confirmation step or enforce policy.

```typescript
const session = await client.createSession({
  hooks: {
    onPreToolUse: async (input) => {
      if (input.tool.name === "delete_file") {
        const approved = await askUserForConfirmation(`Delete ${input.tool.parameters.path}?`);
        if (!approved) {
          return { kind: "denied", reason: "User declined the deletion." };
        }
      }
      return null; // proceed with default behavior
    },
  },
});
```

See [Hooks](./features/hooks.md) and [Pre-Tool Use](./hooks/pre-tool-use.md) for the full API.

---

## Manage sessions thoughtfully

Sessions hold conversation history, tool state, and workspace context. Good session hygiene improves reliability and reduces costs.

### Use meaningful session IDs for resumable sessions

If your application needs to resume sessions (e.g., after a crash, across requests, or for long-lived workflows), always provide a predictable `sessionId`. Without one, the SDK generates a random ID that you cannot recover later.

```typescript
// ✅ Derive the session ID from something meaningful in your domain
const sessionId = `user-${userId}-task-${taskId}`;
const session = await client.createSession({ sessionId });
```

See [Session Persistence](./features/session-persistence.md) for full details.

### Clear conversation history when context becomes stale

Long conversations accumulate context that can confuse the agent. If a prior topic is no longer relevant, start a new session rather than letting irrelevant context build up.

```typescript
// ✅ New session for an unrelated task — clean slate, no stale context
const session = await client.createSession({
  sessionId: `user-${userId}-review-pr-${prNumber}`,
});
```

### Limit tool access to what each session needs

Use `availableTools` or `excludedTools` to restrict the agent's tool access to only what is needed for a given task. This reduces the chance of unintended side effects.

<details open>
<summary><strong>Node.js / TypeScript</strong></summary>

```typescript
const session = await client.createSession({
  // Only expose read-only tools for this review session
  availableTools: ["read_file", "list_directory", "search_code"],
});
```

</details>

<details>
<summary><strong>Python</strong></summary>

```python
session = await client.create_session({
    "available_tools": ["read_file", "list_directory", "search_code"],
})
```

</details>

---

## Use streaming for responsive UIs

Enable streaming to deliver partial responses to users as they arrive, instead of making them wait for the full response.

### Enable streaming for interactive applications

<details open>
<summary><strong>Node.js / TypeScript</strong></summary>

```typescript
import { CopilotClient } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({ streaming: true });

for await (const event of session.send({ prompt: "Explain how JWT works" })) {
  if (event.type === "assistant.message_delta") {
    process.stdout.write(event.data.text); // stream text as it arrives
  }
}
```

</details>

<details>
<summary><strong>Python</strong></summary>

```python
from copilot import CopilotClient

client = CopilotClient()
await client.start()

session = await client.create_session({"streaming": True})

async for event in session.send({"prompt": "Explain how JWT works"}):
    if event["type"] == "assistant.message_delta":
        print(event["data"]["text"], end="", flush=True)
```

</details>

### Accumulate deltas before storing

Delta events (`assistant.message_delta`, `assistant.reasoning_delta`) are ephemeral — they are not persisted and will not be replayed on session resume. Accumulate them yourself if you need the complete content.

```typescript
let fullText = "";
for await (const event of session.send({ prompt: "..." })) {
  if (event.type === "assistant.message_delta") {
    fullText += event.data.text;             // accumulate
    process.stdout.write(event.data.text);   // stream to user
  } else if (event.type === "assistant.message") {
    // event.data.text is the complete final message — use this for storage
    await saveToDatabase(event.data.text);
  }
}
```

See [Streaming Events](./features/streaming-events.md) for the full event reference.

---

## Handle errors gracefully

### Register an error hook for centralized logging

Use `onErrorOccurred` to catch, log, and respond to errors across your session without scattering try/catch blocks throughout your application code.

<details open>
<summary><strong>Node.js / TypeScript</strong></summary>

```typescript
const session = await client.createSession({
  hooks: {
    onErrorOccurred: async (input) => {
      console.error(`[Session ${session.sessionId}] Error: ${input.error.message}`, {
        errorType: input.error.errorType,
        statusCode: input.error.statusCode,
      });
      return null; // let the SDK handle the default recovery
    },
  },
});
```

</details>

See [Error Handling](./hooks/error-handling.md) for the full hook API.

### Distinguish transient from fatal errors

`session.error` events include an `errorType` field that tells you the category of failure. Use it to decide whether to retry, show a user-facing message, or abort.

```typescript
for await (const event of session.send({ prompt: "..." })) {
  if (event.type === "session.error") {
    switch (event.data.errorType) {
      case "rate_limit":
        // Wait and retry
        await sleep(5000);
        break;
      case "authentication":
        // Non-recoverable without user action
        throw new Error("Authentication failed — please re-authenticate.");
      default:
        console.error("Unexpected error:", event.data.message);
    }
  }
}
```

---

## Secure your integration

### Never expose raw tool results that contain secrets

Use `onPostToolUse` to redact or transform tool results before they reach the model's context. This prevents sensitive values from being echoed back in responses.

```typescript
const session = await client.createSession({
  hooks: {
    onPostToolUse: async (input) => {
      if (typeof input.result === "string" && input.result.includes("SECRET_")) {
        return { ...input.result, output: "[redacted]" };
      }
      return null;
    },
  },
});
```

### Scope BYOK credentials to the minimum required permissions

When using Bring Your Own Key (BYOK), create API keys with the narrowest scopes that still allow the SDK to operate. Rotate keys regularly. See [BYOK documentation](./auth/byok.md) for setup details.

### Avoid logging full prompt or response text in production

Session content may include user data, file contents, or other sensitive information. Log metadata (session ID, event type, duration) rather than full message text.

```typescript
// ❌ Logs potentially sensitive content
console.log("Response:", event.data.text);

// ✅ Log metadata only
console.log("Turn complete", { sessionId: session.sessionId, eventType: event.type });
```

---

## Validate agent output

The Copilot agent is powerful, but it is still an AI system — always verify its output before acting on it in production.

### Review generated code before executing it

If your application has the agent write and run code, add a confirmation step or a safety review before execution.

```typescript
const session = await client.createSession({
  hooks: {
    onPreToolUse: async (input) => {
      if (input.tool.name === "run_command") {
        console.log(`Agent wants to run: ${input.tool.parameters.command}`);
        const ok = await promptUserToConfirm();
        if (!ok) return { kind: "denied", reason: "User did not approve the command." };
      }
      return null;
    },
  },
});
```

### Use automated checks downstream

Run linters, type checkers, and tests on files the agent produces. Treat agent output the same way you would treat a pull request from an external contributor — review it, test it, then merge it.

---

## Use infinite sessions for long-running work

For tasks that may exceed the model's context window — large codebases, extended workflows, or multi-hour sessions — enable infinite sessions with automatic context compaction.

<details open>
<summary><strong>Node.js / TypeScript</strong></summary>

```typescript
const session = await client.createSession({
  infiniteSessions: { enabled: true },
});

// Listen for compaction events to show progress to the user
for await (const event of session.send({ prompt: "Refactor the entire project" })) {
  if (event.type === "session.compaction_start") {
    console.log("Compacting context to continue the session…");
  } else if (event.type === "session.compaction_complete") {
    console.log(`Compaction complete. Tokens before: ${event.data.tokensBefore}, after: ${event.data.tokensAfter}`);
  }
}
```

</details>

<details>
<summary><strong>Python</strong></summary>

```python
session = await client.create_session({
    "infinite_sessions": {"enabled": True},
})

async for event in session.send({"prompt": "Refactor the entire project"}):
    if event["type"] == "session.compaction_start":
        print("Compacting context to continue the session…")
    elif event["type"] == "session.compaction_complete":
        print(f"Compaction complete. Tokens before: {event['data']['tokens_before']}, after: {event['data']['tokens_after']}")
```

</details>

See the language READMEs ([Node.js](../nodejs/README.md), [Python](../python/README.md), [Go](../go/README.md), [.NET](../dotnet/README.md)) for the full infinite sessions API reference.

---

## Related

- [Getting Started](./getting-started.md) — build your first Copilot-powered app
- [Hooks](./features/hooks.md) — intercept and customize session behavior
- [Session Persistence](./features/session-persistence.md) — resume sessions across restarts
- [Streaming Events](./features/streaming-events.md) — real-time event reference
- [Troubleshooting](./troubleshooting/debugging.md) — common problems and solutions
