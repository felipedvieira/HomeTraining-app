import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f0e",
        }}
      >
        <div
          style={{
            fontSize: 99,
            fontWeight: 700,
            color: "#8dff5c",
            fontFamily: "sans-serif",
          }}
        >
          H
        </div>
      </div>
    ),
    { ...size }
  );
}
