import { Metadata } from "next";
import App from "./app";

const appUrl = "https://onramp-frame.vercel.app";

const frame = {
  version: "next",
  imageUrl: `${appUrl}/crypto_onramp.webp`,
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Onramp Demo Frame",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Onramp Crypto",
    openGraph: {
      title: "Onramp Crypto to Farcaster",
      description: "app to buy crypto",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (<App />);
}
