import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PriorityBadge } from "@/components/priority-badge";
import { CategoryBadge } from "@/components/category-badge";
import { RoutingBadge } from "@/components/routing-badge";

export default async function TicketsPage() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tickets</h1>
          <Button render={<Link href="/tickets/new" />}>New Ticket</Button>
        </div>

        <Card>
          <CardContent>
            {tickets.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No tickets yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Routing</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="font-medium text-foreground underline-offset-4 hover:underline"
                        >
                          {ticket.subject}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <CategoryBadge category={ticket.category} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={ticket.priority} />
                          {ticket.classificationError && (
                            <span
                              title="Classification failed"
                              className="text-xs text-destructive"
                            >
                              (classification failed)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoutingBadge routing={ticket.routing} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.createdAt.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
