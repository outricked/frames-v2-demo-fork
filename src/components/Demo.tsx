import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useAccount } from "wagmi";

import { truncateAddress } from "~/lib/truncateAddress";
import { generateSecureToken } from "../utils/queries";
import { Input } from "~/components/ui/Input";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [fiatValue, setFiatValue] = useState("5");
  const [cryptoCurrency, setCryptoCurrency] = useState("USDC");

  const { address, chain } = useAccount();

  // Load the SDK context
  useEffect(() => {
    const load = async () => {
      try {
        const sdkContext = await sdk.context;
        setContext(sdkContext);
        sdk.actions.ready();
        console.log(context);
      } catch (error) {
        console.error("Failed to load SDK context:", error);
      }
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded, context]);

  // Generate a secure token
  const secureTokenWrapper = useCallback(async (): Promise<string | null> => {
    try {
      const response = await generateSecureToken({
        ethAddress: address!,
        blockchains: [chain!.name.toLowerCase()],
      });
      return response || null;
    } catch (error) {
      console.error("Error generating secure token:", error);
      return null;
    }
  }, [address, chain]);

  // Handle buying crypto
  const handleBuyCrypto = useCallback(async () => {
    if (!address || !chain) {
      console.error("Address or chain is missing.");
      return;
    }

    const token = await secureTokenWrapper();
    if (token) {
      const constructedLink =
        `https://pay.coinbase.com/buy/select-asset?sessionToken=${token}` +
        `&appId=1efa9181-4abd-677b-b3f3-d67b60d6c960` +
        `&fiatCurrency=USD` +
        '&defaultPaymentMethod=APPLE_PAY' +
        `&presetFiatAmount=${fiatValue}` +
        `&defaultAsset=${cryptoCurrency}` +
        `&redirectUrl=${encodeURIComponent("https://my-frames-v2-demo.vercel.app/")}`;
      console.log("Redirecting to:", constructedLink);
      window.location.href = constructedLink;
    } else {
      alert("Failed to generate Onramp URL. Asset or Network is unsupported");
    }
  }, [secureTokenWrapper, chain, fiatValue, cryptoCurrency, address]);

  // Automatically call handleBuyCrypto when SDK is loaded and address & chain are available
  useEffect(() => {
    if (isSDKLoaded && address && chain) {
      handleBuyCrypto();
    }
  }, [isSDKLoaded, address, chain, handleBuyCrypto]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">
        Onramp Crypto To Farcaster Wallet
      </h1>
      <div>
        <h2 className="font-2xl font-bold">Connected Wallet</h2>
        {address && (
          <div className="my-2 text-xs">
            <div>
              Detected Address: <pre className="inline">{truncateAddress(address)}</pre>
            </div>
            <div>
              Detected Chain: <pre className="inline">{chain?.name}</pre>
            </div>
          </div>
        )}
      </div>

      <br />
      <div>
        <h2 className="font-2xl font-bold">Enter USD amount - Default is 5</h2>
        <Input
          id="amount"
          type="text"
          value={fiatValue}
          onChange={(e) => setFiatValue(e.target.value)}
          placeholder="5"
        />

        <br />
        <h2 className="font-2xl font-bold">Enter Crypto Asset - Default is USDC</h2>
        <Input
          id="cryptoAsset"
          type="text"
          value={cryptoCurrency}
          onChange={(e) => setCryptoCurrency(e.target.value)}
          placeholder="USDC"
        />
      </div>

      {/* Removed the button since handleBuyCrypto is called automatically */}
    </div>
  );
}
