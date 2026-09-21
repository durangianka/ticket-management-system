import { PrismaClient, Category, Priority, Routing } from "@prisma/client";

const prisma = new PrismaClient();

// Mock ticket data provided for demo purposes. Classification fields below
// are pre-assigned (matching what the Claude classifier is expected to
// produce) so the UI has realistic data without spending API calls on seed.
// Tickets created through the app itself still go through live classification.
const mockTickets = [
  {
    subject: "URGENT: Production API returning 500 errors across all endpoints",
    description:
      "Since 14:30 UTC our main API gateway is returning 500 errors. Approximately 2,000 customers affected. Revenue impact estimated at €15k/hour. Engineering team has been paged.",
    attachmentFilename: null,
    category: Category.INCIDENT,
    priority: Priority.P1,
    routing: Routing.PLATFORM_ENGINEERING,
    recommendedNextAction:
      "Escalate immediately to on-call platform engineering; this is a live revenue-impacting outage affecting all endpoints.",
  },
  {
    subject: "Can't export CSV from dashboard",
    description:
      "When I click the export button on the analytics dashboard, nothing happens. Chrome console shows a CORS error. This has been happening since the last deploy on Friday.",
    attachmentFilename: "screenshot_cors_error.png",
    category: Category.BUG,
    priority: Priority.P2,
    routing: Routing.PLATFORM_ENGINEERING,
    recommendedNextAction:
      "Likely a CORS regression introduced in Friday's deploy; route to engineering to check the export endpoint's CORS headers.",
  },
  {
    subject: "Request: Add dark mode to the mobile app",
    description:
      "Several enterprise customers have asked about dark mode support for the iOS and Android apps. Not urgent but would be good for the next release.",
    attachmentFilename: null,
    category: Category.FEATURE_REQUEST,
    priority: Priority.P4,
    routing: Routing.ANSWER_DIRECTLY,
    recommendedNextAction:
      "Acknowledge the request and add to product backlog for a future mobile release; no immediate action needed.",
  },
  {
    subject: "Data discrepancy in billing invoices",
    description:
      "Customer Acme Corp reports their March invoice shows 340 seats but they only have 280 active users. Finance team needs to investigate before end of quarter. Customer is escalating to their VP.",
    attachmentFilename: "acme_invoice_march.pdf",
    category: Category.ACCOUNT_BILLING,
    priority: Priority.P2,
    routing: Routing.ANSWER_DIRECTLY,
    recommendedNextAction:
      "Pull Acme Corp's seat usage report and reconcile against the invoice; respond to the customer before their VP escalation lands.",
  },
  {
    subject: "New employee onboarding — access provisioning",
    description:
      "Hi, we have 12 new hires starting Monday. Need accounts provisioned with standard access. Names and roles attached.",
    attachmentFilename: "new_hires_april.xlsx",
    category: Category.ACCESS,
    priority: Priority.P3,
    routing: Routing.ANSWER_DIRECTLY,
    recommendedNextAction:
      "Provision standard access for the 12 new hires ahead of Monday's start date using the attached names/roles list.",
  },
  {
    subject: "SSO login broken after IdP certificate rotation",
    description:
      "After rotating our SAML certificate this morning, no users can log in via SSO. 500+ employees locked out. Workaround is direct login but most users don't have passwords set.",
    attachmentFilename: null,
    category: Category.INCIDENT,
    priority: Priority.P1,
    routing: Routing.PLATFORM_ENGINEERING,
    recommendedNextAction:
      "Route to platform engineering immediately to fix the SAML certificate configuration; 500+ users are locked out with no viable workaround.",
  },
  {
    subject: "Question about API rate limits for batch processing",
    description:
      "We're building an integration that needs to process ~50k records daily. Current rate limit is 100 req/min. Can we get an increase or is there a batch endpoint we should use instead?",
    attachmentFilename: "integration_architecture.pdf",
    category: Category.QUESTION,
    priority: Priority.P3,
    routing: Routing.ANSWER_DIRECTLY,
    recommendedNextAction:
      "Point the customer to the batch/bulk endpoint if one exists, or discuss a rate limit increase for their integration use case.",
  },
  {
    subject: "Performance regression in search after v4.2 release",
    description:
      "Search queries that used to return in <200ms are now taking 3-5 seconds. Affects the main product search bar. Customer-facing. Our APM shows the issue started exactly after the v4.2 deploy.",
    attachmentFilename: "apm_trace_search.png",
    category: Category.BUG,
    priority: Priority.P1,
    routing: Routing.PLATFORM_ENGINEERING,
    recommendedNextAction:
      "Route to engineering to bisect the v4.2 release for the search performance regression; customer-facing latency spike from <200ms to 3-5s.",
  },
];

async function main() {
  console.log(`Seeding ${mockTickets.length} tickets...`);
  for (const ticket of mockTickets) {
    await prisma.ticket.create({ data: ticket });
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
