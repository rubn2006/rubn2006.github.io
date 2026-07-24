import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fef3ee 0%, #fde3d8 50%, #fce8f3 100%)",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 90,
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e0492f",
          borderRadius: 32,
          marginBottom: 40,
        }}
      >
        🍓
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, color: "#1c1b23", textAlign: "center" }}>
        {siteConfig.name}
      </div>
      <div style={{ fontSize: 32, color: "#4b4a55", marginTop: 20, textAlign: "center" }}>
        Transforme une idée en série vidéo virale
      </div>
    </div>,
    { ...size },
  );
}
