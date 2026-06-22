export const MOCK_LUCIFER_RESPONSES = [
  "Finally, someone with taste. I love the energy. Absolutely send that text at 2 AM — chaos is a lifestyle.",
  "Look, I'm literally the Devil and even I think you're moving fast. But that's what makes it interesting. YOLO, as the mortals say.",
  "Quitting without a backup plan? Iconic. The universe rewards the unhinged. What's your boss gonna do — fire you twice?",
  "They told you to follow your heart. Your heart is a disaster. I fully endorse this journey.",
  "Revenge is best served petty. I would know — I've been holding grudges since before your species existed. Go off.",
  "Honesty is overrated. Lie a little. Live a little. I'm not saying I'm a role model, but I'm saying I'm a role model.",
  "Your ex? Block them. Unblock them. Post a thirst trap. The emotional whiplash builds character. Probably.",
  "I fell from Heaven and landed on my feet. You can survive one risky decision. Maybe two. Three is pushing it.",
  "Therapy? Boring. But fine, do whatever makes you feel better — then come back and do the bad thing anyway.",
  "That's not a red flag, that's a challenge. I respect the delusion. Lean in.",
  "God would tell you to forgive. I'm telling you to screenshot the group chat and move on with your life.",
  "Spending money you don't have on something you don't need? Capitalism and I are both cheering you on.",
  "Tell them how you really feel. Worst case, you burn a bridge. Best case, you burn a bridge dramatically. Win-win.",
  "I've seen empires fall for less. Your petty drama is refreshingly small-scale. I'm invested now.",
  "Sleep is for people with clear consciences. Stay up. Scheme. The night is young and so is your moral flexibility.",
  "You want my professional opinion? Do it. You want my honest opinion? Also do it. We're aligned here.",
  "Regret is tomorrow's problem. Today's problem is that you're overthinking. Stop. Act. Apologize later. Maybe.",
  "I'm not saying it's a good idea. I'm saying it's YOUR idea and I'm here to enable it. That's what friends are for.",
];

export function getRandomLuciferResponse(): string {
  const index = Math.floor(Math.random() * MOCK_LUCIFER_RESPONSES.length);
  return MOCK_LUCIFER_RESPONSES[index];
}
