// src/opengraph-image.tsx

import { ImageResponse } from "next/og";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 800,
  height: 800,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "800",
          width: "800",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#000", // Optional: Set a background color
        }}
      >
        {/* Render the Image from the public folder */}
        <img
          src={`https://my-frames-v2-demo.vercel.app/crypto_onramp.webp`}
          alt="Coinbase Onramp"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
        {/* Optional: Add additional overlay text or elements */}
        <h1
          style={{
            position: "absolute",
            bottom: "20px",
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: "bold",
          }}
        >
          Coinbase Onramp
        </h1>
      </div>
    ),
    {
      ...size,
      // Optionally, specify the content type if different
      // contentType: "image/webp",
    }
  );
}
