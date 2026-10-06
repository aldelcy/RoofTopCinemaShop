"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/paths";

export function Poster({ src, title, compact = false }: { src: string; title: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={compact ? "poster poster-compact" : "poster"}>
      {failed ? (
        <div className="poster-fallback">
          <span>Poster</span>
          <strong>{title}</strong>
        </div>
      ) : (
        <img src={assetUrl(src)} alt="" onError={() => setFailed(true)} />
      )}
    </div>
  );
}
