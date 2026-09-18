"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextType | null>(null)

interface AccordionProps extends React.ComponentProps<"div"> {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
}

function Accordion({
  children,
  type = "single",
  collapsible = true,
  defaultValue,
  className,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggleItem = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        if (type === "single") {
          if (prev.includes(value)) {
            return collapsible ? [] : prev
          }
          return [value]
        } else {
          return prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        }
      })
    },
    [type, collapsible]
  )

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps extends React.ComponentProps<"div"> {
  value: string
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <div
      data-slot="accordion-item"
      data-value={value}
      className={cn("border-b border-white/10 py-1", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ itemValue?: string }>, {
            itemValue: value,
          })
        }
        return child;
      })}
    </div>
  )
}

interface AccordionTriggerProps extends React.ComponentProps<"button"> {
  itemValue?: string
}

function AccordionTrigger({
  itemValue,
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const ctx = React.useContext(AccordionContext)
  const isOpen = itemValue ? ctx?.openItems.includes(itemValue) : false

  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      aria-expanded={isOpen}
      onClick={() => itemValue && ctx?.toggleItem(itemValue)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary",
        isOpen ? "text-primary" : "text-white",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180 text-primary"
        )}
      />
    </button>
  )
}

interface AccordionContentProps extends React.ComponentProps<"div"> {
  itemValue?: string
}

function AccordionContent({
  itemValue,
  className,
  children,
  ...props
}: AccordionContentProps) {
  const ctx = React.useContext(AccordionContext)
  const isOpen = itemValue ? ctx?.openItems.includes(itemValue) : false

  if (!isOpen) return null

  return (
    <div
      data-slot="accordion-content"
      className={cn(
        "pb-4 text-sm text-neutral-300 animate-in fade-in-50 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
