"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { InterviewConfig, Message } from "../types/interview";

function toDomainLevel(difficulty: InterviewConfig["difficulty"]): "junior" | "mid" | "senior" {
  if (difficulty === "beginner") return "junior";
  if (difficulty === "expert") return "senior";
  return "mid";
}

function toDomainMode(type: InterviewConfig["interviewType"]): "behavioral" | "technical" | "case-study" | "mixed" {
  return type === "technical" ? "technical" : type === "consulting" ? "case-study" : "behavioral";
}

function readText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function useInterviewChat(config: InterviewConfig) {
  const [sessionId] = useState(() => crypto.randomUUID());

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/interview/chat",
        body: {
          sessionId,
          contextOverrides: {
            mode: toDomainMode(config.interviewType),
            level: toDomainLevel(config.difficulty),
            language: config.language === "en" ? "en" : "fr",
            questionLimit: config.duration === "express" ? 5 : config.duration === "premium" ? 12 : 8,
          },
        },
      }),
    [config.difficulty, config.duration, config.interviewType, config.language, sessionId],
  );

  const chat = useChat({ transport });

  const conversationHistory = useMemo<Message[]>(
    () =>
      chat.messages.map((message, index) => ({
        role: message.role === "user" ? "candidate" : "recruiter",
        content: readText(message),
        timestamp: index,
      })),
    [chat.messages],
  );

  return {
    ...chat,
    sessionId,
    conversationHistory,
    isLoading: chat.status === "submitted" || chat.status === "streaming",
  };
}
