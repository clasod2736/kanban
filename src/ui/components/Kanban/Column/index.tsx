import { useRef, useState } from 'react'
import { useDrop, useDrag } from 'react-dnd'
import { Icon, type iconTypes } from '../../Icon'
import { Button, type ButtonProps } from '../../Button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../Tooltip'
import { List, type ListProps } from '../../List'
import { type DragItem } from '../Item'
import { type DragGroup } from '../Group'

import { handleColumnHeight } from '../utils'
import { motion } from 'framer-motion'
import { cn } from '../../../../lib/utils'

export type DragColumn = {
  id: string
  index: number
  type: 'Column'
}

export type ToolTipActions = ButtonProps & {
  tooltipLabel?: string
}

export interface ColumnProps {
  id: string
  itemHeight: number
  subsectionGap?: number
  x?: number
  header: {
    title: string
    icon?: iconTypes
    actions?: ToolTipActions[]
  }
  section: ListProps
  index?: number
  handleAddItem?: (columnId: string) => void
  handleDeleteItem?: (itemId: string) => void
  handleDeleteColumn?: (columnId: string) => void
  handleMoveItem?: (
    id: string,
    hoverColumnId: string,
    hoverSubsectionId: string,
    hoverIndex: number,
  ) => void
  handleMoveColumn?: (dragIndex: number, hoverIndex: number) => void
}

