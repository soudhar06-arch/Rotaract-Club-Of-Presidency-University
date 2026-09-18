"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  fallbackRoute?: string;
  className?: string;
}

export function BackButton({
  label = "Back",
  fallbackRoute = "/",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition-all hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 hover:text-white active:scale-95 ${className}`}
    >
      <ArrowLeft className="h-4 w-4 text-[#3B82F6]" />
      <span>{label}</span>
    </button>
  );
}
