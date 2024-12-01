import { useEffect, useCallback, useState, useMemo } from "react";
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

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [secureToken, setSecureToken] = useState("");
  const [context, setContext] = useState<FrameContext>();
  const [secureError, setSecureError] = useState(new Error(""))
  
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

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  // Modified secureTokenWrapper to return the token
  const secureTokenWrapper = useCallback(async (): Promise<string | null> => {
    try {
      const response = await generateSecureToken({
        ethAddress: address!,
        blockchains: [chain!.name.toLocaleLowerCase()],
      });
      if (response) {
        setSecureToken(response);
        return response;
      } else {
        setSecureToken("");
        return null;
      }
    } catch (error) {
      setSecureError(new Error(error as string));
      console.error("Error generating secure token:", error);
      return null;
    }
  }, [address, chain]);

  const linkReady = useMemo(() => secureToken.length > 0, [secureToken]);

  const link = useMemo(() => {
    if (!linkReady)
      return "Generate a secure token first to create your one time URL";
    return (
      `https://pay.coinbase.com/buy/select-asset?sessionToken=${secureToken}` +
      (chain?.name
        ? `&defaultNetwork=${chain.name.toLocaleLowerCase()}`
        : "") +
      `&fiatCurrency=USDC` +
      `&presetFiatAmount=5`
    );
  }, [linkReady, secureToken, chain?.name]);

  const launch = useCallback(async () => {
    console.log(link)
    window.location.href = link
  }, [link]);

  // New handler function to call secureTokenWrapper and then launch
  const handleBuyCrypto = useCallback(async () => {
    const token = await secureTokenWrapper();
    if (token) {
      launch();
    } else {
      alert("Failed to obtain a secure token. Please try again.");
    }
  }, [secureTokenWrapper, launch]);

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
              Address: <pre className="inline">{truncateAddress(address)}</pre>
            </div>
            <div>
              Chain: <pre className="inline">{chain?.name}</pre>
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

      <div>
        <Button onClick={handleBuyCrypto}>
          Buy Crypto
        </Button>
        {renderError(secureError)}
      </div>
    </div>
  );
}
