export const MOCK_GOD_RESPONSES = [
  "I'm busy currently ignoring a prayer about a sports game, please hold.",
  "Your message has been forwarded to the Department of Irony. Estimated response time: eternity.",
  "Look, I created the universe in seven days. You're asking me about your ex? Priorities.",
  "I've seen what you did last Tuesday. Let's talk about that first.",
  "Error 403: Sin detected. Please repent or try again in 40 days and 40 nights.",
  "Your request has been logged under 'Things I Already Know.' Queue position: ∞.",
  "I'm currently on a vision quest in the desert. Leave a message after the burning bush.",
  "Interesting. Have you considered therapy? I invented free will for a reason.",
  "That prayer was auto-deleted by my spam filter. Try being more specific about your suffering.",
  "I'm not mad, I'm just... cosmically disappointed.",
  "Your landlord situation? Already smote someone else's landlord this week. Quota exceeded.",
  "Bold of you to assume I haven't been ghosting you on purpose.",
  "The angels are laughing. I'm trying to be professional here.",
  "I gave you rainbows AND free will. This is what you chose to do with both.",
  "Processing... Processing... You know what, never mind. Figure it out.",
];

export function getRandomGodResponse(): string {
  const index = Math.floor(Math.random() * MOCK_GOD_RESPONSES.length);
  return MOCK_GOD_RESPONSES[index];
}
