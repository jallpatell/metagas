"use client"
import GasChart from "@/app/components/GasChart"
import { useState, useEffect } from 'react'
export default function () {
    const [gasPrice, setGasPrice] = useState<string | null>(null);

    useEffect(() => {
    const socket = new WebSocket('ws://localhost:4001');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.gasPrice) {
        setGasPrice(data.gasPrice);
      }
    };
    return () => socket.close();
  }, []);
    
    return (
        <div className="text-3xl align-middle  h-screen flex  justify-center">
            <div className="p-4 text-lg font-mono">
                Current Ethereum Gas Price: {gasPrice ? `${gasPrice} Gwei` : 'Loading...'}
            </div>
            <GasChart gasPrice={gasPrice}/>
        </div>
    )
}