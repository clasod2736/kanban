'use client'

import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'

import { cn } from '../../../lib/utils'
import Icon, { iconTypes } from '../Icon'

export type MenuItem = {
  label: string
  href?: string
  icon?: iconTypes
  items?: MenuItem[]
  description?: string
}

export interface ItemProps
  extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
  items: MenuItem[]
}

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  ItemProps
>(({ className, items, ...props }, ref) => {
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn(
        'relative z-10 flex max-w-max flex-1 items-center justify-center',
        className,
      )}
      {...props}
    >
      <NavigationMenuList>
        {items &&
          items.length > 0 &&
          items.map((item, i) => (
            <div key={i}>
              {!item.items || item.items.length == 0 ? (
                <NavigationMenuLink
                  href={item.href}
                  className={navigationMenuTriggerStyle()}
                >
                  {item.label}
                </NavigationMenuLink>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">
                      {item.items?.map((subItem, index) => (
                        <ListItem
                          icon={subItem.icon as iconTypes}
                          key={index}
                          href={subItem.href}
                          title={subItem.label}
                        >
                          {subItem.description || ''}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </div>
          ))}
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  )
})
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className,
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center font-semibold justify-center rounded-md bg-transparent px-4 py-2 text-base transition-colors text-accent-foreground/80 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/30 cursor-pointer',
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <Icon
      name="ChevronDown"
      className="relative top-[1px] ml-1 h-4 w-4 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon: iconTypes }
>(({ className, title, icon, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block h-20 w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          href={href}
          {...props}
        >
          <div className="flex gap-3 h-full items-center">
            {icon && (
              <div className="flex items-center max-w-6 max-h-6">
                <Icon name={icon} className="w-6 h-6" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="text-md font-semibold leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
