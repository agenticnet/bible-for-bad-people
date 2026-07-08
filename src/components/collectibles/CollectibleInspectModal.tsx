"use client";

import { useEffect } from "react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { resolveInspectMode } from "@/lib/collectibles/constants";
import { useInspectTracking } from "@/lib/collectibles/useServerTime";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BottomSheet, Modal } from "@/components/ui";
import MagnifierGallery from "./MagnifierGallery";
import ThreeDViewer from "./ThreeDViewer";

interface CollectibleInspectModalProps {
  product: IndulgenceProduct;
  open: boolean;
  onClose: () => void;
}

function InspectContent({
  product,
  onInspectStart,
  onInspectEnd,
}: {
  product: IndulgenceProduct;
  onInspectStart: () => void;
  onInspectEnd: () => void;
}) {
  const mode = resolveInspectMode(product.inspectMode, product.tier);

  return (
    <>
      <p className="verse-ref mb-2 text-wine">Inspect Collectible</p>
      <h3 className="mb-4 text-lg font-bold text-ink">{product.name}</h3>
      {mode === "3d" ? (
        <ThreeDViewer product={product} onInspectStart={onInspectStart} />
      ) : (
        <MagnifierGallery
          assets={product.previewAssets ?? []}
          fallbackIcon={product.icon}
          onInspectStart={onInspectStart}
          onInspectEnd={onInspectEnd}
        />
      )}
    </>
  );
}

export default function CollectibleInspectModal({
  product,
  open,
  onClose,
}: CollectibleInspectModalProps) {
  const isMobile = useIsMobile();
  const { startInspecting, stopInspecting } = useInspectTracking();

  useEffect(() => {
    if (open) startInspecting();
    else stopInspecting();
  }, [open, startInspecting, stopInspecting]);

  const content = (
    <InspectContent
      product={product}
      onInspectStart={startInspecting}
      onInspectEnd={stopInspecting}
    />
  );

  if (isMobile) {
    return (
      <BottomSheet open={open} onClose={onClose} accent="wine" title={product.name}>
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal open={open} onClose={onClose} accent="wine">
      {content}
    </Modal>
  );
}
