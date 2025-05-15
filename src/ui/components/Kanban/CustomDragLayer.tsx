import { useEffect, useState } from 'react'
import { useDragLayer, type XYCoord } from 'react-dnd'
import { type DragItem, Item } from './Item'
import { type ColumnProps } from './Column'

import { cn } from '../../../lib/utils'

/**
 * This component is define style of dragging preview(following image when dragging item).
 *
 * It can be Item, Group or Column.
 * For now, set custom drag layer for draggable items only
 */

type CustomDragLayerProps = {
  columns: ColumnProps[]
  itemHeight?: number
}

type CustomItemLayer = {
  title?: string
  description?: string
} & DragItem

function getDraggablePosition(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
): React.CSSProperties {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' }
  }
  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    transform,
  }
}

const getHoverColumnIndex = (columns: ColumnProps[], columnId: string) => {
  if (!columnId) return 0
  return columns.findIndex((column) => column.id === columnId)
}

export const CustomDragLayer: React.FC<CustomDragLayerProps> = (
  props: CustomDragLayerProps,
) => {
  const [hoverColumnIndex, setHoverColumnIndex] = useState(0)
  const [rotated, setRotated] = useState<'right' | 'left' | undefined>(
    undefined,
  )

  const { itemHeight = 80, columns } = props

  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer<{
      item: CustomItemLayer | null
      itemType: 'Item' | 'Group' | 'Column'
      isDragging: boolean
      initialOffset: XYCoord | null
      currentOffset: XYCoord | null
    }>((monitor) => ({
      item: monitor.getItem() as CustomItemLayer,
      itemType: monitor.getItemType() as 'Item' | 'Group' | 'Column',
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    }))

  useEffect(() => {
    const hoverColumnIndex = getHoverColumnIndex(columns, item?.columnId || '')
    setHoverColumnIndex(hoverColumnIndex)
  }, [item?.columnId])

  useEffect(() => {
    // if not dragging or item is undefined, set rotated to 0
    if (!isDragging || item?.columnIndex === undefined) {
      setRotated(undefined)
      return
    }

    if (item.columnIndex < hoverColumnIndex) {
      const t = setTimeout(() => setRotated('right'), 100)
      return () => clearTimeout(t)
    }

    if (item.columnIndex > hoverColumnIndex) {
      const t = setTimeout(() => setRotated('left'), 100)
      return () => clearTimeout(t)
    }

    setRotated(undefined)
  }, [isDragging, item?.columnIndex, hoverColumnIndex])

  // rendering only when dragging and item type is Item
  if (!isDragging || itemType !== 'Item' || !item) return null

  return (
    <div style={getDraggablePosition(initialOffset, currentOffset)}>
      <div
        className={cn('w-[270px] transition-all duration-100 ease-in-out', {
          'rotate-6': rotated === 'right',
          'rotate-[-6deg]': rotated === 'left',
          'rotate-0': !rotated,
        })}
      >
        <Item {...item}>
          <div
            className={cn('rounded-lg items-center p-3 flex flex-row gap-2')}
            style={{
              height: itemHeight * 0.8,
            }}
          >
            <div className="flex flex-col justify-center overflow-hidden w-full">
              {/* this part need to be replaced with actual content of the Tile later */}
              {item.title && (
                <div className="text-sm font-bold">{item.title}</div>
              )}
              {item.description && (
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        </Item>
      </div>
    </div>
  )
}
