import { cn } from "@/lib/utils";
import { accentStyles, inputBase, type Accent } from "./tokens";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  accent?: Accent;
}

export default function Select({
  accent = "wine",
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(inputBase, accentStyles[accent].focus, className)}
      {...props}
    >
      {children}
    </select>
  );
}
