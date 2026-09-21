import { Badge } from "@/components/ui/badge";
import { Priority } from "@prisma/client";
import { cn } from "cn";

export function PriorityBadge({ priority }: { priority: Priority | null }) {
  if (!priority) {
    return <Badge variant="secondary">Unclassified</Badge>;
  }

  const styles: Record<Priority, string> = {
    P1: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    P2: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    P3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
    P4: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };

  return <Badge className={cn(styles[priority])}>{priority}</Badge>;
}
