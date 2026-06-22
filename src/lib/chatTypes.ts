export interface Message {
  id: string;
  role: "user" | "god";
  content: string;
  timestamp: Date;
}

export const INITIAL_GOD_MESSAGE: Message = {
  id: "welcome",
  role: "god",
  content:
    "Ah, another soul seeking answers. I was just watching a TikTok about locusts. What do you want? And make it interesting — I've heard every prayer about parking spots.",
  timestamp: new Date(),
};