const ColumnHeader = (props: ColumnProps) => {
  const { header, section } = props

  const totalItems = section.subsections
    .map((subsection) => subsection.items)
    .flat().length

  return (
    <div
      className={cn(
        'sticky flex flex-row justify-between items-center gap-4 z-10 mb-3 px-2',
      )}
    >
      <div className="flex flex-row w-4/5 items-center gap-1">
        <div className="flex flex-row items-center gap-2 max-w-3/5 text-sm border rounded-md p-2 truncate">
          {header.icon && <Icon name={header.icon} size={15} />}
          <p className="truncate">{header.title}</p>
        </div>
        <p className="text-xs opacity-60 ml-2">
          {totalItems} {totalItems > 1 ? 'items' : 'item'}
        </p>
      </div>
      <div className="flex flex-center">
        {header.actions?.map((item, index) => (
          <Tooltip key={index} delayDuration={100}>
            <TooltipTrigger>
              {/* <Button
                variant="ghost"
                leftIcon={item.leftIcon}
                size="icon"
                handleClick={item.handleClick}
              /> */}
            </TooltipTrigger>
            {item.tooltipLabel && (
              <TooltipContent>{item.tooltipLabel}</TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export const Column = (props: ColumnProps) => {
  const {
    id,
    section,
    index,
    handleMoveItem,
    handleMoveColumn,
    itemHeight,
    subsectionGap = 10,
    x,
  } = props

  // state for expanded subsections
  const [expandedSubsectionArr, setExpandedSubsectionArr] = useState<
    DragGroup[]
  >(
    section.subsections.map((subsection, index) => ({
      id: subsection.id,
      index: index,
      isExpanded: true,
      type: 'Group',
    })),
  )

  // prop drilling to each section for expanding / collapsing
  const onSetSubectionExpanded = (
    subsectionId: string,
    isExpanded: boolean,
  ) => {
    setExpandedSubsectionArr(
      expandedSubsectionArr.map((item) =>
        item.id === subsectionId ? { ...item, isExpanded } : item,
      ),
    )
  }

  const ref = useRef<HTMLDivElement>(null)

  const lastXPositionRef = useRef<number | null>(null)

  const dropZoneRef = useRef<HTMLDivElement>(null)
  const dropZoneMinHeight = 30

  const columnHeaderHeight = 38

  const subsectionHeaderHeight = 46

  const [{ isDragging }, drag] = useDrag({
    type: 'Column',
    item: { type: 'Column' as const, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  //drop handling
  const [{ isOver, getItem }, drop] = useDrop({
    accept: ['Item', 'Column', 'Group'],
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      getItem: monitor.getItem(),
    }),
    hover(item: DragItem | DragColumn, monitor) {
      if (!ref.current) {
        return
      }

      if (item.type === 'Column') {
        const dragIndex = item.index
        const hoverIndex = index ?? 0

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect()

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()
        if (!clientOffset) return

        // prevent infinite hover event even when no mouse movement
        const lastXPosition = lastXPositionRef.current
        if (lastXPosition === clientOffset.x) return
        lastXPositionRef.current = clientOffset.x

        // Get pixels to the left
        const hoverClientX = clientOffset.x - hoverBoundingRect.left
        const columnWidth = hoverBoundingRect.right - hoverBoundingRect.left

        // Calculate different thresholds based on drag direction
        const threshold = columnWidth / 2

        // Dragging right
        if (dragIndex < hoverIndex && hoverClientX < threshold) {
          return
        }

        // Dragging left
        if (dragIndex > hoverIndex && hoverClientX > threshold) {
          return
        }

        // Time to actually perform the action
        handleMoveColumn?.(dragIndex, hoverIndex)
        item.index = hoverIndex
      }
      // Handle when item dragging into Column
      else if (item.type === 'Item' && id !== item.columnId) {
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect()

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()
        if (!clientOffset) return

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top
        const columnHeight = hoverBoundingRect.bottom - hoverBoundingRect.top

        const targetSubsectionIndex = section.subsections.findIndex(
          (s) => s.id === item.subsectionId,
        )

        // If mouse is below in the drop zone
        if (
          hoverClientY >
          columnHeight -
            (dropZoneRef.current?.clientHeight || dropZoneMinHeight)
        ) {
          const lastSubsection =
            section.subsections[section.subsections.length - 1]
          handleMoveItem?.(
            item.id,
            id,
            lastSubsection.id,
            lastSubsection.items.length,
          )
          item.index = lastSubsection.items.length
          item.columnId = id
          item.subsectionId = lastSubsection.id
        } else {
          if (targetSubsectionIndex === -1) return

          // Calculate position based on mouse Y position
          const items =
            section &&
            section.subsections &&
            section.subsections[targetSubsectionIndex].items
          const newIndex = Math.round(hoverClientY / itemHeight)

          // Ensure index is within bounds
          const boundedIndex = Math.max(0, Math.min(newIndex, items.length))
          handleMoveItem?.(
            item.id,
            id,
            section.subsections[targetSubsectionIndex].id,
            boundedIndex,
          )
          item.index = boundedIndex
          item.columnId = id
          item.subsectionId = section.subsections[targetSubsectionIndex].id
        }
      }
    },
    drop: (item: DragItem | DragColumn) => {},
  })

  drag(drop(ref))

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{
        x,
        height: handleColumnHeight({
          section,
          expandedSubsectionArr,
          itemHeight,
          columnHeaderHeight,
          subsectionHeaderHeight,
          subsectionGap,
          dropZoneMinHeight,
        }),
      }}
      transition={{ type: 'tween', duration: 0.25 }}
      className={cn(
        `absolute flex flex-col w-72 bg-card rounded-lg py-2 z-10`,
        isDragging && getItem?.type !== 'Item'
          ? 'border-dotted border-2 border-primary/60 opacity-50'
          : 'border',
      )}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <ColumnHeader {...props} />
      <List
        {...section}
        draggable={{
          handleMoveItem: handleMoveItem,
          itemHeight: itemHeight,
          subsectionGap,
          columnHeaderHeight,
          subsectionHeaderHeight,
          isOver: isOver && getItem?.type === 'Item',
          draggingItemId: getItem?.id,
          columnId: id,
          columnIndex: index,
          expandedSubsectionArr,
          onSetSubectionExpanded: onSetSubectionExpanded,
        }}
      />
      <div
        className="grow"
        style={{
          minHeight: dropZoneMinHeight,
        }}
        ref={dropZoneRef}
      />
    </motion.div>
  )
}
