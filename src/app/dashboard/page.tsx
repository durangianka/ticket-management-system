import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Priority = "P1" | "P2" | "P3" | "P4" | null;
type Routing = "ANSWER_DIRECTLY" | "PLATFORM_ENGINEERING" | null;

function priorityAccentClass(priority: Priority) {
  switch (priority) {
    case "P1":
      return "text-red-600 dark:text-red-500";
    case "P2":
      return "text-orange-500 dark:text-orange-400";
    case "P3":
      return "text-yellow-600 dark:text-yellow-500";
    case "P4":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
}

export default async function DashboardPage() {
  const tickets = await prisma.ticket.findMany();

  const total = tickets.length;

  const priorityCounts: Record<string, number> = {
    P1: 0,
    P2: 0,
    P3: 0,
    P4: 0,
    Unclassified: 0,
  };
  const routingCounts: Record<string, number> = {
    ANSWER_DIRECTLY: 0,
    PLATFORM_ENGINEERING: 0,
    Unclassified: 0,
  };
  let classificationErrorCount = 0;

  for (const ticket of tickets) {
    const priorityKey = (ticket.priority as Priority) ?? "Unclassified";
    priorityCounts[priorityKey] = (priorityCounts[priorityKey] ?? 0) + 1;

    const routingKey = (ticket.routing as Routing) ?? "Unclassified";
    routingCounts[routingKey] = (routingCounts[routingKey] ?? 0) + 1;

    if (ticket.classificationError) {
      classificationErrorCount += 1;
    }
  }

  const p1Count = priorityCounts.P1;
  const engineeringCount = routingCounts.PLATFORM_ENGINEERING;
  const answerDirectlyCount = routingCounts.ANSWER_DIRECTLY;

  const nextSteps: string[] = [];

  if (p1Count > 0) {
    nextSteps.push(
      `⚠ ${p1Count} P1 ticket${p1Count === 1 ? "" : "s"} need${p1Count === 1 ? "s" : ""} immediate attention. Review before anything else.`
    );
  }
  if (classificationErrorCount > 0) {
    nextSteps.push(
      `${classificationErrorCount} ticket${classificationErrorCount === 1 ? "" : "s"} failed automatic classification. Classify manually.`
    );
  }
  if (engineeringCount > 0) {
    nextSteps.push(
      `${engineeringCount} ticket${engineeringCount === 1 ? "" : "s"} ${engineeringCount === 1 ? "is" : "are"} waiting on the platform/engineering team.`
    );
  }
  if (answerDirectlyCount > 0) {
    nextSteps.push(
      `${answerDirectlyCount} ticket${answerDirectlyCount === 1 ? "" : "s"} can likely be answered directly without escalation.`
    );
  }
  if (nextSteps.length === 0) {
    nextSteps.push("No tickets need attention right now.");
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            An at-a-glance overview of ticket volume and what needs attention.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets" className={buttonVariants({ variant: "outline" })}>
            View all tickets
          </Link>
          <Link href="/tickets/new" className={buttonVariants({ variant: "default" })}>
            Create ticket
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Tickets</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>P1 Tickets</CardDescription>
            <CardTitle
              className={`text-3xl ${priorityAccentClass("P1")}`}
            >
              {p1Count}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Needs Engineering</CardDescription>
            <CardTitle className="text-3xl">{engineeringCount}</CardTitle>
          </CardHeader>
        </Card>

        {classificationErrorCount > 0 && (
          <Card>
            <CardHeader>
              <CardDescription>Classification Failures</CardDescription>
              <CardTitle className="text-3xl text-red-600 dark:text-red-500">
                {classificationErrorCount}
              </CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suggested Next Steps</CardTitle>
          <CardDescription>
            Generated from current ticket counts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
