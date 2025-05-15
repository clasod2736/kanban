import React from 'react'
import { cn } from '../../../../../lib/utils'

import { Item } from '../../../Kanban/Item'
import { type DraggableProps } from '../../../List'

export type KanbanTileProps = {
  id: string
  title?: string
  description?: string
  className?: string
  draggable?: DraggableProps
  handleClick?: () => void
}

export const KanbanTile = (props: KanbanTileProps) => {
  const { title, description, className, handleClick } = props

  return (
    <Item {...props}>
      <div
        className={cn(
          'rounded-lg items-center flex p-3 flex-row gap-2',
          className,
        )}
        onClick={() => handleClick && handleClick()}
      >
        {/**
         * this part will be actual content of the kanban tile: titlem description, tags and etc
         */}
        <div className="flex flex-col justify-center overflow-hidden w-full">
          <div className="text-sm font-bold">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
    </Item>
  )
}
