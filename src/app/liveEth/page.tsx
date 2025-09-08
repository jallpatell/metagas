"use client";

import MainPage from "@/components/MainPage";
import { useState, useEffect } from "react";
import ethlogo from "../../../public/assets/ethlogo.svg";
import { useGasPriceFeed } from "@/utils/websocket";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function GasPage() {
  const gasPrices = useGasPriceFeed();

  // Only show loading if there is truly no data (not even cached)
  if (!gasPrices || !gasPrices.ethereum) {
    return <LoadingSkeleton />;
  }

  return (
    <MainPage
      gasPrice={gasPrices.ethereum}
      blockchainName="Ethereum"
      imageSource={ethlogo}
    />
  );
}
