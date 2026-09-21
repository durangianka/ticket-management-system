import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ticket Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Scaffold ready.</p>
        </CardContent>
      </Card>
    </div>
  );
}
