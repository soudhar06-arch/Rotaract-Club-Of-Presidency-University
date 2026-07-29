"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const SUGGESTED_QUESTIONS = [
  "How do I join Rotaract?",
  "What are upcoming events?",
  "Who is on the board?",
  "Tell me about flagship projects",
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageIdCounter = useRef(100);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! 👋 I'm the Rotaract AI Assistant. How can I assist you today with our community initiatives, membership, or events?",
      time: "09:00 AM",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || loading) return;

    messageIdCounter.current += 1;
    const userMsgId = `user-${messageIdCounter.current}`;
    const formattedTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      time: formattedTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      messageIdCounter.current += 1;
      const botMsgId = `bot-${messageIdCounter.current}`;

      const botMsg: Message = {
        id: botMsgId,
        sender: "bot",
        text:
          data.reply ||
          "Thank you for reaching out! Please explore our site for more details.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      messageIdCounter.current += 1;
      const errId = `bot-err-${messageIdCounter.current}`;
      const errorMsg: Message = {
        id: errId,
        sender: "bot",
        text: "Sorry, I ran into a connection issue. Please try again shortly.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="group shadow-hero relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[color:var(--color-brand-accent-blue)] to-[#002b5c] text-white transition-transform hover:scale-105 focus-visible:outline-none active:scale-95"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-brand-rotary-gold)] opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[color:var(--color-brand-rotary-gold)]" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="shadow-hero flex h-[520px] w-[360px] flex-col overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[color:var(--color-brand-accent-blue)] to-[#002857] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[color:var(--color-brand-rotary-gold)] backdrop-blur-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-geist text-sm font-bold">
                      Rotaract AI Assistant
                    </h3>
                    <Sparkles className="h-3 w-3 text-[color:var(--color-brand-rotary-gold)]" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span>Online & Ready</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close Assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-[color:var(--color-bg-primary)] p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-[color:var(--color-brand-accent-blue)] text-white"
                        : "bg-[color:var(--color-brand-rotary-gold)]/20 text-[color:var(--color-brand-rotary-gold)]"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`shadow-small max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      msg.sender === "user"
                        ? "rounded-tr-none bg-[color:var(--color-brand-accent-blue)] text-white"
                        : "rounded-tl-none border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)]"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`mt-1 block text-right text-[9px] ${
                        msg.sender === "user"
                          ? "text-slate-200"
                          : "text-[color:var(--color-text-muted)]"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-[color:var(--color-text-muted)]">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--color-brand-rotary-gold)]/20 text-[color:var(--color-brand-rotary-gold)]">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--color-text-muted)]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--color-text-muted)] [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--color-text-muted)] [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length < 3 && (
              <div className="flex items-center gap-1.5 overflow-x-auto border-t border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] px-4 py-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="shrink-0 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-brand-accent-blue)] transition-colors hover:bg-[color:var(--color-border)] dark:text-[color:var(--color-brand-rotary-gold)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about events, membership, projects..."
                className="flex-1 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-primary)] px-3.5 py-2 text-xs text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-rotary-gold)] focus-visible:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-brand-accent-blue)] text-white transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
