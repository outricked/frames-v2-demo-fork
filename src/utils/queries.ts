import { AggregatorInputParams } from "./types";

export async function generateSecureToken({
    ethAddress,
    blockchains,
  }: {
    ethAddress: string;
    aggregatorInputs?: AggregatorInputParams;
    showBuyQuoteURLText?: boolean;
    blockchains?: string[];
  }): Promise<string> {
    try {
      console.log("generateSecureToken");
      const response = await fetch("/api/secure-token", {
        method: "POST",
        body: JSON.stringify({ ethAddress, blockchains: blockchains }),
      });
      if (!response.ok) {
        console.log(await response.text());
        throw new Error(
          "Failed to fetch secure token: ensure valid inputs, crypto wallet matches network, and secure connection"
        );
      }
      const json = await response.json();
      return json.token;
    } catch (error) {
      throw error;
    }
  }