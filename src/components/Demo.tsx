import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import {
  useAccount,
  useDisconnect,
  useConnect,
} from "wagmi";

import { config } from "~/components/providers/WagmiProvider";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { generateSecureToken } from "../utils/queries";
import { Input } from "./ui/Input";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [fiatValue, setFiatValue] = useState(5);
  
  const { address, chain, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

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
      `&presetFiatAmount=${fiatValue}`;
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
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>

      <div>
        <h2 className="font-2xl font-bold">Wallet</h2>
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

        <div className="mb-4">
          <Button
            onClick={() =>
              isConnected
                ? disconnect()
                : connect({ connector: config.connectors[0] })
            }
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>

      <Input
        label="Amount"
        id="amount"
        type="number"
        value={fiatValue}
        onChange={(e) => setFiatValue(Number(e.target.value))}
        placeholder="Enter amount of USD you want to buy"
      />

      <div>
        <Button onClick={handleBuyCrypto}>
          Buy {fiatValue} USD to address on {chain?.name}
        </Button>
      </div>
    </div>
  );
}
