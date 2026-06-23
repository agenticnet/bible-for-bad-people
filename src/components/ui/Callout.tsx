import { cn } from "@/lib/utils";
import {
  calloutMutedStyles,
  calloutStatusStyles,
  type Accent,
  type SemanticStatus,
} from "./tokens";

type CalloutTone = Accent | SemanticStatus;

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CalloutTone;
}

function resolveCallout(tone: CalloutTone) {
  if (tone in calloutStatusStyles) {
    return calloutStatusStyles[tone as SemanticStatus];
  }
  return calloutMutedStyles[tone as Accent];
}

export default function Callout({
  tone = "info",
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <div className={cn(resolveCallout(tone), className)} {...props}>
      {children}
    </div>
  );
}
