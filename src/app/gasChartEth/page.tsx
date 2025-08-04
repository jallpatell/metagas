"use client"
import GasChart from "@/components/GasChart"
import { useState, useEffect } from 'react'
export default function () {
    const [gasPrice, setGasPrice] = useState<string | null>("56");

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
        <div className="text-3xl align-middle  h-100 w-3xl flex  justify-center">
            <GasChart gasPrice={gasPrice}/>
        </div>
    )
}