'use client'

import { useEffect, useState } from "react";
import SignInButton from "@/ui/components/SignInTest";
import { KanbanBoard, type KanbanBoardProps } from "@/ui/components/Kanban";
import { type ColumnProps } from "@/ui/components/Kanban/Column";
import { type ItemComponent } from "@/ui/components/List";

import { moveItem } from "@/ui/components/Kanban/utils/index";

const addItem = (columns: ColumnProps[], columnId: string): ColumnProps[] => {
  const newItemId = `item-${Date.now()}`
  const newItem: ItemComponent = {
    id: newItemId,
    span: 12,
    mdSpan: 12,
    lgSpan: 12,
    component: 'KanbanTile',
    props: {
      id: newItemId,
      title: 'New Item',
      description: 'Description for new item',
    },
  }

  return columns.map((column) => {
    if (column.id === columnId) {
      return {
        ...column,
        list: {
          ...column.section,
          subsections: [
            {
              ...column.section.subsections[0],
              items: [...column.section.subsections[0].items, newItem],
            },
          ],
        },
      }
    }
    return column
  })
}

const moveColumn = (
  columns: ColumnProps[],
  dragIndex: number,
  hoverIndex: number,
): ColumnProps[] => {
  const newColumns = [...columns]
  const draggedColumn = newColumns[dragIndex]
  newColumns.splice(dragIndex, 1)
  newColumns.splice(hoverIndex, 0, draggedColumn)
  return newColumns
}

const deleteColumn = (
  columns: ColumnProps[],
  columnId: string,
): ColumnProps[] => {
  return columns.filter((column) => column.id !== columnId)
}

const deleteItem = (columns: ColumnProps[], itemId: string): ColumnProps[] => {
  return columns.map((column) => ({
    ...column,
    list: {
      ...column.section,
      sections: [
        {
          ...column.section.subsections[0],
          items: column.section.subsections[0].items.filter(
            (item) => item.id !== itemId,
          ),
        },
      ],
    },
  }))
}

