export default function TicketDetailLoading() {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl space-y-4 rounded-lg border p-6">
        <div className="h-6 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex gap-2 pt-4">
          <div className="h-8 w-20 rounded bg-muted animate-pulse" />
          <div className="h-8 w-20 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
