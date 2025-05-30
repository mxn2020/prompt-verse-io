import { cn } from "@/lib/utils";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
  className,
  ...props
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row items-start md:items-center justify-between", className)} {...props}>
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
      {children && (
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
}