import Anthropic from "@anthropic-ai/sdk";
import type { Category, Priority, Routing } from "@prisma/client";

const CATEGORY_VALUES: Category[] = [
  "INCIDENT",
  "BUG",
  "FEATURE_REQUEST",
  "ACCOUNT_BILLING",
  "ACCESS",
  "QUESTION",
];

const PRIORITY_VALUES: Priority[] = ["P1", "P2", "P3", "P4"];

const ROUTING_VALUES: Routing[] = ["ANSWER_DIRECTLY", "PLATFORM_ENGINEERING"];

export interface TicketClassification {
  category: Category;
  priority: Priority;
  routing: Routing;
  recommendedNextAction: string;
}

const CLASSIFY_TOOL_NAME = "classify_ticket";

function isValidClassification(value: unknown): value is TicketClassification {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.category === "string" &&
    CATEGORY_VALUES.includes(v.category as Category) &&
    typeof v.priority === "string" &&
    PRIORITY_VALUES.includes(v.priority as Priority) &&
    typeof v.routing === "string" &&
    ROUTING_VALUES.includes(v.routing as Routing) &&
    typeof v.recommendedNextAction === "string" &&
    v.recommendedNextAction.trim().length > 0
  );
}

/**
 * Classifies a support ticket using Claude. Returns null when classification
 * is unavailable (no API key configured) or if anything goes wrong - callers
 * must treat null as "store the ticket with classificationError: true" and
 * must never let this function throw.
 */
export async function classifyTicket(
  subject: string,
  description: string,
): Promise<TicketClassification | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system:
        "You are a support-ticket triage assistant for a software platform. " +
        "Classify the given ticket by calling the classify_ticket tool exactly once. " +
        "category: INCIDENT (active outage/degradation), BUG (defect in existing behavior), " +
        "FEATURE_REQUEST (new capability), ACCOUNT_BILLING (billing/subscription/invoices), " +
        "ACCESS (login/permissions/access issues), QUESTION (general how-to/informational). " +
        "priority: P1 is most urgent (e.g. outage, data loss, security), P4 is least urgent. " +
        "routing: ANSWER_DIRECTLY if a support rep can resolve it without engineering help, " +
        "PLATFORM_ENGINEERING if it requires the engineering/platform team. " +
        "recommendedNextAction: a short, common-sense 1-2 sentence suggestion for what to do next.",
      messages: [
        {
          role: "user",
          content: `Subject: ${subject}\n\nDescription: ${description}`,
        },
      ],
      tool_choice: { type: "tool", name: CLASSIFY_TOOL_NAME },
      tools: [
        {
          name: CLASSIFY_TOOL_NAME,
          description: "Record the classification for a support ticket.",
          input_schema: {
            type: "object",
            properties: {
              category: { type: "string", enum: CATEGORY_VALUES },
              priority: { type: "string", enum: PRIORITY_VALUES },
              routing: { type: "string", enum: ROUTING_VALUES },
              recommendedNextAction: { type: "string" },
            },
            required: [
              "category",
              "priority",
              "routing",
              "recommendedNextAction",
            ],
            additionalProperties: false,
          },
        },
      ],
    });

    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );

    if (!toolUseBlock || !isValidClassification(toolUseBlock.input)) {
      console.error(
        "classifyTicket: no valid tool_use classification block in response",
      );
      return null;
    }

    return toolUseBlock.input;
  } catch (error) {
    console.error(
      "classifyTicket: Claude classification failed:",
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}
