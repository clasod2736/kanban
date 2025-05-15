import { useRef, useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { type DraggableProps, type ListSection } from '../../List'
import { type DragItem } from '../Item'
import { type InfiniteScrollProps } from '../../InfiniteScroll'

import { cn } from '../../../../lib/utils'
import { Icon } from '../../Icon'
import { motion } from 'framer-motion'
import { handleGroupHeight } from '../utils'

export type DragGroup = {
  id: string
  index: number
  isExpanded: boolean
  type: 'Group'
}

export type GroupProps = {
  section: ListSection
  className?: string
  index: number
  y: number
  draggable?: DraggableProps
  infiniteScroll?: InfiniteScrollProps
  children?: React.ReactNode
  onSetSubectionExpanded?: (subsectionId: string, isExpanded: boolean) => void
}

export const Group = (props: GroupProps) => {
  const {
    y,
    section,
    index,
    draggable,
    children,
    className,
    onSetSubectionExpanded,
    infiniteScroll,
  } = props
  const { id, title, items } = section
  const { subsectionHeaderHeight } = draggable || {}

  const [showChildren, setShowChildren] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)

  const hideTimeout = useRef<NodeJS.Timeout | null>(null)
  const expandTimeout = useRef<NodeJS.Timeout | null>(null)

  const sectionRef = useRef<HTMLDivElement>(null)

  // drag handling
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Group',
    item: {
      id,
      index,
      type: 'Group',
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  //drop handling
  const [{ getItem, isOver }, drop] = useDrop<
    DragGroup | DragItem,
    void,
    { getItem: DragGroup | DragItem; isOver: boolean }
  >({
    accept: ['Group', 'Item'],
    collect: (monitor) => ({
      getItem: monitor.getItem(),
      isOver: monitor.isOver(),
    }),
    hover(item, monitor) {
      // need to hanlde move item if section is empty and item is dragged from another section
      if (item.type === 'Item') {
        // if user hovering the item on collapsed subsection over 0.5s, expand the subsection
        if (!isExpanded && isOver && !expandTimeout.current) {
          expandTimeout.current = setTimeout(() => {
            setIsExpanded(true)
            onSetSubectionExpanded?.(id, true)
            expandTimeout.current = null
          }, 500)
        }
        // If not hovering anymore, clear timeout
        if (!isOver && expandTimeout.current) {
          clearTimeout(expandTimeout.current)
          expandTimeout.current = null
        }

        // if item is already in this section, ignore
        if (item.subsectionId === section.id) return

        if (section.items.length === 0) {
          // move item to the first index of this section
          draggable?.handleMoveItem?.(item.id, item.columnId, section.id, 0)
          item.subsectionId = section.id
          item.index = 0
        } else {
          // move item to the last index of this section
          draggable?.handleMoveItem?.(
            item.id,
            item.columnId,
            section.id,
            section.items.length,
          )
          item.subsectionId = section.id
          item.index = section.items.length
        }
      }
    },
  })

  const toggleGroupExpanded = () => {
    hideTimeout.current && clearTimeout(hideTimeout.current)

    if (isExpanded) {
      setIsExpanded(false)
      onSetSubectionExpanded?.(id, false)
      hideTimeout.current = setTimeout(() => setShowChildren(false), 320)
    } else {
      setShowChildren(true)
      setIsExpanded(true)
      onSetSubectionExpanded?.(id, true)
    }
  }

  // cleanup timeout
  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current)
      if (expandTimeout.current) clearTimeout(expandTimeout.current)
    }
  }, [isExpanded])

  // Attach drag & drop refs and store node locally.
  const handleRef = (node: HTMLDivElement | null) => {
    sectionRef.current = node
    {
      /* 
      Can opt out drag Group with drag(node)
    */
    }
    drop(node)
  }

  // calculate group height
  const groupHeight = handleGroupHeight({
    isExpanded,
    items,
    draggable,
    infiniteScroll,
  })

  return (
    <motion.div
      ref={handleRef}
      key={`${id}-group-${index}-${title}`}
      className={cn(
        'absolute flex flex-col w-full gap-2 rounded-lg bg-muted/50 overflow-hidden',
        className,
        {
          'bg-muted/70': isOver,
        },
      )}
      style={{
        height: groupHeight,
        transform: `translateY(${props.y}px)`,
        width: 'calc(100% - 8px)',
        left: '4px',
      }}
      animate={{
        height: groupHeight,
        y,
        opacity: 1,
      }}
      initial={false}
      exit={{
        height: `${subsectionHeaderHeight}px`,
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {/* Group Header */}
      <div className="pl-2 text-xs uppercase font-bold flex flex-row items-center justify-between gap-1">
        {/* Group Icon, Title, Expand/Collapse Button */}
        <div className="flex flex-row items-center gap-1 pt-1">
          <div
            className="flex justify-center items-center w-9 h-9 hover:bg-accent rounded-lg cursor-pointer"
            onClick={toggleGroupExpanded}
          >
            <Icon
              name="ChevronRight"
              size={15}
              className={cn(
                'transform transition-transform duration-200 ease-in-out',
                isExpanded ? 'rotate-90' : 'rotate-0',
              )}
            />
          </div>
          <Icon name={section?.icon || 'Zap'} />
          {section.title}
        </div>
        {/* Item Count */}
        <p className="text-xs text-muted-foreground lowercase font-normal mr-2 pt-1">
          {section.items.length} items
        </p>
      </div>
      {/* Group Items: rendering with setTimeout to avoid layout shift */}
      {showChildren ? children : null}
    </motion.div>
  )
}
