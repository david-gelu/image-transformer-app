"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`slider ${className || ''}`}
    {...props}
  >
    <SliderPrimitive.Track className="slider__track">
      <SliderPrimitive.Range className="slider__range" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="slider__thumb" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
