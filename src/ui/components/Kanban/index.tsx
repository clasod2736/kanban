import { Column } from './Column'
import { cn } from '../../../lib/utils'
import { type ColumnProps } from './Column'

import { TooltipProvider } from '../Tooltip'
import { CustomDragLayer } from './CustomDragLayer'

export interface KanbanBoardProps {
  columnWidth?: number
  columns: ColumnProps[]
  className?: string
  isLoading?: boolean
  handleMoveItem?: (itemId: string, targetColumnId: string, targetSubsectionId: string, hoverIndex: number,) => void
  handleMoveColumn?: (dragIndex: number, hoverIndex: number) => void
  handleDeleteItem?: (itemId: string) => void
  handleDeleteColumn?: (columnId: string) => void
}

export const KanbanBoard = (props: KanbanBoardProps) => {
  const { columns = [], className, columnWidth = 300 } = props

  return (
    <TooltipProvider>
      <CustomDragLayer {...props} />
      <div className={cn('relative w-full overflow-x-auto h-full', className)}>
        <div className="flex flex-row gap-4 p-2 h-full">
          {columns.map((column, index) => (
            <Column
              key={column.id}
              index={index}
              x={index * columnWidth}
              handleMoveItem={props.handleMoveItem}
              {...column}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
