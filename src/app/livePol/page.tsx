"use client";

import MainPage from "@/components/MainPage";
import polygonlogo from "../../../public/assets/polygon-matic-logo.svg"; // Assuming this exists
import { useGasPriceFeed } from "@/utils/websocket";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function GasPage() {
  const gasPrices = useGasPriceFeed();

  if (!gasPrices) {
    return <LoadingSkeleton />;
  }

  return (
    <MainPage
      gasPrice={gasPrices.polygon}
      blockchainName="Polygon"
      imageSource={polygonlogo}
    />
  );
}
