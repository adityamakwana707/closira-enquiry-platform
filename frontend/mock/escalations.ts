import { Enquiry } from "../types";
import { mockEnquiries } from "./enquiries";

// Escalations are just enquiries with status === "escalated"
export const mockEscalations: Enquiry[] = mockEnquiries.filter(e => e.status === "escalated");
