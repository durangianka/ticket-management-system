import { Badge } from "@/components/ui/badge";
import { Routing } from "@prisma/client";
import { cn } from "cn";

export function RoutingBadge({ routing }: { routing: Routing | null }) {
  if (!routing) {
    return <Badge variant="secondary">Unclassified</Badge>;
  }

  if (routing === "PLATFORM_ENGINEERING") {
    return (
      <Badge
        className={cn(
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
        )}
      >
        Platform/Engineering
      </Badge>
    );
  }

  return <Badge variant="secondary">Answer Directly</Badge>;
}
