"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { db } from "@/lib/db";

function TrackerHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Trigger pixel pageview logging
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      db.logPixelEvent("PageView", {
        path: fullPath,
        title: typeof document !== "undefined" ? document.title : "Anera Foods Store"
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PixelTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerHandler />
    </Suspense>
  );
}
