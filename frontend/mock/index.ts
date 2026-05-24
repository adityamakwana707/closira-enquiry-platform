import { Enquiry, FollowUp, DashboardStats } from "../types";
import { mockEnquiries } from "./enquiries";
import { mockFollowUps } from "./followups";
import { mockEscalations } from "./escalations";

export function getEnquiryById(id: string): Enquiry | undefined {
  return mockEnquiries.find(e => e.id === id);
}

export function getEscalations(): Enquiry[] {
  return mockEscalations;
}

export function getLeads(): Enquiry[] {
  return mockEnquiries;
}

export function getOverdueFollowUps(): FollowUp[] {
  const now = new Date().getTime();
  return mockFollowUps.filter(f => f.status !== "done" && new Date(f.dueAt).getTime() < now);
}

export function getDashboardStats(): DashboardStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalLeadsToday = mockEnquiries.filter(e => new Date(e.receivedAt).getTime() >= today.getTime()).length;
  // Let's pretend "new" status + no messages from us = missed
  const missedEnquiries = mockEnquiries.filter(e => e.status === "new").length;
  const openEscalations = mockEscalations.length;
  const followUpsDue = mockFollowUps.filter(f => f.status !== "done").length;

  return {
    totalLeadsToday: totalLeadsToday || 24, // fallback to match design if dates mismatch
    missedEnquiries: missedEnquiries || 3,
    openEscalations: openEscalations || 2,
    followUpsDue: followUpsDue || 5,
  };
}

export { mockEnquiries, mockFollowUps, mockEscalations };
