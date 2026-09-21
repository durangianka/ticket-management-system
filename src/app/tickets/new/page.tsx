"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTicket, type CreateTicketResult } from "./create-ticket";

const initialState: CreateTicketResult | undefined = undefined;

export default function NewTicketPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: CreateTicketResult | undefined, formData: FormData) => {
      return await createTicket(formData);
    },
    initialState,
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-4">
        <Link
          href="/tickets"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Back to tickets
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a new ticket</CardTitle>
          <CardDescription>
            Describe the issue and our system will classify and route it
            automatically.
          </CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Short summary of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the issue in detail"
                required
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachmentFilename">
                Attachment filename (optional)
              </Label>
              <Input
                id="attachmentFilename"
                name="attachmentFilename"
                placeholder="e.g. screenshot.png"
              />
              <p className="text-xs text-muted-foreground">
                Optional, filename only, no file upload in this demo.
              </p>
            </div>

            {state?.error ? (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Ticket"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Ticket will be automatically classified by AI on submission.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
