"use client";

import MainPage from "@/components/MainPage";
import { useState, useEffect } from "react";
import ethlogo from "../../../public/assets/ethlogo.svg";

export default function GasPage() {
  const [gasPrice, setGasPrice] = useState<string | null>(null);

  useEffect(() => {
    const socket = new window.WebSocket("ws://localhost:4001");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.gasPrice) {
          setGasPrice(data.gasPrice);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <MainPage
      gasPrice={gasPrice}
      blockchainName="Ethereum"
      imageSource={ethlogo}
    />
  );
}
