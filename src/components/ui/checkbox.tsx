import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`checkbox ${className || ''}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="checkbox__indicator">
      <Check className="checkbox__check" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }