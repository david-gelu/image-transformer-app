"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indeterminate?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indeterminate, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`progress ${indeterminate ? 'progress--indeterminate' : ''} ${className || ''}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="progress__indicator"
      style={!indeterminate ? { transform: `translateX(-${100 - (value || 0)}%)` } : undefined}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
