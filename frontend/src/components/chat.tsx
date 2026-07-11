"use client";

import { useState, useRef, useEffect } from "react";
import { useChatHistory } from "@/lib/use-chat-history";
import { TypingIndicator } from "./typing-indicator";
import type { ChatMessage, RestaurantResult, SearchResponse } from "@/lib/types";

function formatResults(data: SearchResponse): string {
  if ("error" in data) {
    return `Sorry, something went wrong: ${data.error}`;
  }

  if ("message" in data) {
    return data.message;
  }

  if (Array.isArray(data) && data.length === 0) {
    return "No restaurants found matching your criteria. Try a different search!";
  }

  const results = data as RestaurantResult[];
  const lines = results.map((r, i) => {
    const parts = [`${i + 1}. ${r.name}`];
    if (r.categories) parts.push(`   ${r.categories}`);
    if (r.address) parts.push(`   📍 ${r.address}`);
    return parts.join("\n");
  });

  return lines.join("\n\n");
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex px-4 py-1.5 md:px-6 lg:px-8 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap md:max-w-[70%] ${
          isUser
            ? "rounded-tr-sm bg-blue-600 text-white"
            : "rounded-tl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export function Chat() {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    addMessage("user", trimmed);
    setIsLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = (await response.json()) as SearchResponse;
      const content = formatResults(data);
      addMessage("assistant", content);
    } catch {
      addMessage(
        "assistant",
        "Sorry, I couldn't connect to the server. Please make sure the backend is running and try again."
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 md:px-6 lg:px-8">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          🍽️ BiteScout
        </h1>
        <button
          type="button"
          onClick={clearHistory}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          Clear chat
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="mx-auto max-w-2xl">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-zinc-200 px-4 pb-[env(safe-area-inset-bottom)] dark:border-zinc-800 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-2 py-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Find me sushi in downtown LA..."
            disabled={isLoading}
            className="h-11 flex-1 rounded-full border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
