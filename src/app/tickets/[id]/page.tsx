import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/priority-badge";
import { CategoryBadge } from "@/components/category-badge";
import { RoutingBadge } from "@/components/routing-badge";
import { ClassificationEditor } from "./classification-editor";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });

  if (!ticket) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardContent>
              <p className="py-8 text-center text-muted-foreground">
                Ticket not found.
              </p>
              <div className="flex justify-center pb-4">
                <Link
                  href="/tickets"
                  className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Back to tickets
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4">
          <Link
            href="/tickets"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            &larr; Back to tickets
          </Link>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-6">
            {ticket.classificationError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                Automatic classification failed for this ticket — please
                classify manually below.
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {ticket.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={ticket.category} />
                <PriorityBadge priority={ticket.priority} />
                <RoutingBadge routing={ticket.routing} />
              </div>
              {ticket.attachmentFilename && (
                <div className="w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {"📎"} {ticket.attachmentFilename}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-sm font-semibold text-foreground">
                Description
              </h2>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {ticket.description}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-sm font-semibold text-foreground">
                Recommended Next Action
              </h2>
              {ticket.recommendedNextAction ? (
                <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                  {ticket.recommendedNextAction}
                </div>
              ) : (
                <div className="rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
                  No recommendation available.
                </div>
              )}
            </div>

            <ClassificationEditor
              ticketId={ticket.id}
              category={ticket.category}
              priority={ticket.priority}
              routing={ticket.routing}
            />

            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
              <span>
                Created{" "}
                {ticket.createdAt.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <span>
                Updated{" "}
                {ticket.updatedAt.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
