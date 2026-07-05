"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function FooterMap() {
  return (
    <div className="absolute inset-0 opacity-25">
      <LeafletMap />
    </div>
  );
}
