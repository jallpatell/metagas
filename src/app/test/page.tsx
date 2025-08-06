"use client"

import EthPage from "@/app/gasChartEth/page"
import PolPage from "@/app/gasChartPol/page"

import { useState } from "react"

export default function HomePage () {
  const [selectedPage, setSelectedPage] = useState("")

  const renderedPage = () => {
    switch(selectedPage){
      case "EthPage" :
        return <EthPage />
      case "PolPage" :
        return <PolPage />
      default:
        return <div> Select a page from dropdown.</div>
    }
  }

   return (
    <div className="p-8">
      <select
        className="p-2"
        value={selectedPage}
        onChange={(e) => setSelectedPage(e.target.value)}
      >
        <option value="EthPage">Page A</option>
        <option value="PolPage">Page B</option>
      </select>

      <div className="mt-4  p-4 ">
        {renderedPage()}
      </div>
    </div>
  );

}
