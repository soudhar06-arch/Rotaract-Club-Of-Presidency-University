"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, X, Send, User, ChevronRight } from "lucide-react";
interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  "When is the next event?",
  "What events are happening this month?",
  "How can I apply for membership?",
  "Who leads the Board of Directors?",
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "assistant",
      text: "Greetings! I am the Rotaract Intelligence Assistant for the Rotaract Club of Presidency University. How may I assist you today?",
      timestamp: "10:00 AM",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsgId = `u-${crypto.randomUUID()}`;
    const userMsgTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: query,
      timestamp: userMsgTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      let responseText =
        "The Rotaract Club of Presidency University is dedicated to youth leadership, professional networking, and community service.";

      if (res.ok) {
        const data = (await res.json()) as { reply?: string };
        if (data.reply) responseText = data.reply;
      }

      const assistantMsgId = `a-${crypto.randomUUID()}`;
      const assistantMsgTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const assistantMsg: Message = {
        id: assistantMsgId,
        sender: "assistant",
        text: responseText,
        timestamp: assistantMsgTime,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error("AI assistant send error:", err);
      const errorMsgId = `a-${crypto.randomUUID()}`;
      const errorMsgTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const assistantMsg: Message = {
        id: errorMsgId,
        sender: "assistant",
        text: "I'm having trouble connecting right now. Please explore our Calendar and Events pages for up-to-date schedule information!",
        timestamp: errorMsgTime,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Glass Trigger Orb */}
      <div className="fixed right-6 bottom-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="group shadow-glow relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#101010]/80 backdrop-blur-xl"
          aria-label="Open AI Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3B82F6] to-indigo-600 opacity-20 transition-opacity group-hover:opacity-40" />
          <Bot className="h-6 w-6 text-[#3B82F6] transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3B82F6] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#3B82F6]" />
          </span>
        </motion.button>
      </div>

      {/* Floating Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="shadow-large fixed right-6 bottom-24 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-2xl sm:w-[400px]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#101010]/80 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/20">
                  <Sparkles className="h-4 w-4 text-[#3B82F6]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wide text-white">
                    Rotaract Intelligence AI
                  </h4>
                  <p className="text-[10px] text-[#9A9A9A]">
                    Official Club Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[#9A9A9A] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-3.5 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#3B82F6]/20 text-[#3B82F6]">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#3B82F6] font-medium text-white"
                        : "border border-white/10 bg-white/[0.04] text-[#D4D4D4]"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="mt-1 block text-right text-[9px] text-[#9A9A9A]">
                      {msg.timestamp}
                    </span>
                  </div>
                  {msg.sender === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                  <Bot className="h-4 w-4 animate-pulse text-[#3B82F6]" />
                  <span className="animate-pulse">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Chips */}
            {messages.length < 3 && (
              <div className="border-t border-white/5 bg-[#050505]/60 p-2.5">
                <p className="mb-1.5 px-1 text-[10px] font-medium text-[#71717A]">
                  Suggested Queries:
                </p>
                <div className="flex flex-col gap-1">
                  {PROMPT_SUGGESTIONS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-left text-[11px] text-[#9A9A9A] transition-colors hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/10 hover:text-white"
                    >
                      <span>{chip}</span>
                      <ChevronRight className="h-3 w-3 text-[#3B82F6]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Box */}
            <div className="border-t border-white/10 bg-[#0A0A0A] p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about Rotaract..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B82F6] text-white transition-opacity disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
