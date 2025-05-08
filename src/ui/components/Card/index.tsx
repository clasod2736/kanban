import { Button, ButtonProps } from "@/ui/components/Button";
import { type LayoutComponent, Layout } from "../Layout";
import { cn } from "@/lib/utils";

export interface CardProps {
  id: string;
  className?: string
  isLoading?: boolean
  header?: {
    className?: string
    title: string;
    description: string;
  }
  content: {
    className?: string
    sections: {
      id?: string
      fields: LayoutComponent[]
      className?: string
    }[]
  },
  footer: {
    className?: string
    layout: "horizontal" | "vertical"
    contentPosition: "left" | "right" | 'center'
    actions: ButtonProps[]
  }
}

const CardComponent = (props: CardProps) => {
  const {
    id,
    className,
    header,
    content,
    footer,
    isLoading,
  } = props;

  return (
    <Card id={id} className={cn('w-full', className)}>
      {header && !isLoading && <CardHeader className={cn(header.className)}>
         <CardTitle>{header.title}</CardTitle>
         <CardDescription>{header.description}</CardDescription>
      </CardHeader>}
      <CardContent className={cn(content.className)}>
        {content.sections.map((section, i) => (
          <div key={i} className={cn( section.className )}>
            <Layout fields={section.fields} />
          </div>
        ))}
      </CardContent>
      <CardFooter className={cn(footer.className, {
        'flex flex-row': footer.layout === 'horizontal',
        'flex flex-col': footer.layout === 'vertical',
        'justify-start': footer.contentPosition === 'left',
        'justify-end': footer.contentPosition === 'right',
        'justify-center': footer.contentPosition === 'center',
      })}>
        {footer.actions.map((action, i) => (
          <Button key={i} {...action} />
        ))}
      </CardFooter>
    </Card>
  )
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export default CardComponent;
