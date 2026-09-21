"use server";

import { prisma } from "@/lib/prisma";
import { Category, Priority, Routing } from "@prisma/client";
import { revalidatePath } from "next/cache";

type ClassificationInput = {
  category: string;
  priority: string;
  routing: string;
};

export async function updateClassification(
  ticketId: string,
  data: ClassificationInput
) {
  const category = Object.values(Category).includes(data.category as Category)
    ? (data.category as Category)
    : null;
  const priority = Object.values(Priority).includes(data.priority as Priority)
    ? (data.priority as Priority)
    : null;
  const routing = Object.values(Routing).includes(data.routing as Routing)
    ? (data.routing as Routing)
    : null;

  if (!category || !priority || !routing) {
    return { success: false as const, error: "Invalid classification value." };
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { category, priority, routing },
  });

  revalidatePath(`/tickets/${ticketId}`, "page");

  return { success: true as const };
}
