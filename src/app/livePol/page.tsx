"use client"
import GasChart from "@/components/MainPage"
import { useState, useEffect } from 'react'
import polyLogo from "../../../public/assets/polygon-matic-logo.svg"
export default function () {
    const [gasPrice, setGasPrice] = useState<string | null>(null);

    useEffect(() => {
    const socket = new WebSocket('ws://localhost:4002');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.gasPrice) {
        setGasPrice(data.gasPrice);
      }
    };
    return () => socket.close();
  }, []);
    
    return (
        <div>
          <GasChart gasPrice={ gasPrice } blockchainName="Polygon" imageSource={"assets/polygon-matic-logo.svg"}/>
        </div>
    )
}