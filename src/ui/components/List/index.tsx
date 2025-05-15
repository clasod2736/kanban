'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn, colSpanMap } from '../../../lib/utils'

import { InfiniteScroll, InfiniteScrollProps } from '../InfiniteScroll'
import { Input, InputProps } from '../Input'
import { Button, ButtonProps } from '../Button'
import { type iconTypes } from '../Icon'
import { KanbanTile, type KanbanTileProps } from './tiles/KanbanTile'

import { type DragGroup, Group } from '../Kanban/Group'

import { handleSubsectionY } from '../Kanban/utils'

const pageContentVariants = cva('h-full w-full')

type SpanCol = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type StyleProps = {
  id?: string
  className?: string
  span: SpanCol
  mdSpan: SpanCol
  lgSpan: SpanCol
  hidden?: boolean
}

export type DraggableProps = {
  index?: number
  itemHeight: number
  columnHeaderHeight?: number
  subsectionHeaderHeight?: number
  subsectionGap?: number
  y?: number
  columnId?: string
  columnIndex?: number
  subsectionId?: string
  isOver?: boolean
  draggingItemId?: string
  handleMoveItem?: (
    id: string,
    hoverColumnId: string,
    targetSectionId: string,
    hoverIndex: number,
  ) => void
  expandedSubsectionArr?: DragGroup[]
  onSetSubectionExpanded?: (subsectionId: string, isExpanded: boolean) => void
}

export type KanbanTileComponent = {
  component: 'KanbanTile'
  props: KanbanTileProps
} & StyleProps

export type ItemComponent =
  | KanbanTileComponent

export type ListSection = {
  id: string
  title: string
  icon?: iconTypes
  items: ItemComponent[]
  isExpanded?: boolean
  infiniteScroll?: InfiniteScrollProps
  subSections?: ListSection[]
  draggable?: DraggableProps
}

export interface ListProps extends VariantProps<typeof pageContentVariants> {
  id?: string
  subsections: ListSection[]
  title: string
  infiniteScroll?: InfiniteScrollProps
  className?: string
  isSkeleton?: boolean
  search?: InputProps
  empty?: {
    enabled: boolean
    message: string
    action?: ButtonProps
  }
  draggable?: DraggableProps
}

const SubSectionItems = (props: {
  draggable?: DraggableProps
  items: ListProps['subsections'][number]['items']
  subsectionId: string
  infiniteScroll?: InfiniteScrollProps
}) => {
  const { draggable, items, subsectionId, infiniteScroll } = props

  const content = (
    <div
      className={cn({
        'grid grid-cols-12': !draggable,
        relative: draggable && infiniteScroll,
      })}
    >
      {items
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
            key={field.id}
          >
            {field.component === 'KanbanTile' && (
              <KanbanTile
                {...field.props}
                draggable={
                  draggable && {
                    index: i,
                    draggingItemId: field.props.id,
                    y: i * draggable?.itemHeight,
                    subsectionId: subsectionId,
                    ...draggable,
                  }
                }
              />
            )}
          </div>
        ))}
    </div>
  )

  if (infiniteScroll) {
    return (
      <InfiniteScroll
        {...(infiniteScroll as InfiniteScrollProps)}
        id={subsectionId}
      >
        {content}
      </InfiniteScroll>
    )
  }
  return content
}

const SectionItems = (props: {
  draggable?: DraggableProps
  subsections: ListProps['subsections']
}) => {
  const { draggable, subsections } = props
  const {
    itemHeight = 0,
    columnHeaderHeight = 0,
    onSetSubectionExpanded,
  } = draggable || {}

  if (subsections.length == 1) {
    return (
      <div
        style={{
          height: `${subsections[0]?.items.length * itemHeight - columnHeaderHeight}px`,
        }}
      >
        {
          <SubSectionItems
            items={subsections[0].items}
            subsectionId={subsections[0].id || ''}
            infiniteScroll={subsections[0].infiniteScroll}
            draggable={draggable}
          />
        }
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 relative">
      {subsections.map((subsection, i) => (
        <Group
          section={subsection}
          draggable={draggable}
          key={`${subsection.id}=${i}-${subsection.title}`}
          y={
            i > 0
              ? handleSubsectionY({
                  subsections,
                  index: i,
                  draggable: draggable as DraggableProps,
                  expandedArr: draggable?.expandedSubsectionArr || [],
                })
              : 0
          }
          index={i}
          onSetSubectionExpanded={onSetSubectionExpanded}
          {...subsection}
        >
          <SubSectionItems
            {...subsection}
            draggable={draggable}
            subsectionId={subsection.id || ''}
          />
        </Group>
      ))}
    </div>
  )
}

const List = React.forwardRef<HTMLDivElement, ListProps>(
  (
    {
      id = 'list-set',
      subsections,
      infiniteScroll,
      title,
      isSkeleton,
      search,
      empty,
      draggable,
    },
    ref,
  ) => {
    const { itemHeight = 0, columnHeaderHeight = 0 } = draggable || {}

    const skeletonContact = () => {
      return (
        <div
          className={cn(
            'h-16 rounded-lg items-center p-2 flex flex-row gap-2 bg-accent animate-pulse',
          )}
          title={`contact-skeleton`}
        >
          <div className="flex flex-col justify-center overflow-hidden w-full" />
        </div>
      )
    }

    if (empty?.enabled) {
      return (
        <div className="flex flex-col items-center gap-2">
          {empty.message}
          {empty.action && <Button {...empty.action} />}
        </div>
      )
    }

    const content = (
      <div
        className="w-full flex flex-col grow"
        style={{
          height: draggable
            ? `${
                subsections.length > 1
                  ? subsections.map((s) => s.items).flat().length * itemHeight +
                    subsections.length *
                      (draggable.subsectionHeaderHeight || 0) -
                    columnHeaderHeight
                  : subsections[0]?.items.length * itemHeight
              }px`
            : 'auto',
        }}
      >
        {isSkeleton && (
          <div className="flex flex-col gap-2 py-2 w-full">
            {skeletonContact()}
            {skeletonContact()}
            {skeletonContact()}
          </div>
        )}

        {infiniteScroll ? (
          <InfiniteScroll {...infiniteScroll} id={title}>
            <SectionItems subsections={subsections} draggable={draggable} />
          </InfiniteScroll>
        ) : (
          <SectionItems subsections={subsections} draggable={draggable} />
        )}
      </div>
    )

    return (
      <div
        className={cn('flex flex-col gap-2', {
          grow: !draggable,
        })}
      >

        {content}
      </div>
    )
  },
)

export { List }

List.displayName = 'List'
