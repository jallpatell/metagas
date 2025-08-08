"use client";

import MainPage from "@/components/MainPage";
import { useState, useEffect } from "react";
import ethLogo from "../../../public/assets/ethlogo.svg"

export default function GasPage() {
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // trigger re-render every second

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4001");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.gasPrice) {
        setGasPrice(data.gasPrice);
      }
    };
    return () => socket.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // this will cause re-render every 1s
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainPage gasPrice={gasPrice} blockchainName="Ethereum Gas" imageSource={ethLogo}/>
  );
}
