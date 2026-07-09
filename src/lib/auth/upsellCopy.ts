import type { LocalDataSummary } from "./localDataSummary";
import { getLocalDataSummary, getTotalLocalItems } from "./localDataSummary";
import { INDULGENCE_PRODUCTS } from "@/lib/indulgenceProducts";

export type LossContext =
  | "smite"
  | "oracle"
  | "sin"
  | "confessional"
  | "chat"
  | "indulgences"
  | "support"
  | "generic";

export function smiteSaveCopy(summary: LocalDataSummary = getLocalDataSummary()): string {
  const total = summary.smiteCount + 1;
  return `This smite vanishes when you leave. Claim your ledger to keep ${total} smite${total === 1 ? "" : "s"} and your plague history.`;
}

export function oracleLockCopy(summary: LocalDataSummary = getLocalDataSummary()): string {
  const score = summary.oracleDoomScore ?? "?";
  return `Today's doom score (${score}/10) isn't saved yet. Create a ledger before midnight resets it.`;
}

export function sinLogCopy(summary: LocalDataSummary = getLocalDataSummary()): string {
  if (summary.sinCount === 0) {
    return "This translation won't sync across devices. Lose it, or claim your ledger.";
  }
  return `You have ${summary.sinCount} sin${summary.sinCount === 1 ? "" : "s"} on this device that won't sync. Lose them, or claim your ledger.`;
}

export function confessionalPostCopy(): string {
  return "Your confession preview disappears when you leave. Post as you and let strangers judge you properly.";
}

export function chatSaveCopy(summary: LocalDataSummary = getLocalDataSummary()): string {
  if (summary.chatPreviewUsed) {
    return "This conversation won't survive a browser refresh. Claim your ledger before divine amnesia sets in.";
  }
  return "One free message down. Save the full conversation before the binding forgets you.";
}

export function smiteLimitCopy(): string {
  return "Your last free smite is gone. Without premium, today's wrath history resets at midnight.";
}

export function starterPackCopy(starterPackId: string): string {
  const product = INDULGENCE_PRODUCTS.find((p) => p.id === starterPackId);
  const name = product?.name ?? "starter pack";
  return `Your selected ${name} won't be reserved. Someone else might absolve your petty sin first.`;
}

export function indulgenceCheckoutCopy(): string {
  return "Certificates in your vault vanish without an account. Complete your ledger before the marketplace forgets you.";
}

export function supportTicketCopy(): string {
  return "Prayer tickets require a ledger. Sign in to file requests and track Heavenly Administration's corporate non-responses.";
}

export function genericAuthCopy(): string {
  const total = getTotalLocalItems();
  if (total > 0) {
    return `You have ${total} unsaved item${total === 1 ? "" : "s"} on this device. Browsing is free — losing your progress is not.`;
  }
  return "Browsing is free — salvation costs extra. Claim your ledger before your sins evaporate.";
}

export function getLossCopy(context: LossContext): string {
  const summary = getLocalDataSummary();
  switch (context) {
    case "smite":
      return smiteSaveCopy(summary);
    case "oracle":
      return oracleLockCopy(summary);
    case "sin":
      return sinLogCopy(summary);
    case "confessional":
      return confessionalPostCopy();
    case "chat":
      return chatSaveCopy(summary);
    case "indulgences":
      return indulgenceCheckoutCopy();
    case "support":
      return supportTicketCopy();
    case "generic":
      return genericAuthCopy();
    default: {
      const _exhaustive: never = context;
      return _exhaustive;
    }
  }
}

export function getSignUpModalTitle(context: LossContext): string {
  switch (context) {
    case "smite":
      return "Save Your Smite";
    case "oracle":
      return "Lock In Today's Doom";
    case "sin":
      return "Keep Your Sin Log";
    case "confessional":
      return "Post Your Confession";
    case "chat":
      return "Save This Conversation";
    case "indulgences":
      return "Complete Your Purchase";
    case "support":
      return "File a Prayer Ticket";
    case "generic":
      return "Claim Your Ledger";
    default: {
      const _exhaustive: never = context;
      return _exhaustive;
    }
  }
}
