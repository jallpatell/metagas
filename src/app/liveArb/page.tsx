"use client";

import MainPage from "@/components/MainPage";
import arbitrumlogo from "../../../public/assets/arbitrum-logo.svg";
import { useGasPriceFeed } from "@/utils/websocket";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function GasPage() {
  const gasPrices = useGasPriceFeed();

  if (!gasPrices) {
    return <LoadingSkeleton />;
  }

  return (
    <MainPage
      gasPrice={gasPrices.arbitrum}
      blockchainName="Arbitrum"
      imageSource={arbitrumlogo}
    />
  );
}
