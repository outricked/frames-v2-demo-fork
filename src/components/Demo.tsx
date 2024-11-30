import { useEffect, useCallback, useState, useMemo } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
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
  const [txHash, setTxHash] = useState<string | null>(null);
  const [secureError, setSecureError] = useState(new Error(""))
  
  const { address, chain, isConnected } = useAccount();
  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const {
    signMessage,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const {
    signTypedData,
    error: signTypedError,
    isError: isSignTypedError,
    isPending: isSignTypedPending,
  } = useSignTypedData();

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

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
        data: "0x9846cd9efc000023c0",
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction]);

  const sign = useCallback(() => {
    signMessage({ message: "Hello from Frames v2!" });
  }, [signMessage]);

  const signTyped = useCallback(() => {
    signTypedData({
      domain: {
        name: "Frames v2 Demo",
        version: "1",
        chainId: 8453,
      },
      types: {
        Message: [{ name: "content", type: "string" }],
      },
      message: {
        content: "Hello from Frames v2!",
      },
      primaryType: "Message",
    });
  }, [signTypedData]);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return <div className="text-red-500 text-xs mt-1">{error.message}</div>;
  };

  // Modified secureTokenWrapper to return the token
  const secureTokenWrapper = useCallback(async (): Promise<string | null> => {
    try {
      const response = await generateSecureToken({
        ethAddress: address!,
        blockchains: [chain!.name!],
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
        ? `&defaultNetwork=${chain.name}`
        : "") +
      `&fiatCurrency=USDC` +
      `&presetFiatAmount=5`
    );
  }, [linkReady, secureToken, chain?.name]);

  const launch = useCallback(() => {
    window.open(link, "_blank", "popup,width=540,height=700");
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

        {isConnected && (
          <>
            <div className="mb-4">
              <Button
                onClick={sendTx}
                disabled={!isConnected || isSendTxPending}
                isLoading={isSendTxPending}
              >
                Send Transaction
              </Button>
              {isSendTxError && renderError(sendTxError)}
              {txHash && (
                <div className="mt-2 text-xs">
                  <div>Hash: {truncateAddress(txHash)}</div>
                  <div>
                    Status:{" "}
                    {isConfirming
                      ? "Confirming..."
                      : isConfirmed
                      ? "Confirmed!"
                      : "Pending"}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <Button
                onClick={sign}
                disabled={!isConnected || isSignPending}
                isLoading={isSignPending}
              >
                Sign Message
              </Button>
              {isSignError && renderError(signError)}
            </div>
            <div className="mb-4">
              <Button
                onClick={signTyped}
                disabled={!isConnected || isSignTypedPending}
                isLoading={isSignTypedPending}
              >
                Sign Typed Data
              </Button>
              {isSignTypedError && renderError(signTypedError)}
            </div>
          </>
        )}
      </div>

      <div>
        <Button onClick={handleBuyCrypto} disabled={!isConnected}>
          Buy Crypto
        </Button>
        {renderError(secureError)}
      </div>
    </div>
  );
}
