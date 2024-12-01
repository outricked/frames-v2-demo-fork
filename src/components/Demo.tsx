import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import {
  useAccount,
} from "wagmi";

import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { generateSecureToken } from "../utils/queries";
import { Input } from "~/components/ui/Input";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [fiatValue, setFiatValue] = useState("");
  
  const { address, chain } = useAccount();

  useEffect(() => {
    const load = async () => {
      try {
        const sdkContext = await sdk.context;
        setContext(sdkContext);
        sdk.actions.ready();
        console.log(context)
      } catch (error) {
        console.error("Failed to load SDK context:", error);
      }
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded, context]);

  // Modified secureTokenWrapper to return the token
  const secureTokenWrapper = useCallback(async (): Promise<string | null> => {
    try {
      const response = await generateSecureToken({
        ethAddress: address!,
        blockchains: [chain!.name.toLocaleLowerCase()],
      });
      if (response) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error generating secure token:", error);
      return null;
    }
  }, [address, chain]);

  // New handler function to call secureTokenWrapper and then launch
  const handleBuyCrypto = useCallback(async () => {
    const token = await secureTokenWrapper();
    if (token) {
      const constructedLink =
      `https://pay.coinbase.com/buy/select-asset?sessionToken=${token}` +
      (chain?.name
        ? `&defaultNetwork=${chain.name.toLocaleLowerCase()}`
        : "") +
      `&fiatCurrency=USD` +
      `&presetFiatAmount=${fiatValue}` + 
      `&defaultAsset=USDC` +
      `&redirectUrl=${encodeURIComponent("https://my-frames-v2-demo.vercel.app/")}` +
      `&defaultPaymentMethod=APPLE_PAY`;
      console.log(constructedLink);
      window.location.href = constructedLink;
    } else {
      alert("Failed to generate Onramp URL");
    }
  }, [secureTokenWrapper, chain?.name, fiatValue]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Onramp Crypto To Farcaster Wallet</h1>
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

      <br></br>
      <div>
      <h2 className="font-2xl font-bold">Enter USD amount</h2>
      <Input
        id="amount"
        type="text"
        value={fiatValue}
        onChange={(e) => setFiatValue(e.target.value)}
        placeholder="5"
      />
      
      <br></br>
      <h2 className="font-2xl font-bold">Enter Crypto Asset</h2>
        <Input
          id="amount"
          type="text"
          value={fiatValue}
          onChange={(e) => setFiatValue(e.target.value)}
          placeholder="5"
        />
      </div>
      <br></br>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
    </div>
      <div>
        <Button onClick={handleBuyCrypto}>
          Buy {fiatValue} USDC to {chain?.name}
        </Button>
      </div>
    </div>
  );
}
