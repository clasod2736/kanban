import { useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { cn } from '../../../../lib/utils'
import { type DraggableProps } from '../../List'

import { motion } from 'framer-motion'

export type DragItem = {
  id: string
  index: number
  columnId: string
  columnIndex: number
  subsectionId: string
  type: 'Item'
}

export interface ItemProps {
  id: string
  title?: string
  description?: string
  draggable?: DraggableProps
  className?: string
  children?: React.ReactNode
}

export const Item = (props: ItemProps) => {
  const { id, className, children, draggable, title, description } = props

  const {
    index,
    columnId,
    columnIndex,
    handleMoveItem,
    isOver,
    draggingItemId,
    y,
    subsectionId,
  } = draggable ?? {}

  const itemRef = useRef<HTMLDivElement>(null)
  const lastYPositionRef = useRef<number | null>(null)

  // drag handling
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'Item',
    item: {
      id,
      index,
      columnId,
      columnIndex,
      subsectionId,
      title,
      description,
      type: 'Item',
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  //drop handling
  const [{ getItem }, drop] = useDrop<DragItem, void, { getItem: DragItem }>({
    accept: 'Item',
    collect: (monitor) => ({
      getItem: monitor.getItem(),
    }),
    hover(item, monitor) {
      if (!itemRef.current) return

      // drag** is source entity and hover** is target entity
      const dragIndex = item.index
      const dragSubsectionId = item.subsectionId
      const hoverIndex = index ?? 0
      const hoverSubsectionId = subsectionId
      const dragColumnId = columnId
      const hoverColumnId = item.columnId

      // Don't replace items with themselves in the same column
      const isSameDroppableLocation =
        dragIndex === hoverIndex &&
        dragSubsectionId === hoverSubsectionId &&
        dragColumnId === hoverColumnId

      if (isSameDroppableLocation) return

      // Determine rectangle on screen
      const hoverBoundingRect = itemRef.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return

      // prevent infinite hover event without mouse movement
      if (lastYPositionRef.current === clientOffset.y) return
      lastYPositionRef.current = clientOffset.y

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Calculate new index based on mouse position
      let destinationIndex = hoverIndex
      if (hoverClientY >= hoverMiddleY) destinationIndex = hoverIndex + 1

      // Only execute if position change is needed or if the item is the first item in the column
      if (
        destinationIndex !== index ||
        (destinationIndex === 0 && index === 0)
      ) {
        handleMoveItem?.(
          item.id,
          hoverColumnId,
          hoverSubsectionId || '',
          destinationIndex,
        )
        item.index = destinationIndex
        item.columnId = hoverColumnId
        item.subsectionId = hoverSubsectionId ?? ''
      }
    },
  })

  // Hide basic preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  // Attach drag & drop refs and store node locally.
  const handleRef = (node: HTMLDivElement | null) => {
    itemRef.current = node
    drop(node)
    drag(node)
  }

  const isItemAndColumnDragging =
    isDragging || (isOver && draggingItemId === id)

  return (
    <motion.div
      ref={handleRef}
      initial={{ y }}
      animate={{ y }}
      transition={{ type: 'tween', duration: 0.15 }}
      className={cn('absolute w-full mb-1 px-1', className)}
    >
      <div
        className={cn(
          'flex flex-col py-1 rounded-lg cursor-pointer hover:bg-muted/40',
          isItemAndColumnDragging
            ? 'border-dotted border-2 border-primary/60'
            : 'border',
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-2',
            isItemAndColumnDragging && 'opacity-30',
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  )
}
