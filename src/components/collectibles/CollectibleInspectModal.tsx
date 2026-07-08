"use client";

import { useEffect } from "react";
import type { IndulgenceProduct } from "@/lib/indulgenceTypes";
import { resolveInspectMode } from "@/lib/collectibles/constants";
import { useInspectTracking } from "@/lib/collectibles/useServerTime";
import { Modal } from "@/components/ui";
import MagnifierGallery from "./MagnifierGallery";
import ThreeDViewer from "./ThreeDViewer";

interface CollectibleInspectModalProps {
  product: IndulgenceProduct;
  open: boolean;
  onClose: () => void;
}

export default function CollectibleInspectModal({
  product,
  open,
  onClose,
}: CollectibleInspectModalProps) {
  const mode = resolveInspectMode(product.inspectMode, product.tier);
  const { startInspecting, stopInspecting } = useInspectTracking();

  useEffect(() => {
    if (open) startInspecting();
    else stopInspecting();
  }, [open, startInspecting, stopInspecting]);

  return (
    <Modal open={open} onClose={onClose} accent="wine">
      <p className="verse-ref mb-2 text-wine">Inspect Collectible</p>
      <h3 className="mb-4 text-lg font-bold text-ink">{product.name}</h3>
      {mode === "3d" ? (
        <ThreeDViewer product={product} onInspectStart={startInspecting} />
      ) : (
        <MagnifierGallery
          assets={product.previewAssets ?? []}
          fallbackIcon={product.icon}
          onInspectStart={startInspecting}
          onInspectEnd={stopInspecting}
        />
      )}
    </Modal>
  );
}
