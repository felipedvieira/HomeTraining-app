import { ImageResponse } from "next/og";

export function generateImageMetadata() {
  return [
    { id: "192", size: { width: 192, height: 192 }, contentType: "image/png" },
    { id: "512", size: { width: 512, height: 512 }, contentType: "image/png" },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id;
  const size = iconId === "512" ? 512 : 192;

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
          borderRadius: size * 0.2,
        }}
      >
        <div
          style={{
            fontSize: size * 0.55,
            fontWeight: 700,
            color: "#8dff5c",
            fontFamily: "sans-serif",
          }}
        >
          T
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
