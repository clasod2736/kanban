'use client'

import { LucideProps } from 'lucide-react'
import { icons, CircleHelp } from 'lucide-react'
import { cn } from '../../../lib/utils'
import React from 'react'

export type iconTypes = keyof typeof icons
export { icons } from 'lucide-react'
export const iconList = Object.keys(icons) as iconTypes[]

export interface IconProps extends LucideProps {
  name: iconTypes
  height?: number
  size?: number
  strokeWidth?: number
  title?: string
}

const Icon: React.FC<IconProps> = React.memo(
  ({ name, size = 14, strokeWidth = 2, className, ...props }: IconProps) => {
    const LucideIcon = icons[name] || CircleHelp

    return (
      <LucideIcon
        title={props.title}
        strokeWidth={strokeWidth}
        {...props}
        className={cn('md:flex', className)}
        size={size}
      />
    )
  },
)

export default Icon
export { Icon }
