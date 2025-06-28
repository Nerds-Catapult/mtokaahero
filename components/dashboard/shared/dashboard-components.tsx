import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface DashboardHeaderProps {
  title: string
  description: string
  userName?: string
}

export function DashboardHeader({ title, description, userName }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">
        {title} {userName && <span className="text-muted-foreground">- {userName}</span>}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

interface ChartSectionProps {
  title: string
  description: string
  children: ReactNode
  className?: string
}

export function ChartSection({ title, description, children, className }: ChartSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
