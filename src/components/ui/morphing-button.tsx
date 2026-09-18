import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface MorphingButtonProps {
  buttonText?: string;
  placeholder?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export const MorphingButton: React.FC<MorphingButtonProps> = ({
  buttonText = "Add Club Calendar",
  placeholder = "Email...",
  onSubmit,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleToggle = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.stopPropagation();
      setIsExpanded(true);
    } else if (email) {
      onSubmit?.(email);
      setIsExpanded(false);
      setEmail("");
    }
  };

  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 22,
  } as const;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <motion.div
        ref={containerRef}
        layout
        transition={springConfig}
        className={`relative flex items-center overflow-hidden rounded-xl border border-white/10 transition-colors duration-200 ${
          isExpanded
            ? "w-64 bg-[#101010] p-1 shadow-lg"
            : "w-auto bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.08]"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.div
              key="input-container"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ ...springConfig }}
              className="flex flex-1 items-center px-2"
            >
              <motion.input
                ref={inputRef}
                layout
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent px-2 text-xs font-medium text-white placeholder-[#71717A] outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email) {
                    onSubmit?.(email);
                    setIsExpanded(false);
                    setEmail("");
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          layout
          type="button"
          onClick={handleToggle}
          transition={springConfig}
          className={`relative flex items-center justify-center gap-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            isExpanded
              ? "bg-[#3B82F6] px-3 py-1.5 text-white"
              : "px-4 py-2 text-white hover:text-[#3B82F6]"
          }`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isExpanded && (
              <motion.span
                key="bell-icon"
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={springConfig}
              >
                <Bell className="h-3.5 w-3.5 text-[#3B82F6]" />
              </motion.span>
            )}
          </AnimatePresence>

          <motion.span layout="position">{buttonText}</motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
};
