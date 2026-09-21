export default function TicketsLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="h-8 w-48 rounded bg-muted animate-pulse" />
      <div className="rounded-md border">
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/6 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/6 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
