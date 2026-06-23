import { cn } from "@/lib/utils";
import { accentStyles, inputBase, type Accent } from "./tokens";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  accent?: Accent;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  accent?: Accent;
}

export function Input({ accent = "wine", className, ...props }: InputProps) {
  return (
    <input
      className={cn(inputBase, accentStyles[accent].focus, className)}
      {...props}
    />
  );
}

export function Textarea({ accent = "wine", className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        inputBase,
        "resize-none",
        accentStyles[accent].focus,
        className
      )}
      {...props}
    />
  );
}
