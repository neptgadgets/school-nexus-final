"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            ...child.props, 
            open, 
            setOpen, 
            value, 
            onValueChange 
          } as any)
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = ({ className, children, ...props }: SelectTriggerProps & any) => {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => props.setOpen?.(!props.open)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

const SelectContent = ({ className, children, ...props }: SelectContentProps & any) => {
  if (!props.open) return null

  return (
    <div
      className={cn(
        "absolute top-full z-50 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            ...child.props, 
            onValueChange: props.onValueChange,
            setOpen: props.setOpen
          } as any)
        }
        return child
      })}
    </div>
  )
}

const SelectItem = ({ value, className, children, ...props }: SelectItemProps & any) => {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={() => {
        props.onValueChange?.(value)
        props.setOpen?.(false)
      }}
    >
      {children}
    </div>
  )
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <span>{placeholder}</span>
}

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
}
