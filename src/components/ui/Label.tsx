import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  muted?: boolean;
}

export default function Label({
  muted = true,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "verse-ref mb-1.5 block",
        muted ? "text-ink-soft" : "text-ink",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
