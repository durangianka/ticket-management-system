import { Badge } from "@/components/ui/badge";
import { Category } from "@prisma/client";

const labels: Record<Category, string> = {
  INCIDENT: "Incident",
  BUG: "Bug",
  FEATURE_REQUEST: "Feature Request",
  ACCOUNT_BILLING: "Account/Billing",
  ACCESS: "Access",
  QUESTION: "Question",
};

export function CategoryBadge({ category }: { category: Category | null }) {
  if (!category) {
    return <Badge variant="outline">Unclassified</Badge>;
  }

  return <Badge variant="outline">{labels[category]}</Badge>;
}
