"use client"
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState("")

  useEffect(() => {
    fetch('/api/index.ts')
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);


  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>Helloweey !!</h1>
      <button  > Get Product Names</button>
      <h2 className="text-white">{data}</h2>
      
    </div>
  );
}
