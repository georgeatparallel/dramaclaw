// SPDX-License-Identifier: Elastic-2.0
// Copyright (c) 2026 ClaymoreLab
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function formatIngestElapsedTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hours > 0 ? `${String(hours).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** A live elapsed-time indicator mounted only while graph ingest is active. */
export function IngestElapsedTime() {
  const { t } = useTranslation();
  const [startedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const update = () => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  return (
    <span className="shrink-0 font-mono tabular-nums text-muted-foreground/80">
      {t("ingest.elapsed", { time: formatIngestElapsedTime(elapsedSeconds) })}
    </span>
  );
}
