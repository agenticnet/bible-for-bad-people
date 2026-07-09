import BindingBar from "./BindingBar";
import BackLink from "./BackLink";
import ChamberNavMenu from "./ChamberNavMenu";

interface ChamberBindingBarProps {
  backHref?: string;
}

export default function ChamberBindingBar({ backHref = "/" }: ChamberBindingBarProps) {
  return (
    <BindingBar className="flex items-center justify-between gap-3">
      <BackLink href={backHref} />
      <ChamberNavMenu />
    </BindingBar>
  );
}
