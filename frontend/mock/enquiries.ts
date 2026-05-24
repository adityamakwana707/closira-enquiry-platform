import { Enquiry } from "../types";

export const mockEnquiries: Enquiry[] = [
  {
    id: "enq_001",
    customer: "Priya Sharma",
    channel: "whatsapp",
    status: "escalated",
    urgency: "high",
    message: "I have been waiting 3 days for someone to respond and this is completely unacceptable. I need to speak to a manager now.",
    receivedAt: "2025-05-23T09:14:00Z",
    matchedSOP: "Complaint",
    escalationReason: "Customer expressed strong dissatisfaction with response delays. SLA breached by 3 days.",
    summary: "Long-standing customer frustrated over delayed response. Requested senior intervention. SLA breach confirmed.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "Hi, I submitted a complaint 3 days ago and no one has responded. This is really disappointing.",
        timestamp: "2025-05-23T09:14:00Z"
      },
      {
        id: "m2", sender: "ai",
        content: "Hi Priya, I'm so sorry to hear about your experience. I've flagged this as urgent and a team member will reach out to you within the next 2 hours.",
        timestamp: "2025-05-23T09:14:45Z"
      },
      {
        id: "m3", sender: "customer",
        content: "I have heard that before. I want to speak to a manager directly, not an automated reply.",
        timestamp: "2025-05-23T09:20:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via WhatsApp",
        createdAt: "2025-05-23T09:14:00Z"
      },
      {
        id: "t2", eventType: "sop_matched",
        description: "Matched SOP: Complaint",
        createdAt: "2025-05-23T09:14:05Z"
      },
      {
        id: "t3", eventType: "escalated",
        description: "Escalated: SLA breach detected, customer requested manager",
        createdAt: "2025-05-23T09:21:00Z"
      }
    ]
  },
  {
    id: "enq_002",
    customer: "Rahul Mehta",
    channel: "email",
    status: "new",
    message: "Hi, could you please share the pricing structure for the Enterprise plan?",
    receivedAt: "2025-05-23T10:30:00Z",
    matchedSOP: "Pricing Question",
    summary: "New lead inquiring about Enterprise tier pricing details.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "Hi, could you please share the pricing structure for the Enterprise plan?",
        timestamp: "2025-05-23T10:30:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via Email",
        createdAt: "2025-05-23T10:30:00Z"
      },
      {
        id: "t2", eventType: "sop_matched",
        description: "Matched SOP: Pricing Question",
        createdAt: "2025-05-23T10:30:05Z"
      }
    ]
  },
  {
    id: "enq_003",
    customer: "Ananya Patel",
    channel: "call",
    status: "escalated",
    urgency: "high",
    message: "The billing system charged my card twice this month. Please refund the extra charge immediately.",
    receivedAt: "2025-05-23T08:45:00Z",
    matchedSOP: "Billing Issue",
    escalationReason: "High priority billing anomaly detected. Double charge complaint.",
    summary: "Customer reporting a double charge on their recent invoice. Requesting immediate refund.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "The billing system charged my card twice this month. Please refund the extra charge immediately.",
        timestamp: "2025-05-23T08:45:00Z"
      },
      {
        id: "m2", sender: "ai",
        content: "Hello Ananya, I apologize for the billing issue. I am transferring this to our finance team for an immediate review.",
        timestamp: "2025-05-23T08:46:10Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via Call",
        createdAt: "2025-05-23T08:45:00Z"
      },
      {
        id: "t2", eventType: "auto_escalated",
        description: "Auto-escalated: Potential billing error reported",
        createdAt: "2025-05-23T08:46:15Z"
      }
    ]
  },
  {
    id: "enq_004",
    customer: "Kiran Desai",
    channel: "whatsapp",
    status: "qualified",
    message: "Yes, 3 PM tomorrow works for a demo.",
    receivedAt: "2025-05-23T11:05:00Z",
    matchedSOP: "Demo Scheduling",
    summary: "Lead agreed to a product demo at 3 PM tomorrow. Needs calendar invite.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "I'm interested in seeing a demo of the new features.",
        timestamp: "2025-05-23T10:15:00Z"
      },
      {
        id: "m2", sender: "ai",
        content: "Great! Would you be available for a 30-minute session tomorrow at 3 PM?",
        timestamp: "2025-05-23T10:16:00Z"
      },
      {
        id: "m3", sender: "customer",
        content: "Yes, 3 PM tomorrow works for a demo.",
        timestamp: "2025-05-23T11:05:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via WhatsApp",
        createdAt: "2025-05-23T10:15:00Z"
      },
      {
        id: "t2", eventType: "sop_matched",
        description: "Matched SOP: Demo Scheduling",
        createdAt: "2025-05-23T10:15:05Z"
      },
      {
        id: "t3", eventType: "followup_scheduled",
        description: "Demo scheduled for tomorrow 3 PM",
        createdAt: "2025-05-23T11:06:00Z"
      }
    ]
  },
  {
    id: "enq_005",
    customer: "Vikram Nair",
    channel: "email",
    status: "resolved",
    message: "Thank you, the integration is working perfectly now.",
    receivedAt: "2025-05-22T14:20:00Z",
    matchedSOP: "Technical Support",
    summary: "Customer confirmed that the API integration issue is resolved.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "I'm having trouble connecting the CRM API. Getting a 401 error.",
        timestamp: "2025-05-22T14:20:00Z"
      },
      {
        id: "m2", sender: "agent",
        content: "Hi Vikram, please regenerate your API key from the dashboard and try again. The old keys were deprecated yesterday.",
        timestamp: "2025-05-22T15:10:00Z"
      },
      {
        id: "m3", sender: "customer",
        content: "Thank you, the integration is working perfectly now.",
        timestamp: "2025-05-23T09:00:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via Email",
        createdAt: "2025-05-22T14:20:00Z"
      },
      {
        id: "t2", eventType: "resolved",
        description: "Issue resolved by customer confirmation",
        createdAt: "2025-05-23T09:05:00Z"
      }
    ]
  },
  {
    id: "enq_006",
    customer: "Meera Iyer",
    channel: "call",
    status: "escalated",
    urgency: "medium",
    message: "I need to change the primary account holder name, but the portal won't let me.",
    receivedAt: "2025-05-23T12:15:00Z",
    matchedSOP: "Account Management",
    escalationReason: "Requires admin override to change primary account holder details.",
    summary: "Customer unable to update account holder name via self-service. Needs manual override.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "I need to change the primary account holder name, but the portal won't let me.",
        timestamp: "2025-05-23T12:15:00Z"
      },
      {
        id: "m2", sender: "ai",
        content: "Hi Meera, name changes for the primary holder require admin verification. I will escalate this to the support team to assist you today.",
        timestamp: "2025-05-23T12:16:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via Call",
        createdAt: "2025-05-23T12:15:00Z"
      },
      {
        id: "t2", eventType: "escalated",
        description: "Escalated to admin for account override",
        createdAt: "2025-05-23T12:16:05Z"
      }
    ]
  },
  {
    id: "enq_007",
    customer: "Arjun Kapoor",
    channel: "whatsapp",
    status: "new",
    message: "Do you offer any discounts for annual subscriptions?",
    receivedAt: "2025-05-23T13:40:00Z",
    matchedSOP: "Sales Inquiry",
    summary: "Asking about annual billing discounts.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "Do you offer any discounts for annual subscriptions?",
        timestamp: "2025-05-23T13:40:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via WhatsApp",
        createdAt: "2025-05-23T13:40:00Z"
      }
    ]
  },
  {
    id: "enq_008",
    customer: "Divya Menon",
    channel: "email",
    status: "qualified",
    message: "We have a team of 15 agents. Can we get a custom onboarding plan?",
    receivedAt: "2025-05-23T14:10:00Z",
    matchedSOP: "Enterprise Sales",
    summary: "High-value lead requesting custom onboarding for 15 agents.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "We have a team of 15 agents. Can we get a custom onboarding plan?",
        timestamp: "2025-05-23T14:10:00Z"
      },
      {
        id: "m2", sender: "ai",
        content: "Hi Divya, absolutely! We offer dedicated account managers for teams of your size. Our enterprise team will email you a proposal shortly.",
        timestamp: "2025-05-23T14:12:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via Email",
        createdAt: "2025-05-23T14:10:00Z"
      },
      {
        id: "t2", eventType: "sop_matched",
        description: "Matched SOP: Enterprise Sales",
        createdAt: "2025-05-23T14:11:00Z"
      }
    ]
  },
  {
    id: "enq_009",
    customer: "Sanjay Gupta",
    channel: "call",
    status: "new",
    message: "I missed a call from this number earlier today.",
    receivedAt: "2025-05-23T14:30:00Z",
    matchedSOP: "General Inquiry",
    summary: "Customer returning a missed call.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "I missed a call from this number earlier today.",
        timestamp: "2025-05-23T14:30:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via Call",
        createdAt: "2025-05-23T14:30:00Z"
      }
    ]
  },
  {
    id: "enq_010",
    customer: "Pooja Reddy",
    channel: "whatsapp",
    status: "resolved",
    message: "Got it, that clarifies everything. Thanks!",
    receivedAt: "2025-05-22T16:00:00Z",
    matchedSOP: "General Inquiry",
    summary: "Customer question answered and verified.",
    messages: [
      {
        id: "m1", sender: "customer",
        content: "Does the basic plan include WhatsApp API access?",
        timestamp: "2025-05-22T16:00:00Z"
      },
      {
        id: "m2", sender: "ai",
        content: "Hi Pooja, the Basic plan does not include WhatsApp API access. It is available on the Pro plan and above.",
        timestamp: "2025-05-22T16:01:00Z"
      },
      {
        id: "m3", sender: "customer",
        content: "Got it, that clarifies everything. Thanks!",
        timestamp: "2025-05-22T16:15:00Z"
      }
    ],
    timeline: [
      {
        id: "t1", eventType: "enquiry_created",
        description: "Enquiry received via WhatsApp",
        createdAt: "2025-05-22T16:00:00Z"
      },
      {
        id: "t2", eventType: "resolved",
        description: "Enquiry marked as resolved",
        createdAt: "2025-05-22T16:16:00Z"
      }
    ]
  }
];
