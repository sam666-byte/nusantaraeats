"use client";

import { useEffect, useState } from "react";

export default function FooterViewCounter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/views/home", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCount(d.count || 0))
      .catch(() => {});
  }, []);

  return <>{count > 0 ? `👁 ${count.toLocaleString()}` : ""}</>;
}
