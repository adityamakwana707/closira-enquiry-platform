import { FollowUp } from "../types";

// Helper to calculate times relative to "now"
const now = new Date();
const overdue1 = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
const overdue2 = new Date(now.getTime() - 30 * 60 * 1000); // 30 mins ago
const upcoming1 = new Date(now.getTime() + 15 * 60 * 1000); // in 15 mins
const upcoming2 = new Date(now.getTime() + 2 * 60 * 60 * 1000); // in 2 hours
const done1 = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 hours ago (done)
const done2 = new Date(now.getTime() - 24 * 60 * 60 * 1000); // yesterday (done)

export const mockFollowUps: FollowUp[] = [
  {
    id: "fu_001",
    enquiryId: "enq_004",
    customer: "Kiran Desai",
    channel: "whatsapp",
    dueAt: overdue1.toISOString(),
    messagePreview: "Hi Kiran, just checking if you are still available for the 3 PM demo?",
    status: "pending",
  },
  {
    id: "fu_002",
    enquiryId: "enq_008",
    customer: "Divya Menon",
    channel: "email",
    dueAt: overdue2.toISOString(),
    messagePreview: "Hello Divya, please find attached the custom enterprise proposal as discussed.",
    status: "pending",
  },
  {
    id: "fu_003",
    enquiryId: "enq_002",
    customer: "Rahul Mehta",
    channel: "email",
    dueAt: upcoming1.toISOString(),
    messagePreview: "Hi Rahul, following up on your pricing inquiry. Do you have any further questions?",
    status: "pending",
  },
  {
    id: "fu_004",
    enquiryId: "enq_007",
    customer: "Arjun Kapoor",
    channel: "whatsapp",
    dueAt: upcoming2.toISOString(),
    messagePreview: "Hi Arjun, our annual subscriptions include a 20% discount. Would you like a payment link?",
    status: "pending",
  },
  {
    id: "fu_005",
    enquiryId: "enq_006",
    customer: "Meera Iyer",
    channel: "call",
    dueAt: done1.toISOString(),
    messagePreview: "Called to confirm the primary account holder name has been successfully updated.",
    status: "done",
  },
  {
    id: "fu_006",
    enquiryId: "enq_001",
    customer: "Priya Sharma",
    channel: "call",
    dueAt: done2.toISOString(),
    messagePreview: "Called to apologize for the delay and applied SLA breach credit to the account.",
    status: "done",
  }
];
