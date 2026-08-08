"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useChatHistory } from "@/lib/use-chat-history";
import type { ChatMessage, RestaurantResult, SearchResponse } from "@/lib/types";

type AssistantResponse = {
  content: string;
  results?: RestaurantResult[];
};

const starterPrompts = [
  "Best burgers near Makati",
  "Late-night food in BGC",
  "A quiet Italian dinner in Quezon City",
];

function formatResponse(data: SearchResponse): AssistantResponse {
  if ("error" in data) return { content: data.error };
  if ("message" in data) return { content: data.message };
  if (data.length === 0) {
    return { content: "No restaurants matched that craving. Try a different neighborhood or cuisine." };
  }
  return { content: "I found a few places worth scouting.", results: data };
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`chat-message-row ${isUser ? "is-user" : "is-assistant"}`}>
      <div className="chat-bubble">
        <p>{message.content}</p>
        {message.results && message.results.length > 0 && (
          <div className="chat-results">
            {message.results.map((result, index) => (
              <article className="chat-result-card" key={`${message.id}-${result.name}-${index}`}>
                <h3>{result.name}</h3>
                <p className="chat-result-category">{result.categories || "Restaurant"}</p>
                <p className="chat-result-address">{result.address || "Address unavailable"}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="chat-message-row is-assistant" aria-label="BiteScout is searching" role="status">
      <div className="chat-bubble chat-typing"><span /><span /><span /></div>
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

  async function sendMessage(value: string) {
    const trimmed = value.trim();
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
      const result = formatResponse((await response.json()) as SearchResponse);
      addMessage("assistant", result.content, result.results);
    } catch {
      addMessage("assistant", "The scout is offline. Start the backend and try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <section className="bitescout-chat" aria-label="BiteScout restaurant search">
      <header className="chat-header">
        <div>
          <p className="chat-kicker">BiteScout assistant</p>
          <h2>Tell me what sounds good.</h2>
        </div>
        <div className="chat-header-actions">
          <span className="chat-status"><span aria-hidden="true" />Ready to scout</span>
          <button className="chat-clear" type="button" onClick={clearHistory}>Clear chat</button>
        </div>
      </header>

      <div className="chat-messages" aria-live="polite">
        {messages.length === 1 && !isLoading && (
          <div className="chat-starters">
            <p>Start with a craving, a place, or a mood.</p>
            <div>
              {starterPrompts.map((prompt) => (
                <button className="chat-starter" type="button" key={prompt} onClick={() => void sendMessage(prompt)}>{prompt}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="bitescout-message">Message BiteScout</label>
        <input
          ref={inputRef}
          id="bitescout-message"
          className="chat-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Try “late-night burgers in Makati”"
          disabled={isLoading}
        />
        <button className="chat-send" type="submit" disabled={isLoading || input.trim() === ""} aria-label="Send message">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </section>
  );
}
