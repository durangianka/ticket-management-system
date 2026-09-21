"use client";

import { useState, useTransition } from "react";
import { Category, Priority, Routing } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateClassification } from "./update-classification";

const categoryOptions: { value: Category; label: string }[] = [
  { value: "INCIDENT", label: "Incident" },
  { value: "BUG", label: "Bug" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "ACCOUNT_BILLING", label: "Account/Billing" },
  { value: "ACCESS", label: "Access" },
  { value: "QUESTION", label: "Question" },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "P1", label: "P1" },
  { value: "P2", label: "P2" },
  { value: "P3", label: "P3" },
  { value: "P4", label: "P4" },
];

const routingOptions: { value: Routing; label: string }[] = [
  { value: "ANSWER_DIRECTLY", label: "Answer Directly" },
  { value: "PLATFORM_ENGINEERING", label: "Platform/Engineering" },
];

export function ClassificationEditor({
  ticketId,
  category,
  priority,
  routing,
}: {
  ticketId: string;
  category: Category | null;
  priority: Priority | null;
  routing: Routing | null;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category ?? ""
  );
  const [selectedPriority, setSelectedPriority] = useState<string>(
    priority ?? ""
  );
  const [selectedRouting, setSelectedRouting] = useState<string>(
    routing ?? ""
  );
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function handleSave() {
    setStatus("idle");
    startTransition(async () => {
      const result = await updateClassification(ticketId, {
        category: selectedCategory,
        priority: selectedPriority,
        routing: selectedRouting,
      });
      setStatus(result.success ? "saved" : "error");
    });
  }

  return (
    <div className="rounded-lg border border-border p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Manual Override
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-select">Category</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value ?? "")}
          >
            <SelectTrigger id="category-select" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priority-select">Priority</Label>
          <Select
            value={selectedPriority}
            onValueChange={(value) => setSelectedPriority(value ?? "")}
          >
            <SelectTrigger id="priority-select" className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="routing-select">Routing</Label>
          <Select
            value={selectedRouting}
            onValueChange={(value) => setSelectedRouting(value ?? "")}
          >
            <SelectTrigger id="routing-select" className="w-full">
              <SelectValue placeholder="Select routing" />
            </SelectTrigger>
            <SelectContent>
              {routingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={
            isPending ||
            !selectedCategory ||
            !selectedPriority ||
            !selectedRouting
          }
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
        {status === "saved" && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="text-sm text-destructive">
            Could not save. Check the selected values.
          </span>
        )}
      </div>
    </div>
  );
}
