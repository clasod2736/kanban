import * as React from "react"

import { cn } from "@/lib/utils"
import { useDebounce } from "use-debounce"
import { useEffect, useState } from "react"

export interface TextareaProps {
  id?: string
  label?: string
  wrapperClassName?: string
  className?: string
  placeholder?: string
  value?: string
  helpText?: string
  handleChange?: (value?: string) => void
  errorMessage?: string
}



const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props: TextareaProps, ref) => {
  const {
    id,
    label,
    wrapperClassName,
    className,
    placeholder,
    value,
    helpText,
    handleChange,
    errorMessage,
  } = props

  const [textAreaValue, setTextAreaValue] = useState(value)
  const [debouncedValue] = useDebounce(textAreaValue, 1000)    

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value)
    handleChange && handleChange(debouncedValue)
  }

  useEffect(() => {
    if (value !== undefined && value !== textAreaValue) {
      setTextAreaValue(value);
    }
  }, [value]);

  useEffect(() => {
    setTextAreaValue(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className={cn('flex flex-col items-start w-full',  wrapperClassName)}>
      <p>{label}</p>
      <textarea
        ref={ref}
        id={id}
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        placeholder={placeholder}
        value={textAreaValue}
        onChange={handleTextAreaChange}
        {...props}
      />
      {errorMessage && <p className="text-sm text-destructive/80">{errorMessage}</p>}
      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
    </div>
  )
})

export { Textarea }
