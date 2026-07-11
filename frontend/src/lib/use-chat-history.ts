"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatMessage } from "./types";

const STORAGE_KEY = "bitescout-chat-history";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm BiteScout 🍽️ Tell me what kind of restaurant you're looking for and where. For example: \"Find me cheap sushi in downtown Los Angeles\"",
  timestamp: Date.now(),
};

function loadMessagesFromStorage(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Corrupted data — reset
  }

  return [WELCOME_MESSAGE];
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = loadMessagesFromStorage();
    setMessages(stored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [messages, isHydrated]);

  const addMessage = useCallback(
    (role: ChatMessage["role"], content: string) => {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, message]);
      return message;
    },
    []
  );

  const clearHistory = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return { messages, addMessage, clearHistory };
}
