"use client"
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState("")
 
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>Helloweey !!</h1>
      <button onClick={} className="bg-amber-400 text-black text-bold border-1 rounded-xl p-3 hover:text-white hover:bg-amber-900"> Get Product Names</button>
      <h2 className="text-white">{data}</h2>
      
    </div>
  );
}
