// src/opengraph-image.tsx

import { ImageResponse } from "next/og";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 800,
  height: 800,
};

export const contentType = "image/webp"; // Updated to match the image format

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: 800, // Changed from "800" to 800
          width: 800,  // Changed from "800" to 800
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#000", // Optional: Set a background color
        }}
      >
        {/* Render the Image from the public folder using a relative path */}
        <img
          src="https://my-frames-v2-demo.vercel.app/crypto_onramp.webp" // Changed to relative path
          alt="Coinbase Onramp"
          width={800}  // Explicit width
          height={800} // Explicit height
          style={{
            maxWidth: 800,  // Changed from "800" to 800
            maxHeight: 800, // Changed from "800" to 800
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
