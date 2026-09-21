"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { classifyTicket } from "@/lib/classify-ticket";

export interface CreateTicketResult {
  error: string;
}

export async function createTicket(
  formData: FormData,
): Promise<CreateTicketResult | undefined> {
  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const description =
    (formData.get("description") as string | null)?.trim() ?? "";
  const attachmentFilename =
    (formData.get("attachmentFilename") as string | null)?.trim() ?? "";

  if (!subject || !description) {
    return { error: "Subject and description are both required." };
  }

  const classification = await classifyTicket(subject, description);

  const ticket = await prisma.ticket.create({
    data: {
      subject,
      description,
      attachmentFilename: attachmentFilename || null,
      ...(classification
        ? {
            category: classification.category,
            priority: classification.priority,
            routing: classification.routing,
            recommendedNextAction: classification.recommendedNextAction,
            classificationError: false,
          }
        : {
            classificationError: true,
          }),
    },
  });

  redirect(`/tickets/${ticket.id}`);
}
