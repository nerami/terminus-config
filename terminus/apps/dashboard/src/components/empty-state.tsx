import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="m-6 max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{body}</CardContent>
    </Card>
  )
}
