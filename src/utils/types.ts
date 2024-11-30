export type AggregatorInputParams = {
    quoteID: string;
    defaultAsset: string;
    defaultNetwork?: string;
    defaultPaymentMethod: string;
  
    fiatCurrency: string;
    presentFiatAmount: string;
};

export type GenerateSecureTokenRequest = {
    aggregatorInputs?: AggregatorInputParams;
    showBuyQuoteURLText?: boolean;
    blockchains?: string[];
  };