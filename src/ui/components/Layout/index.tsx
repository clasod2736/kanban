'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn, colSpanMap } from '@/lib/utils'
import { Input, type InputProps } from '../Input'
import { Button, type ButtonProps } from '../Button'
import { Textarea, type TextareaProps } from '../TextArea'
const pageContentVariants = cva('h-full w-full')

type SpanCol = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type StyleProps = {
  id?: string
  className?: string
  span: SpanCol
  mdSpan: SpanCol
  lgSpan: SpanCol
  hidden?: boolean
}

export type TextComponent = {
  component: 'Text'
  props: {
    label: string
    className?: string
  }
} & StyleProps

export type EmptyComponent = {
  component: 'Empty'
  props: {}
} & StyleProps


export type InputComponent = {
  component: 'Input'
  props: InputProps
} & StyleProps

export type ButtonComponent = {
  component: 'Button'
  props: ButtonProps
} & StyleProps

export type TextareaComponent = {
  component: 'Textarea'
  props: TextareaProps
} & StyleProps


// export type SelectComponent = {
//   component: 'Select'
//   props: SelectProps
// } & StyleProps


// export type CheckboxComponent = {
//   component: 'Checkbox'
//   props: CheckboxProps
// } & StyleProps


// export type TimePickerComponent = {
//   component: 'TimePicker'
//   props: TimePickerProps
// } & StyleProps



export type LayoutComponent =
  | InputComponent
  | EmptyComponent
  | TextComponent
  | ButtonComponent
  | TextareaComponent
  // | SelectComponent
  // | CheckboxComponent
  // | TimePickerComponent

export interface LayoutProps
  extends VariantProps<typeof pageContentVariants> {
  id?: string
  fields: LayoutComponent[]
  className?: string
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ id = 'form-set', fields, className = '' }, ref) => {
    return (
      <div ref={ref} className={cn('grid grid-cols-12 gap-4', className)}>
        {fields
          .filter((comp) => !!!comp.hidden)
          .map((field, i) => (
            <div
              className={cn(
                colSpanMap[field.span].sm,
                colSpanMap[field.mdSpan].md,
                colSpanMap[field.lgSpan].lg,
                'w-full',
                field.className,
              )}
              key={`${id}-field-${i}-${field.id}`}
            >
              {field.component === 'Text' && (
                <div className={field.className} {...field.props}>
                  <p className={cn(field.props.className, 'text-sm')}>
                    {field.props.label}
                  </p>
                </div>
              )}
              {field.component === 'Empty' && <div></div>}
              {field.component === 'Input' && <Input {...field.props} />}
              {field.component === 'Button' && <Button {...field.props} />}
              {/* {field.component === 'Select' && <Select {...field.props} />}
              {field.component === 'Textarea' && <Textarea {...field.props} />}
              {field.component === 'Checkbox' && <Checkbox {...field.props} />}
              {field.component === 'TimePicker' && (
                <TimePicker {...field.props} />
              )} */}
            </div>
          ))}
      </div>
    )
  },
)

export { Layout }

Layout.displayName = 'Layout'
