"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  labelMap: Record<string, string>
  registerLabel: (val: string, label: string) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

function Select({ value = "", onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [labelMap, setLabelMap] = React.useState<Record<string, string>>({})

  const registerLabel = React.useCallback((val: string, label: string) => {
    setLabelMap((prev) => ({ ...prev, [val]: label }))
  }, [])

  const handleSelect = React.useCallback(
    (val: string) => {
      onValueChange?.(val)
      setIsOpen(false)
    },
    [onValueChange]
  )

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleSelect,
        isOpen,
        setIsOpen,
        labelMap,
        registerLabel,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({
  id,
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const ctx = React.useContext(SelectContext)

  return (
    <button
      id={id}
      type="button"
      onClick={() => ctx?.setIsOpen(!ctx.isOpen)}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" />
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext)
  const display = ctx?.value ? ctx.labelMap[ctx.value] || ctx.value : placeholder

  return (
    <span className={cn(!ctx?.value && "text-neutral-500")}>
      {display || placeholder}
    </span>
  )
}

function SelectContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ctx = React.useContext(SelectContext)
  if (!ctx?.isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => ctx.setIsOpen(false)}
      />
      <div
        className={cn(
          "absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-[#121212] p-1 text-white shadow-xl animate-in fade-in-50 zoom-in-95",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

function SelectItem({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const ctx = React.useContext(SelectContext)
  const isSelected = ctx?.value === value

  React.useEffect(() => {
    if (typeof children === "string") {
      ctx?.registerLabel(value, children)
    }
  }, [value, children, ctx])

  return (
    <div
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10",
        isSelected && "bg-primary/20 text-primary font-medium",
        className
      )}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-4 w-4 text-primary" />}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
