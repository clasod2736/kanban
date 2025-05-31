import * as React from 'react'
import { Button, type ButtonProps } from '../Button'
import { cn } from '../../../lib/utils'

export type InfiniteScrollProps = {
  id?: string
  className?: string
  maxHeight?: number
  direction: 'up' | 'down'
  children?: React.ReactNode
  handleLoadMoreItems: () => void
  action?: ButtonProps
  isEnabled: boolean
  style?: React.CSSProperties
}

const InfiniteScroll = ({
  id,
  className,
  maxHeight,
  direction,
  children,
  handleLoadMoreItems,
  action,
  isEnabled,
  style,
}: InfiniteScrollProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const [isScrollable, setIsScrollable] = React.useState(false)

  React.useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const checkScrollable = () => {
      if (element.scrollHeight > element.clientHeight) setIsScrollable(true)
      else setIsScrollable(false)
    }

    //check scrollable first before excute event listener
    checkScrollable()

    const handleScroll = () => {
      checkScrollable()
    }

    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => {
        element.removeEventListener('scroll', handleScroll)
      }
    }
  }, [children])

  const handleScrollEvent = (target: HTMLDivElement) => {
    switch (direction) {
      case 'down':
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1)
          handleLoadMoreItems && handleLoadMoreItems()
        break
      case 'up':
        if (target.scrollTop < 1) handleLoadMoreItems && handleLoadMoreItems()
        break
    }
  }

  return (
    <div
      ref={scrollRef}
      onScroll={(ev) => handleScrollEvent(ev.target as HTMLDivElement)}
      className={cn(
        'flex flex-col w-full overflow-y-auto gap-1 col-span-12 grow',
        'scrollbar-padding',
        className,
      )}
      title={`${id}-infinite-scroll`}
      style={{
        maxHeight: maxHeight ? `${maxHeight}px` : '',
      }}
    >
      {children}
      {!isScrollable && action && isEnabled && (
        <div className="flex justify-center" style={style}>
          <Button
            {...action}
            variant="ghost"
            handleClick={handleLoadMoreItems}
            className="mt-2"
          />
        </div>
      )}
    </div>
  )
}

InfiniteScroll.displayName = 'InfiniteScroll'

export { InfiniteScroll }
