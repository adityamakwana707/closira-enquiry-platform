export type Channel = "whatsapp" | "email" | "call";
export type EnquiryStatus = "new" | "qualified" | "escalated" | "resolved";
export type FollowUpStatus = "pending" | "sent" | "done";
export type UrgencyLevel = "high" | "medium";
export type EventType =
  | "enquiry_created"
  | "sop_matched"
  | "escalated"
  | "auto_escalated"
  | "followup_scheduled"
  | "resolved";

export type Sender = "customer" | "ai" | "agent";

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string; // ISO 8601
}

export interface TimelineEvent {
  id: string;
  eventType: EventType;
  description: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  customer: string;
  channel: Channel;
  status: EnquiryStatus;
  urgency?: UrgencyLevel;
  message: string;
  receivedAt: string;
  matchedSOP?: string;
  suggestedResponse?: string;
  escalationReason?: string;
  summary?: string;
  messages: Message[];
  timeline: TimelineEvent[];
}

export interface FollowUp {
  id: string;
  enquiryId: string;
  customer: string;
  channel: Channel;
  dueAt: string;
  messagePreview: string;
  status: FollowUpStatus;
}

export interface DashboardStats {
  totalLeadsToday: number;
  missedEnquiries: number;
  openEscalations: number;
  followUpsDue: number;
}
