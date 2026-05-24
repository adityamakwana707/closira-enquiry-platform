import { useMemo, useState } from "react";
import { EnquiryStatus, Channel } from "../types";
import { getEnquiryById, getLeads } from "../mock";

export function useEnquiry() {
  const [searchQuery, setSearchQuery] = useState("");

  const enquiries = getLeads();

  const filterByStatus = (status: EnquiryStatus) => {
    return enquiries.filter(e => e.status === status);
  };

  const filterByChannel = (channel: Channel) => {
    return enquiries.filter(e => e.channel === channel);
  };

  const searchEnquiries = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return enquiries.filter(e => 
      e.customer.toLowerCase().includes(lowerQuery) || 
      e.message.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredEnquiries = useMemo(() => {
    if (!searchQuery) return enquiries;
    return searchEnquiries(searchQuery);
  }, [searchQuery, enquiries]);

  return {
    enquiries,
    getEnquiryById,
    filterByStatus,
    filterByChannel,
    searchEnquiries,
    searchQuery,
    setSearchQuery,
    filteredEnquiries,
  };
}
