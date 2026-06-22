import type { TicketCategory, TicketPriority } from "./supportTypes";

const CATEGORY_RESPONSES: Record<TicketCategory, string[]> = {
  "smite-request": [
    "Your smite request has been received and logged under Violent Intent (Non-Lethal). Current queue time: 400 years. Please do not attempt smiting independently — unauthorized smiting is a violation of Heavenly Terms of Service §7.4.",
    "We have reviewed your smite request. Due to high volume of landlord-related tickets this quarter, smiting has been deferred to Q4 of the next millennium. Reference: SMT-{id}.",
    "Smite request acknowledged. Our Smite-as-a-Service team is currently at 847% capacity. Your target has been added to the waitlist. Estimated smite delivery: between 'soon' and 'never.'",
  ],
  "miracle-request": [
    "Your miracle request has been escalated to Tier 2 Celestial Support. Previous troubleshooting steps: have you tried praying harder? Ticket {id} remains open pending evidence of effort.",
    "Miracle request received. Please note that miracles are subject to availability and divine mood. Current SLA: best effort. We recommend backup plans involving human agency.",
    "We cannot fulfill your miracle at this time. Error code: MIR-403 (Insufficient Faith Credits). To purchase Faith Credits, please visit Modern Indulgences — coming soon.",
  ],
  relationship: [
    "Your relationship ticket has been assigned to the Department of Free Will. We cannot override their decisions. Have you considered communication, therapy, or accepting that some people are lessons?",
    "Ticket {id}: We have reviewed your ex situation. Our records indicate you ignored 47 red flags. Case closed as User Error. No refund available.",
    "Relationship request logged. Heavenly Administration does not offer matchmaking services. We suggest updating your standards or lowering your expectations — both are valid paths.",
  ],
  career: [
    "Career guidance request received. Our prophets are currently unavailable. In the meantime, have you tried networking, skill-building, or not posting your grievances on LinkedIn?",
    "Ticket {id}: Your request for a promotion has been forwarded to your manager. We do not have jurisdiction over middle management. Good luck.",
    "We have processed your career ticket. Divine recommendation: update your resume, stop doom-scrolling, and remember that 'everything happens for a reason' is not a career strategy.",
  ],
  vengeance: [
    "Your vengeance request violates Heavenly Policy HP-002 (Turn the Other Cheek). Ticket auto-closed. Repeated submissions may result in a plague of locusts on your inbox.",
    "Vengeance ticket {id} received. Current status: DENIED. The universe has its own timing, and frankly, yours is not it. Consider journaling.",
    "Righteous vengeance requests require supervisor approval from the Old Testament department. They are on eternal leave. Your ticket will remain in queue indefinitely.",
  ],
  "general-grievance": [
    "Your grievance has been received, filed, and promptly deprioritized. Ticket {id} is now position 2,847,291 in the Divine Queue. Thank you for your patience — or don't, we can't tell the difference.",
    "General grievance logged under 'Things We Already Know About.' No further action required on our end. Have a blessed day (terms and conditions apply).",
    "Thank you for contacting Heavenly Administration. Your feedback is important to us and will be ignored in the order it was received. Reference: {id}.",
  ],
};

const PRIORITY_ADDENDUM: Record<TicketPriority, string> = {
  low: "\n\nPriority: Low. Your ticket will be processed after all urgent smite requests and celebrity prayers.",
  medium: "\n\nPriority: Medium. We appreciate your moderate suffering.",
  high: "\n\nPriority: High. This ticket has been flagged for review by a junior angel. They are new.",
  urgent: "\n\nPriority: URGENT. We have notified GOD. GOD has read your ticket and chosen not to respond directly.",
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTicketNumber(): string {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `PRY-${num}`;
}

export function getMockSupportResponse(
  category: TicketCategory,
  priority: TicketPriority,
  ticketNumber: string,
  subject: string
): string {
  const templates = CATEGORY_RESPONSES[category];
  let response = pickRandom(templates).replace(/{id}/g, ticketNumber);

  if (subject.toLowerCase().includes("landlord")) {
    response =
      "Your request to smite your landlord has been received. Current queue time is 400 years. Please note: smiting landlords requires a premium Modern Indulgences subscription (coming soon).";
  }

  return response + PRIORITY_ADDENDUM[priority];
}