const initialKanbanBoard: KanbanBoardProps = {
  isLoading: false,
  columns: [
    {
      id: 'todo',
      itemHeight: 80,
      header: {
        title: 'To Do',
        actions: [
          {
            leftIcon: 'Plus',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
            tooltipLabel: 'Add New Item',
          },
          {
            leftIcon: 'Trash',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
            tooltipLabel: 'Delete Column',
          },
        ],
      },
      section: {
        title: 'To Do',
        subsections: [
          {
            id: 'kanban',
            title: 'kanban',
            items: [
              {
                id: '1',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '1',
                  title: 'John Doe',
                  description: 'Sales progressing in',
                },
              },
              {
                id: '22',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '22',
                  title: 'Jessica',
                  description: 'Sales progress and in progress end',
                },
              },
            ],
          },
        ],
      },
    },
    {
      id: 'in-progress',
      itemHeight: 80,
      header: {
        title: 'In Progress',
        actions: [
          {
            leftIcon: 'Plus',
            tooltipLabel: 'Add New Item',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
          },
          {
            leftIcon: 'Trash',
            tooltipLabel: 'Delete Column',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
          },
        ],
      },
      section: {
        title: 'In Progress',
        subsections: [
          {
            id: 'in-progress',
            title: 'In Progress',
            items: [
              {
                id: '2',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '2',
                  title: 'Task 2',
                  description: 'Description for task 2',
                },
              },
              {
                id: '3',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '3',
                  title: 'Task 3',
                  description: 'Description for task 3',
                },
              },
              {
                id: '4',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '4',
                  title: 'Task 4',
                  description: 'Description for task 4',
                },
              },
            ],
          },
          {
            id: 'backlog4',
            title: 'Backlog4',
            items: [
              {
                id: '19',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '19',
                  title: 'Task 3',
                  description: 'Description for task 3',
                },
              },
              {
                id: '20',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '20',
                  title: 'Task 4',
                  description: 'Description for task 4',
                },
              },
              {
                id: '21',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '21',
                  title: 'Task 5',
                  description: 'Description for task 4',
                },
              },
            ],
          },
        ],
      },
    },
    {
      id: 'done',
      itemHeight: 80,
      header: {
        title: 'Done',
        actions: [
          {
            leftIcon: 'Plus',
            tooltipLabel: 'Add New Item',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
          },
          {
            leftIcon: 'Trash',
            tooltipLabel: 'Delete Column',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
          },
        ],
      },
      section: {
        title: 'Done',
        subsections: [
          {
            id: 'done',
            title: 'Done',
            items: [
              {
                id: '5',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '5',
                  title: 'Task 3',
                  description: 'Description for task 3',
                },
              },
              {
                id: '6',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '6',
                  title: 'Task 4',
                  description: 'Description for task 4',
                },
              },
              {
                id: '7',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '7',
                  title: 'Task 5',
                  description: 'Description for task 5',
                },
              },
              {
                id: '8',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '8',
                  title: 'Task 6',
                  description: 'Description for task 6',
                },
              },
              {
                id: '9',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '9',
                  title: 'Task 7',
                  description: 'Description for task 7',
                },
              },
            ],
          },
        ],
      },
    },
    {
      id: 'backlog',
      itemHeight: 80,
      header: {
        title: 'Backlog',
        actions: [
          {
            leftIcon: 'Plus',
            tooltipLabel: 'Add New Item',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
          },
          {
            leftIcon: 'Trash',
            tooltipLabel: 'Delete Column',
            handleClick: () => {},
            variant: 'ghost',
            size: 'lg',
          },
        ],
      },
      section: {
        title: 'Backlog',
        subsections: [
          {
            id: 'backlog',
            title: 'Backlog',
            items: [
              {
                id: '10',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '10',
                  title: 'Task 3',
                  description: 'Description for task 3',
                },
              },
              {
                id: '11',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '11',
                  title: 'Task 4',
                  description: 'Description for task 4',
                },
              },
              {
                id: '12',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '12',
                  title: 'Task 5',
                  description: 'Description for task 4',
                },
              },
            ],
          },
          {
            id: 'backlog2',
            title: 'Backlog2',
            items: [
              {
                id: '13',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '13',
                  title: 'Task 3',
                  description: 'Description for task 3',
                },
              },
              {
                id: '14',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '14',
                  title: 'Task 4',
                  description: 'Description for task 4',
                },
              },
              {
                id: '15',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '15',
                  title: 'Task 5',
                  description: 'Description for task 4',
                },
              },
            ],
          },
          {
            id: 'backlog3',
            title: 'Backlog3',
            infiniteScroll: {
              direction: 'down',
              maxHeight: 150,
              handleLoadMoreItems: () => {},
              isEnabled: true,
            },
            items: [
              {
                id: '16',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '16',
                  title: 'Task 3',
                  description: 'Description for task 3',
                },
              },
              {
                id: '17',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '17',
                  title: 'Task 4',
                  description: 'Description for task 4',
                },
              },
              {
                id: '18',
                span: 12,
                mdSpan: 12,
                lgSpan: 12,
                component: 'KanbanTile',
                props: {
                  id: '18',
                  title: 'Task 5',
                  description: 'Description for task 4',
                },
              },
            ],
          },
        ],
      },
    },
  ],
}

export default function LandingPage() {
  const [columns, setColumns] = useState<ColumnProps[]>(initialKanbanBoard.columns)

  useEffect(() => {
    setColumns(initialKanbanBoard.columns)
  }, [initialKanbanBoard.columns])

  const handleMoveItem = (
    id: string,
    hoverColumnId: string,
    hoverSubsectionId: string,
    hoverIndex: number,
  ) => {
    const newColumns = moveItem(
      columns,
      id,
      hoverColumnId,
      hoverSubsectionId,
      hoverIndex,
    )
    setColumns(newColumns)
  }

  return (
    <div className="flex flex-col p-4 w-full">
      {/* <SignInButton /> */}
      <div className="h-screen w-full">
        <KanbanBoard 
        columns={columns}
        handleMoveItem={handleMoveItem}
        />
      </div>
    </div>
  )
}
