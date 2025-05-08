import * as React from "react"
import { useDebounce } from 'use-debounce';

import { cn } from "@/lib/utils"
import { useEffect, useState, type HTMLInputTypeAttribute } from "react";

export interface InputProps {
  id?: string;
  label?: string
  wrapperClassName?: string
  className?: string;
  type: HTMLInputTypeAttribute
  placeholder?: string
  isLoading?: boolean
  isSkeleton?: boolean
  isDisabled?: boolean
  value?: string;
  helpText?: string
  handleChange?: (value?: string) => void;
  errorMessage?: string;
}

function Input(props: InputProps) {
  const {
    id,
    type,
    label,
    wrapperClassName,
    className,
    isDisabled,
    placeholder,
    value,
    helpText,
    handleChange,
    errorMessage,
  } = props

  const [inputValue, setInputValue] = useState(value)
  const [debouncedValue] = useDebounce(inputValue, 1000)    

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleChange && handleChange(debouncedValue);
  };

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    setInputValue(debouncedValue);
  }, [debouncedValue]);


  return (
    <div className={cn('flex flex-col items-start w-full',  wrapperClassName)}>
      <p>{label}</p>
      <input
        id={id}
        type={type}
        data-slot="input"
        placeholder={placeholder}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          'my-1',
          className
        )}
        value={inputValue}
        disabled={isDisabled}
        onChange={handleInputChange}
      />
      {errorMessage && <p className="text-sm text-destructive/80">{errorMessage}</p>}
      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
    </div>
  )
}

export { Input }
