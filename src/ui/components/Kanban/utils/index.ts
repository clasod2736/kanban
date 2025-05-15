import { type InfiniteScrollProps } from '../../../components/InfiniteScroll'
import {
  type ListSection,
  type ItemComponent,
  type DraggableProps,
  type ListProps,
} from '../../List'
import { type ColumnProps } from '../Column'

/**
 * this file contains functions handle cards and columns drag and drop
 * these functions will move into helper folder in web and will be used in schema file when set up the kanban view in skedyul app
 *
 * Move Item
 *
 * Calculate Subsection Y Position
 *
 * Calculate Column Height
 *
 * Calculate Group Height
 */

{
  /* in these function I assume we have only one group in the column before I delve into handle multiple groups */
}

type HandleSubsectionYProps = {
  subsections: ListSection[]
  index: number
  draggable: DraggableProps
  expandedArr: { isExpanded: boolean }[]
}

type HandleColumnHeightProps = {
  section: ListProps
  expandedSubsectionArr: { id: string; isExpanded: boolean }[]
  itemHeight: number
  columnHeaderHeight: number
  subsectionHeaderHeight: number
  subsectionGap: number
  dropZoneMinHeight: number
}

type HandleGroupHeightProps = {
  isExpanded: boolean
  items: ItemComponent[]
  draggable?: DraggableProps
  infiniteScroll?: InfiniteScrollProps
}

export const moveItem = (
  columns: ColumnProps[],
  itemId: string,
  targetColumnId: string,
  targetSubsectionId: string,
  hoverIndex: number,
) => {
  const newColumns = [...columns]
  let item: ItemComponent | undefined
  let sourceColumnIndex = -1
  let sourceSectionIndex = -1
  let itemIndex = -1

  // Find the item
  for (let i = 0; i < newColumns.length; i++) {
    const column = newColumns[i]
    for (let j = 0; j < column.section.subsections.length; j++) {
      const section = column.section.subsections[j]
      const foundItemIndex = section.items.findIndex(
        (c) => c.props.id === itemId,
      )
      if (foundItemIndex !== -1) {
        item = section.items[foundItemIndex]
        sourceColumnIndex = i
        sourceSectionIndex = j
        itemIndex = foundItemIndex
        break
      }
    }
  }

  if (!item) return columns

  // Find target column
  const targetColumnIndex = newColumns.findIndex(
    (col) => col.id === targetColumnId,
  )

  // find target section
  const targetSectionIndex = newColumns[
    targetColumnIndex
  ].section.subsections.findIndex(
    (subsection) => subsection.id === targetSubsectionId,
  )

  if (targetSectionIndex === -1) return columns

  // Remove item from source column/section
  newColumns[sourceColumnIndex] = {
    ...newColumns[sourceColumnIndex],
    section: {
      ...newColumns[sourceColumnIndex].section,
      subsections: newColumns[sourceColumnIndex].section.subsections.map(
        (subsection, idx) =>
          idx === sourceSectionIndex
            ? {
                ...subsection,
                items: subsection.items.filter(
                  (_, index) => index !== itemIndex,
                ),
              }
            : subsection,
      ),
    },
  }

  // Insert item at the correct position in target column/section
  const targetItems = [
    ...newColumns[targetColumnIndex].section.subsections[targetSectionIndex]
      .items,
  ]
  targetItems.splice(hoverIndex, 0, item)

  newColumns[targetColumnIndex] = {
    ...newColumns[targetColumnIndex],
    section: {
      ...newColumns[targetColumnIndex].section,
      subsections: newColumns[targetColumnIndex].section.subsections.map(
        (subsection, idx) =>
          idx === targetSectionIndex
            ? { ...subsection, items: targetItems }
            : subsection,
      ),
    },
  }

  return newColumns
}

export const handleSubsectionY = (props: HandleSubsectionYProps) => {
  const { subsections, index, draggable, expandedArr } = props
  const { itemHeight, columnHeaderHeight = 0, subsectionGap = 0 } = draggable

  let y = 0

  for (let i = 0; i < index; i++) {
    y += expandedArr[i]?.isExpanded
      ? subsections[i].items.length * itemHeight +
        columnHeaderHeight +
        subsectionGap
      : columnHeaderHeight + subsectionGap
  }

  return y
}

export const handleColumnHeight = (props: HandleColumnHeightProps) => {
  const {
    section,
    expandedSubsectionArr,
    dropZoneMinHeight,
    itemHeight,
    columnHeaderHeight,
    subsectionHeaderHeight,
    subsectionGap,
  } = props

  let total = 0

  section.subsections.forEach((subsection, idx) => {
    const expanded = expandedSubsectionArr.find(
      (s) => s.id === subsection.id,
    )?.isExpanded

    let sectionContentHeight = subsection.items.length * itemHeight
    if (subsection.infiniteScroll && subsection.infiniteScroll.maxHeight) {
      sectionContentHeight = Math.min(
        subsection.infiniteScroll.maxHeight,
        subsection.items.length * itemHeight,
      )
    }

    if (expanded) {
      total += sectionContentHeight + subsectionHeaderHeight
    } else {
      total += subsectionHeaderHeight
    }
  })

  const totalSubsectionGaps = (section.subsections.length - 1) * subsectionGap

  return total + totalSubsectionGaps + columnHeaderHeight + dropZoneMinHeight
}

export const handleGroupHeight = (props: HandleGroupHeightProps) => {
  const { isExpanded, items, draggable, infiniteScroll } = props
  const { itemHeight = 0, subsectionHeaderHeight = 0 } = draggable || {}

  if (isExpanded) {
    const contentHeight = items.length * itemHeight + subsectionHeaderHeight
    if (infiniteScroll && infiniteScroll.maxHeight) {
      return `${Math.min(infiniteScroll.maxHeight + subsectionHeaderHeight, contentHeight)}px`
    }
    return `${contentHeight}px`
  }
  return `${subsectionHeaderHeight}px`
}
