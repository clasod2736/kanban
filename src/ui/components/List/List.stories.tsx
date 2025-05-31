import type { Meta, StoryObj } from '@storybook/react'

import { List } from '.'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'UI/List',
  component: List,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="p-4" style={{ height: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const GroupingList: Story = {
  args: {
    title: '1234',
    items: [
      {
        span: 6,
        mdSpan: 6,
        lgSpan: 6,
        component: 'WorkflowTile',
        props: {
          title: '1234',
          id: '1234',
          isSelected: true,
          description: 'hello',
          handleClick: () => {},
        },
      },
      {
        span: 6,
        mdSpan: 6,
        lgSpan: 6,
        component: 'WorkflowTile',
        props: {
          title: '1234',
          id: '1234',
          isSelected: true,
          description: 'hello',
          handleClick: () => {},
        },
      },
      {
        span: 6,
        mdSpan: 6,
        lgSpan: 6,
        component: 'WorkflowTile',
        props: {
          title: '1234',
          id: '1234',
          isSelected: true,
          description: 'hello',
          handleClick: () => {},
        },
      },
    ],
  },
}

export const ContactList: Story = {
  args: {
    title: '1234',
    items: [
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ContactTile',
        props: {
          unReadMessages: 1,
          isSelected: true,
          lastMessage: 'hello',
          id: '1234',
          name: 'Av',
        },
      },
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ContactTile',
        props: {
          unReadMessages: 1,
          isSelected: true,
          lastMessage: 'hello',
          id: '1234',
          name: 'Av',
        },
      },
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ContactTile',
        props: {
          unReadMessages: 1,
          isSelected: true,
          lastMessage: 'hello',
          id: '1234',
          name: 'Av',
        },
      },
    ],
  },
}

export const EmptyContactList: Story = {
  args: {
    title: '1234',
    items: [],
    empty: {
      enabled: true,
      message: 'Empty State',
      action: {
        label: 'Click Me!',
      },
    },
  },
}

export const InfiniteScroll: Story = {
  args: {
    title: '1234',
    infiniteScroll: {
      direction: 'down',
      isEnabled: true,
      handleLoadMoreItems: () => {},
    },
    items: [
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ContactTile',
        props: {
          unReadMessages: 1,
          isSelected: true,
          lastMessage: 'hello',
          id: '1234',
          name: 'Av',
        },
      },
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ContactTile',
        props: {
          unReadMessages: 1,
          isSelected: true,
          lastMessage: 'hello',
          id: '1234',
          name: 'Av',
        },
      },
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ContactTile',
        props: {
          unReadMessages: 1,
          isSelected: true,
          lastMessage: 'hello',
          id: '1234',
          name: 'Avin Chadee',
        },
      },
    ],
  },
}

export const BatchJob: Story = {
  args: {
    title: '1234',
    search: {
      type: 'text',
      id: '12345',
    },
    infiniteScroll: {
      direction: 'down',
      isEnabled: true,
      handleLoadMoreItems: () => {},
    },
    tabs: {
      defaultValue: 'all',
      onValueChange: () => {},
      items: [
        {
          label: 'All (101)',
          value: 'all',
        },
        {
          label: 'Pending (5)',
          value: 'pending',
        },
        {
          label: 'Completed (17)',
          value: 'completed',
        },
      ],
    },
    items: [
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ActionTile',
        props: {
          id: 'action',
          isSelected: false,
          header: 'To: Avin',
          statusChips: [],
          actions: [
            {
              label: 'Send',
              leftIcon: 'Send',
            },
            {
              label: 'Edit',
              leftIcon: 'Pencil',
            },
          ],
          description:
            'Missing Context/Providers: You can use decorators to supply specific contexts or providers, which are sometimes necessary for components to render correctly. For detailed instructions on using decorators, please visit the Decorators documentation.',
        },
      },
      {
        span: 12,
        mdSpan: 12,
        lgSpan: 12,
        component: 'ActionTile',
        props: {
          id: 'action',
          isSelected: false,
          header: 'To: Avin',
          statusChips: [],
          actions: [
            {
              label: 'Send',
              leftIcon: 'Send',
            },
            {
              label: 'Edit',
              leftIcon: 'Pencil',
            },
          ],
          description:
            'Missing Context/Providers: You can use decorators to supply specific contexts or providers, which are sometimes necessary for components to render correctly. For detailed instructions on using decorators, please visit the Decorators documentation.',
        },
      },
    ],
  },
}

export const Skeleton: Story = {
  args: {
    title: '1234',
    isSkeleton: true,
    items: [],
  },
}
